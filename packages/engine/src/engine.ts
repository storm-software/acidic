import { PLUGIN_MODULE_NAME, STD_LIB_MODULE_NAME } from "@acidic/language";
import { type AcidicServices, createAcidicServices } from "@acidic/language";
import { resolveImport, resolveTransitiveImports } from "@acidic/language/utilities";
import {
  type AbstractDeclaration,
  type AcidicSchema,
  isAcidicDataSource,
  isAcidicPlugin,
  isAcidicSchema
} from "@acidic/language";
import { getLiteral, mergeBaseSchema } from "@acidic/language/utilities";
import type { PluginDefinition, ServiceDefinition, AcidicConfig } from "@acidic/definition";
import { StormDateTime } from "@storm-stack/date-time";
import { StormError, isStormError } from "@storm-stack/errors";
import { PackageManagers, exists } from "@storm-stack/file-system";
import { StormTrace } from "@storm-stack/telemetry";
import { PluginDiscoveryMode, PluginManager } from "@storm-stack/plugin-system";
import { StormParser } from "@storm-stack/serialization";
import { NEWLINE_STRING, isError, isSetObject, isString } from "@storm-stack/utilities";
import chalk from "chalk";
import { readFileSync } from "node:fs";
import {
  type AstNode,
  type LangiumDocument,
  type LangiumDocuments,
  type Mutable,
  ValidationCategory,
  getDocument
} from "langium";
import { NodeFileSystem } from "langium/node";
import { dirname, extname, join, resolve } from "node:path";
import { URI } from "vscode-uri";
import { AcidicErrorCode } from "./errors";
import { AcidicDefinitionWrapper } from "./definitions/acidic-definition-wrapper";
import { type AcidicContext, AcidicPluginHookNames, type AcidicPluginModule } from "./types";
import { ensureOutputFolder } from "./utils/plugin-utils";
import { getVersion } from "./utils/version-utils";
import { PluginLoader } from "./plugins/plugin-loader";

export interface AcidicEngineOptions {
  schema: string | AcidicSchema | ServiceDefinition;
  packageManager?: PackageManagers;
  outputPath?: string;
}

export class AcidicEngine {
  private _services: AcidicServices;
  private _stdLib: LangiumDocument<AstNode>;
  private _logger: StormTrace;
  private _config: AcidicConfig;
  private _pluginManager!: PluginManager<AcidicContext, AcidicPluginModule>;

  public readonly version: string;
  public readonly outputPath: string;

  public static create = async (
    config: AcidicConfig,
    logger: StormTrace
  ): Promise<AcidicEngine> => {
    const engine = new AcidicEngine(config, logger);

    engine._pluginManager = await PluginManager.create(
      engine._logger as any,
      {
        rootPath: config.workspaceRoot,
        useNodeModules: true,
        discoveryMode: PluginDiscoveryMode.FALLBACK,
        defaultLoader: {
          provider: "@acidic/plugin-loader",
          loader: PluginLoader
        }
      } as any
    );

    return engine;
  };

  private constructor(config: AcidicConfig, logger: StormTrace) {
    this._config = config;
    this._logger = logger ?? StormTrace.create(this._config, "Acidic Engine");

    this.version = getVersion();
    this._logger.info(`Initializing the Acidic Engine v${this.version ? this.version : "1.0.0"}`);
    this._services = createAcidicServices(NodeFileSystem).Acidic;

    const stdLibFile = URI.file(resolve(join(__dirname, "res", STD_LIB_MODULE_NAME)));

    this._logger.info(`Loading standard library file from '${stdLibFile.toString()}'
JSON File:
${StormParser.stringify(stdLibFile.toJSON())}`);

    this._stdLib = this._services.shared.workspace.LangiumDocuments.getOrCreateDocument(stdLibFile);
    this.outputPath = ensureOutputFolder() ?? join(config.workspaceRoot, "./node_modules/.storm");
  }

  public execute = async (options: AcidicEngineOptions): Promise<StormError | AcidicContext> => {
    this._logger.start("Acidic Engine");

    try {
      this._logger.info(`Running the 🧪 Acidic Engine v${this.version}`);

      const context = await this.prepare(options);
      if (isStormError(context)) {
        throw context;
      }

      this._logger.start("Running Plugins");

      let issues: Array<{ plugin: string; error: Error }> = [];
      const executionDateTime = StormDateTime.current();

      const results = await Promise.all(
        context.definition.service.plugins.map((plugin) => {
          try {
            if (plugin.provider) {
              context.plugin = this._pluginManager.getInstance(plugin.provider, plugin.options);

              return Promise.resolve(
                this._pluginManager.execute(
                  plugin.provider,
                  context,
                  plugin.options,
                  executionDateTime as any
                )
              );
            }
          } catch (e) {
            this._logger.error(e);
            issues.push({
              plugin: plugin.name,
              error: StormError.create(e)
            });
          }

          return Promise.resolve(null);
        })
      );

      this._logger.stopwatch("Running Plugins");

      issues = results
        .filter(isSetObject)
        .reduce(
          (
            ret: Array<{ plugin: string; error: Error }>,
            result: Record<string, Error | null> | null
          ) => {
            return result
              ? Object.keys(result).reduce(
                  (innerRet: Array<{ plugin: string; error: Error }>, plugin: string) => {
                    if (isError(result[plugin])) {
                      innerRet.push({
                        plugin: plugin,
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        error: result[plugin]!
                      });
                    }

                    return innerRet;
                  },
                  ret
                )
              : ret;
          },
          issues
        );

      const resultsLineWidth = context.definition.service.plugins.reduce((ret: number, plugin) => {
        return plugin.provider.length > ret ? plugin.provider.length : ret;
      }, 75);
      this._logger.info(
        `\n${chalk
          .hex(this._config.colors.primary)
          .bold(
            issues.length === 0
              ? `⚡ All ${
                  this._pluginManager.getStore().size
                } Acidic plugins completed successfully!`
              : `⚡ Acidic Engine completed running ${this._pluginManager.getStore().size} plugins!`
          )}${NEWLINE_STRING}${NEWLINE_STRING}${context.definition.service.plugins
          .map(
            (plugin: PluginDefinition, i: number) =>
              `${chalk.gray(`${i + 1}.`)} ${
                issues.some((issue) => issue.plugin === plugin.provider)
                  ? `${chalk.hex(this._config.colors.error).bold(
                      `${plugin.provider} ${Array.from(
                        Array(resultsLineWidth - plugin.provider.length - 11)
                      )
                        .map((_) => "-")
                        .join("")} FAILED X`
                    )}${NEWLINE_STRING}${chalk.hex(this._config.colors.error)(
                      `   -> ${
                        issues.find((issue) => issue.plugin === plugin.provider)?.error ??
                        "No failures recorded"
                      }`
                    )}`
                  : `${chalk.hex(this._config.colors.success).bold(
                      `${plugin.provider} ${Array.from(
                        Array(resultsLineWidth - plugin.provider.length - 11)
                      )
                        .map((_) => "-")
                        .join("")} SUCCESS ✓`
                    )}`
              }`
          )
          .join(NEWLINE_STRING)}${NEWLINE_STRING}${NEWLINE_STRING}${chalk.gray.bold(
          "Please Note:"
        )} ${chalk.gray(
          "Don't forget to restart your dev server to allow the changes take effect"
        )}\n`
      );

      this._logger.success(
        `${NEWLINE_STRING}🎉 The Acidic Engine has successfully completed processing!${NEWLINE_STRING}`
      );

      return context;
    } catch (error) {
      this._logger.error(error);

      return StormError.create(error);
    } finally {
      this._logger.stopwatch("Acidic Engine");
    }
  };

  public prepare = async (options: AcidicEngineOptions): Promise<StormError | AcidicContext> => {
    this._logger.start("Acidic Engine - Prepare");

    options.outputPath ??= "./node_modules/.storm";
    options.packageManager ??= PackageManagers.NPM;

    try {
      this._logger.start("Creating Context");

      let context = await this.createContext(options);

      this._logger.stopwatch("Creating Context");

      if (context.definition.service.plugins.length === 0) {
        this._logger.warn(
          "No plugins specified for this schema. No processing will be performed (please ensure this is expected)."
        );
      } else {
        context = await this._pluginManager.invokeHook(
          AcidicPluginHookNames.EXTEND_CONTEXT,
          context
        );

        this._logger.start("Preparing Definition");

        context = await this._pluginManager.invokeHook(
          AcidicPluginHookNames.EXTEND_DEFINITION,
          context
        );

        this._logger.info(
          `🧪 The Acidic server definition ${
            context.definition.service.name
          } contains: ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.plugins?.length ?? 0} Plugins`
            )} ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.models?.length ?? 0} Models`
            )} ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.objects?.length ?? 0} Objects`
            )} ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.enums?.length ?? 0} Enums`
            )} ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.events?.length ?? 0} Events`
            )} ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.queries?.length ?? 0} Query Operations`
            )} ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.mutations?.length ?? 0} Mutation Operations`
            )} ${NEWLINE_STRING}${chalk
            .hex(this._config.colors.primary)
            .bold(
              `${context.definition.service.subscriptions?.length ?? 0} Subscriptions Operations`
            )} that will be used to generate the service.${NEWLINE_STRING}`
        );

        this._logger.stopwatch("Preparing Definition");

        this._logger.start("Validation");

        context = await this._pluginManager.invokeHook(AcidicPluginHookNames.VALIDATE, context);

        this._logger.stopwatch("Validation");
      }

      return context;
    } catch (error) {
      this._logger.error(error);

      return StormError.create(error);
    } finally {
      this._logger.stopwatch("Acidic Engine - Prepare");
    }
  };

  /**
   * Loads a Acidic document from a file.
   *
   * @param fileName File name
   * @returns Parsed and validated AST
   */
  private createContext = async (options: AcidicEngineOptions): Promise<AcidicContext> => {
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
      definition: schema,
      config: this._config,
      logger: this._logger
    };
  };

  /**
   * Loads a Acidic document from a file.
   *
   * @param fileName File name
   * @returns Parsed and validated AST
   */
  private readSchemaFile = async (fileName: string): Promise<AcidicSchema> => {
    const extensions = this._services.LanguageMetaData.fileExtensions;
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
    const parsed = this._services.parser.LangiumParser.parse(fileContent)?.value as AcidicSchema;

    const pluginDocuments = parsed?.declarations.reduce(
      (ret: LangiumDocument[], decl: AbstractDeclaration) => {
        if (isAcidicPlugin(decl)) {
          const providerField = decl.fields.find((f) => f.name === "provider");
          if (providerField) {
            const provider = getLiteral<string>(providerField.value);
            if (provider) {
              try {
                const pluginEntrance = require.resolve(`${provider}`);
                const pluginModelFile = join(dirname(pluginEntrance), PLUGIN_MODULE_NAME);
                if (exists(pluginModelFile)) {
                  ret.push(
                    this._services.shared.workspace.LangiumDocuments.getOrCreateDocument(
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

    const langiumDocuments = this._services.shared.workspace.LangiumDocuments;

    const file = URI.file(resolve(fileName));
    this._logger.info(`Loading langium file from '${file.toString()}'
JSON File:
${JSON.stringify(file.toJSON())}`);

    // load the document
    const document = langiumDocuments.getOrCreateDocument(file);
    await this._services.shared.workspace.DocumentBuilder.build(
      [
        this._stdLib,
        ...pluginDocuments,
        document,
        ...this.eagerLoadAllImports(document, langiumDocuments).map((uri) =>
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
      .flatMap((d) => d.diagnostics ?? [])
      .filter((e) => e.severity === 1)
      .toArray();

    if (validationErrors.length > 0) {
      this._logger.error(
        `Service definition validation errors: \n${validationErrors
          .map(
            (validationError) =>
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
        .flatMap((m) => m.declarations)
        .map((decl) => {
          const mutable = decl as Mutable<AstNode>;

          // The plugin might use $container to access the model
          // need to make sure it is always resolved to the main model
          mutable.$container = model as AstNode;

          return decl;
        })
    );

    const dataSources = model.declarations.filter((d) => isAcidicDataSource(d));
    if (dataSources.length === 0) {
      throw new StormError(AcidicErrorCode.invalid_schema, {
        message: "Service definition validation errors: \nDefinition must include a data source"
      });
    }
    if (dataSources.length > 1) {
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
      .filter((x) => uriString !== x)
      .map((e) => URI.parse(e));
  };
}
