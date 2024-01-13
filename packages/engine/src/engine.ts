/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcidicConfig } from "@acidic/config";
import { PLUGIN_MODULE_NAME, STD_LIB_MODULE_NAME } from "@acidic/language";
import { AcidicServices, createAcidicServices } from "@acidic/language-server";
import {
  resolveImport,
  resolveTransitiveImports
} from "@acidic/language-server/utilities";
import {
  AbstractDeclaration,
  AcidicSchema,
  isAcidicDataSource,
  isAcidicPlugin,
  isAcidicSchema
} from "@acidic/language/definition";
import { getLiteral, mergeBaseSchema } from "@acidic/language/utils";
import { PluginDefinition, ServiceDefinition } from "@acidic/schema";
import { StormDateTime } from "@storm-stack/date-time";
import { StormError, isStormError } from "@storm-stack/errors";
import { PackageManagers, exists } from "@storm-stack/file-system";
import { IStormLog, StormLog } from "@storm-stack/logging";
import { PluginDiscoveryMode, PluginManager } from "@storm-stack/plugin-system";
import { StormParser } from "@storm-stack/serialization";
import {
  NEWLINE_STRING,
  isError,
  isSetObject,
  isString
} from "@storm-stack/utilities";
import chalk from "chalk";
import { readFileSync } from "fs";
import {
  AstNode,
  LangiumDocument,
  LangiumDocuments,
  Mutable,
  ValidationCategory,
  getDocument
} from "langium";
import { NodeFileSystem } from "langium/node";
import { dirname, extname, join, resolve } from "path";
import { URI } from "vscode-uri";
import { AcidicErrorCode } from "./errors";
import { AcidicDefinitionWrapper } from "./schema/acidic-definition-wrapper";
import {
  AcidicContext,
  AcidicPluginHookNames,
  AcidicPluginModule
} from "./types";
import { ensureOutputFolder } from "./utils/plugin-utils";
import { getVersion } from "./utils/version-utils";

export interface AcidicEngineOptions {
  schema: string | AcidicSchema | ServiceDefinition;
  packageManager?: PackageManagers;
  outputPath?: string;
}

export class AcidicEngine {
  #services: AcidicServices;
  #stdLib: LangiumDocument<AstNode>;
  #logger: IStormLog;
  #config: AcidicConfig;
  #pluginManager: PluginManager<AcidicContext, AcidicPluginModule>;

  public readonly version: string;
  public readonly outputPath: string;

  public static create = async (
    config: AcidicConfig,
    logger: IStormLog
  ): Promise<AcidicEngine> => {
    const engine = new AcidicEngine(config, logger);
    engine.#pluginManager = await PluginManager.create(
      engine.#logger as any,
      {
        rootPath: config.workspaceRoot,
        useNodeModules: true,
        discoveryMode: PluginDiscoveryMode.FALLBACK,
        defaultLoader: "@acidic/engine/plugins/acidic-plugin-loader"
      } as any
    );

    return engine;
  };

  private constructor(config: AcidicConfig, logger: IStormLog) {
    this.#config = config;
    this.#logger = logger ?? StormLog.create(this.#config, "Acidic Engine");

    this.version = getVersion();
    this.#logger.info(
      `Initializing the Acidic Engine v${this.version ? this.version : "1.0.0"}`
    );
    this.#services = createAcidicServices(NodeFileSystem).Acidic;

    const stdLibFile = URI.file(
      resolve(join(__dirname, "res", STD_LIB_MODULE_NAME))
    );

    this.#logger
      .info(`Loading standard library file from '${stdLibFile.toString()}'
JSON File:
${StormParser.stringify(stdLibFile.toJSON())}`);

    this.#stdLib =
      this.#services.shared.workspace.LangiumDocuments.getOrCreateDocument(
        stdLibFile
      );

    this.outputPath =
      ensureOutputFolder() ??
      join(config.workspaceRoot, "./node_modules/.storm");
  }

  public execute = async (
    options: AcidicEngineOptions
  ): Promise<StormError | AcidicContext> => {
    this.#logger.start("Acidic Engine");

    try {
      this.#logger.info(`Running the 🧪 Acidic Engine v${this.version}`);

      const context = await this.prepare(options);
      if (isStormError(context)) {
        throw context;
      }

      this.#logger.start("Running Plugins");

      let issues: Array<{ plugin: string; error: Error }> = [];
      const executionDateTime = StormDateTime.current();

      const results = await Promise.all(
        context.wrapper.service.plugins.map(plugin => {
          try {
            if (plugin.provider) {
              context.currentPlugin = this.#pluginManager.getInstance(
                plugin.provider,
                plugin.options
              );

              return Promise.resolve(
                this.#pluginManager.execute(
                  plugin.provider,
                  context,
                  plugin.options,
                  executionDateTime as any
                )
              );
            }
          } catch (e) {
            this.#logger.error(e);
            issues.push({
              plugin: plugin.name,
              error: StormError.create(e)
            });
          }

          return Promise.resolve(null);
        })
      );

      this.#logger.stopwatch("Running Plugins");

      issues = results
        .filter(isSetObject)
        .reduce(
          (
            ret: Array<{ plugin: string; error: Error }>,
            result: Record<string, Error | null>
          ) => {
            return Object.keys(result).reduce(
              (
                innerRet: Array<{ plugin: string; error: Error }>,
                plugin: string
              ) => {
                if (isError(result[plugin])) {
                  innerRet.push({
                    plugin: plugin,
                    error: result[plugin]!
                  });
                }

                return innerRet;
              },
              ret
            );
          },
          issues
        );

      const resultsLineWidth = context.wrapper.service.plugins.reduce(
        (ret: number, plugin) => {
          return plugin.provider.length > ret ? plugin.provider.length : ret;
        },
        75
      );
      this.#logger.info(
        `\n${chalk
          .hex(this.#config.colors.primary)
          .bold(
            issues.length === 0
              ? `⚡ All ${
                  this.#pluginManager.getStore().size
                } Acidic plugins completed successfully!`
              : `⚡ Acidic Engine completed running ${
                  this.#pluginManager.getStore().size
                } plugins!`
          )}${NEWLINE_STRING}${NEWLINE_STRING}${context.wrapper.service.plugins
          .map(
            (plugin: PluginDefinition, i: number) =>
              `${chalk.gray(`${i + 1}.`)} ${
                issues.some(issue => issue.plugin === plugin.provider)
                  ? `${chalk.hex(this.#config.colors.error).bold(
                      `${plugin.provider} ${Array.from(
                        Array(resultsLineWidth - plugin.provider.length - 11)
                      )
                        .map(_ => "-")
                        .join("")} FAILED X`
                    )}${NEWLINE_STRING}${chalk.hex(this.#config.colors.error)(
                      `   -> ${
                        issues.find(issue => issue.plugin === plugin.provider)
                          ?.error ?? "No failures recorded"
                      }`
                    )}`
                  : `${chalk.hex(this.#config.colors.success).bold(
                      `${plugin.provider} ${Array.from(
                        Array(resultsLineWidth - plugin.provider.length - 11)
                      )
                        .map(_ => "-")
                        .join("")} SUCCESS ✓`
                    )}`
              }`
          )
          .join(
            NEWLINE_STRING
          )}${NEWLINE_STRING}${NEWLINE_STRING}${chalk.gray.bold(
          "Please Note:"
        )} ${chalk.gray(
          "Don't forget to restart your dev server to allow the changes take effect"
        )}\n`
      );

      this.#logger.success(
        `${NEWLINE_STRING}🎉 The Acidic Engine has successfully completed processing!${NEWLINE_STRING}`
      );

      return context;
    } catch (error) {
      this.#logger.error(error);

      return StormError.create(error);
    } finally {
      this.#logger.stopwatch("Acidic Engine");
    }
  };

  public prepare = async (
    options: AcidicEngineOptions
  ): Promise<StormError | AcidicContext> => {
    this.#logger.start("Acidic Engine - Prepare");

    options.outputPath ??= "./node_modules/.storm";
    options.packageManager ??= PackageManagers.NPM;

    try {
      this.#logger.start("Creating Context");

      let context = await this.createContext(options);

      this.#logger.stopwatch("Creating Context");

      if (context.wrapper.service.plugins.length === 0) {
        this.#logger.warn(
          "No plugins specified for this schema. No processing will be performed (please ensure this is expected)."
        );
      } else {
        context = await this.#pluginManager.invokeHook(
          AcidicPluginHookNames.EXTEND_CONTEXT,
          context
        );

        this.#logger.start("Preparing Definition");

        context = await this.#pluginManager.invokeHook(
          AcidicPluginHookNames.EXTEND_DEFINITION,
          context
        );

        this.#logger.info(
          `🧪 The Acidic server definition ${
            context.wrapper.service.name
          } contains: ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${context.wrapper.service.plugins?.length ?? 0} Plugins`
            )} ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${context.wrapper.service.models?.length ?? 0} Models`
            )} ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${context.wrapper.service.objects?.length ?? 0} Objects`
            )} ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${context.wrapper.service.enums?.length ?? 0} Enums`
            )} ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${context.wrapper.service.events?.length ?? 0} Events`
            )} ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${context.wrapper.service.queries?.length ?? 0} Query Operations`
            )} ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${
                context.wrapper.service.mutations?.length ?? 0
              } Mutation Operations`
            )} ${NEWLINE_STRING}${chalk
            .hex(this.#config.colors.primary)
            .bold(
              `${
                context.wrapper.service.subscriptions?.length ?? 0
              } Subscriptions Operations`
            )} that will be used to generate the service.${NEWLINE_STRING}`
        );

        this.#logger.stopwatch("Preparing Definition");

        this.#logger.start("Validation");

        context = await this.#pluginManager.invokeHook(
          AcidicPluginHookNames.VALIDATE,
          context
        );

        this.#logger.stopwatch("Validation");
      }

      return context;
    } catch (error) {
      this.#logger.error(error);

      return StormError.create(error);
    } finally {
      this.#logger.stopwatch("Acidic Engine - Prepare");
    }
  };

  /**
   * Loads a Acidic document from a file.
   *
   * @param fileName File name
   * @returns Parsed and validated AST
   */
  private createContext = async (
    options: AcidicEngineOptions
  ): Promise<AcidicContext> => {
    if (!options.schema) {
      throw new StormError(AcidicErrorCode.missing_schema, {
        message: "A valid definition must be provided to the Acidic Engine"
      });
    }

    let modelPath: string | undefined;
    let model: AcidicSchema | undefined;
    let schema!: AcidicDefinitionWrapper;
    if (isString(options.schema)) {
      model = await this.readSchemaFile(options.schema);
      modelPath = options.schema;
      schema = AcidicDefinitionWrapper.loadDefinition(model);
    } else if (isAcidicSchema(options.schema)) {
      model = options.schema;
      schema = AcidicDefinitionWrapper.loadDefinition(model);
    } else {
      schema = AcidicDefinitionWrapper.loadDefinition(options.schema);
    }

    return {
      schema: model,
      schemaPath: modelPath,
      wrapper: schema,
      config: this.#config.extensions.acidic,
      logger: this.#logger
    };
  };

  /**
   * Loads a Acidic document from a file.
   *
   * @param fileName File name
   * @returns Parsed and validated AST
   */
  private readSchemaFile = async (fileName: string): Promise<AcidicSchema> => {
    const extensions = this.#services.LanguageMetaData.fileExtensions;
    if (!extensions.includes(extname(fileName))) {
      throw new StormError(AcidicErrorCode.invalid_schema_extension, {
        message: `Invalid definition file. Please choose a file with extension: ${extensions}.`
      });
    }

    if (!exists(fileName)) {
      throw new StormError(AcidicErrorCode.invalid_schema, {
        message: `File ${fileName} does not exist.`
      });
    }

    // load documents provided by plugins
    const fileContent = readFileSync(fileName, { encoding: "utf-8" });
    const parsed = this.#services.parser.LangiumParser.parse(fileContent)
      ?.value as AcidicSchema;

    const pluginDocuments = parsed?.declarations.reduce(
      (ret: LangiumDocument[], decl: AbstractDeclaration) => {
        if (isAcidicPlugin(decl)) {
          const providerField = decl.fields.find(f => f.name === "provider");
          if (providerField) {
            const provider = getLiteral<string>(providerField.value);
            if (provider) {
              try {
                const pluginEntrance = require.resolve(`${provider}`);
                const pluginModelFile = join(
                  dirname(pluginEntrance),
                  PLUGIN_MODULE_NAME
                );
                if (exists(pluginModelFile)) {
                  ret.push(
                    this.#services.shared.workspace.LangiumDocuments.getOrCreateDocument(
                      URI.file(pluginModelFile)
                    )
                  );
                }
              } catch {
                // noop
              }
            }
          }
        }

        return ret;
      },
      []
    );

    const langiumDocuments = this.#services.shared.workspace.LangiumDocuments;

    const file = URI.file(resolve(fileName));

    this.#logger.info(`Loading langium file from '${file.toString()}'
JSON File:
${JSON.stringify(file.toJSON())}`);

    // load the document
    const document = langiumDocuments.getOrCreateDocument(file);
    await this.#services.shared.workspace.DocumentBuilder.build(
      [
        this.#stdLib,
        ...pluginDocuments,
        document,
        ...this.eagerLoadAllImports(document, langiumDocuments).map(uri =>
          langiumDocuments.getOrCreateDocument(uri)
        )
      ],
      {
        validation: {
          categories: ValidationCategory.all as ValidationCategory[]
        }
      }
    );

    const validationErrors = langiumDocuments.all
      .flatMap(d => d.diagnostics ?? [])
      .filter(e => e.severity === 1)
      .toArray();

    if (validationErrors.length > 0) {
      this.#logger.error(
        `Service definition validation errors: \n${validationErrors
          .map(
            validationError =>
              `line ${validationError.range.start.line + 1}: ${
                validationError.message
              } [${document.textDocument.getText(validationError.range)}]`
          )
          .join("\n")}`
      );

      throw new StormError(AcidicErrorCode.invalid_schema, {
        message: "Invalid definition was provided to the Acidic Engine"
      });
    }

    const model = document.parseResult.value as AcidicSchema;
    model.declarations.push(
      ...resolveTransitiveImports(langiumDocuments, model)
        .flatMap(m => m.declarations)
        .map(decl => {
          const mutable = decl as Mutable<AstNode>;

          // The plugin might use $container to access the model
          // need to make sure it is always resolved to the main model
          mutable.$container = model as AstNode;

          return decl;
        })
    );

    const dataSources = model.declarations.filter(d => isAcidicDataSource(d));
    if (dataSources.length == 0) {
      throw new StormError(AcidicErrorCode.invalid_schema, {
        message:
          "Service definition validation errors: \nDefinition must include a data source"
      });
    } else if (dataSources.length > 1) {
      throw new StormError(AcidicErrorCode.invalid_schema, {
        message:
          "Service definition validation errors: \nMultiple data source declarations are not allowed"
      });
    }

    mergeBaseSchema(model);

    return model;
  };

  /**
   * Eagerly loads all imports of a document.
   */

  /**
   * Eagerly loads all imports of a document.
   *
   * @param document
   * @param documents
   * @param uris
   * @returns
   */
  private eagerLoadAllImports = (
    document: LangiumDocument,
    documents: LangiumDocuments,
    uris: Set<string> = new Set()
  ) => {
    const uriString = document.uri.toString();
    if (!uris.has(uriString)) {
      uris.add(uriString);
      const model = document.parseResult.value as AcidicSchema;

      for (const imp of model.imports) {
        const importedModel = resolveImport(documents, imp);
        if (importedModel) {
          const importedDoc = getDocument(importedModel);
          this.eagerLoadAllImports(importedDoc, documents, uris);
        }
      }
    }

    return Array.from(uris)
      .filter(x => uriString != x)
      .map(e => URI.parse(e));
  };
}
