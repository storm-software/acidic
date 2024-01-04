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
  Model,
  isDataSource,
  isModel,
  isPlugin
} from "@acidic/language/definition";
import { getLiteral, mergeBaseModel } from "@acidic/language/utils";
import { PluginOptions, PluginSchema, ServiceSchema } from "@acidic/schema";
import {
  StormError,
  isStormError
} from "@storm-stack/errors";
import {
  PackageManagers,
  exists,
  findFilePath,
  joinPaths
} from "@storm-stack/file-system";
import { StormLog } from "@storm-stack/logging";
import { stringify } from "@storm-stack/serialization";
import { hash } from "@storm-stack/unique-identifier";
import {
  NEWLINE_STRING,
  isFunction,
  isSet,
  isString
} from "@storm-stack/utilities";
import chalk from "chalk";
import { readFileSync } from "fs";
import {
  AstNode,
  LangiumDocument,
  LangiumDocuments,
  Mutable,
  getDocument
} from "langium";
import { NodeFileSystem } from "langium/node";
import { dirname, extname, join, resolve } from "path";
import { URI } from "vscode-uri";
import { AcidicSchemaWrapper } from "../../schema/src/schema/acidic-schema-wrapper";
import { AcidicErrorCode } from "./errors";
import {
  Context,
  PluginContextMapKey,
  PluginInfo,
  PluginModule
} from "./types";
import { ensureOutputFolder } from "./utils/plugin-utils";
import { getVersion } from "./utils/version-utils";

export interface AcidicEngineOptions {
  schema: string | Model | ServiceSchema;
  packageManager?: PackageManagers;
  outputPath?: string;
}

const PLUGIN_CACHE = new Map<string, PluginModule>();

export class AcidicEngine {
  #services: AcidicServices;
  #stdLib: LangiumDocument<AstNode>;
  #logger: StormLog;
  #config: AcidicConfig;
  #pluginTable = new WeakMap<PluginContextMapKey, PluginInfo>();

  public readonly version: string;
  public readonly outputPath: string;

  public static create(config: AcidicConfig, logger: StormLog): AcidicEngine {
    return new AcidicEngine(config, logger);
  }

  private constructor(config: AcidicConfig, logger: StormLog) {
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
${stringify(stdLibFile.toJSON())}`);

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
  ): Promise<StormError | Context> => {
    this.#logger.start("Acidic Engine");

    try {
      this.#logger.info(`Running the 🧪 Acidic Engine v${this.version}`);

      const context = await this.prepare(options);
      if (isStormError(context)) {
        throw context;
      }

      const plugins: PluginInfo<PluginOptions>[] = Array.from(
        context.wrapper.service.plugins.map(
          plugin =>
            context.plugins.table.get(this.getPluginSchemaHashKey(plugin))!
        )
      );

      const issues = await this.generate(context);
      if (isStormError(issues)) {
        throw issues;
      }

      const resultsLineWidth = plugins.reduce((ret: number, plugin) => {
        return plugin.provider.length > ret ? plugin.provider.length : ret;
      }, 75);
      this.#logger.info(
        `\n${chalk
          .hex(this.#config.colors.primary)
          .bold(
            issues.length === 0
              ? `⚡ All ${plugins.length} Acidic plugins completed successfully!`
              : `⚡ Acidic Engine completed running ${plugins.length} plugins!`
          )}${NEWLINE_STRING}${NEWLINE_STRING}${plugins
          .map(
            (plugin: PluginInfo, i: number) =>
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
  ): Promise<StormError | Context> => {
    this.#logger.start("Acidic Engine - Prepare");

    options.outputPath ??= "./node_modules/.storm";
    options.packageManager ??= PackageManagers.NPM;

    try {
      this.#logger.start("Creating Context");

      let context = await this.createContext(options);
      if (context.wrapper.service.plugins.length === 0) {
        this.#logger.warn(
          "No plugins specified for this schema. No processing will be performed (please ensure this is expected)."
        );
      } else {
        const plugins: PluginInfo<PluginOptions>[] = Array.from(
          context.wrapper.service.plugins.map(
            plugin =>
              context.plugins.table.get(this.getPluginSchemaHashKey(plugin))!
          )
        );

        await Promise.all(
          plugins
            .filter(plugin => isFunction(plugin.hooks?.postCreateContext))
            .map(plugin =>
              Promise.resolve(
                plugin.hooks!.postCreateContext!(plugin.options, context)
              )
            )
        );

        this.#logger.stopwatch("Creating Context");

        this.#logger.start("Preparing Schema");

        for (const plugin of plugins.filter(plugin =>
          isFunction(plugin.hooks?.extendSchema)
        )) {
          context.wrapper.service = await Promise.resolve(
            plugin.hooks!.extendSchema!(plugin.options, context)
          );
        }

        await Promise.all(
          plugins
            .filter(plugin => isFunction(plugin.hooks?.preGenerate))
            .map(plugin =>
              Promise.resolve(
                plugin.hooks!.preGenerate!(plugin.options, context)
              )
            )
        );

        this.#logger.info(
          `🧪 The Acidic schema ${
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

        this.#logger.stopwatch("Preparing Schema");
      }

      return context;
    } catch (error) {
      this.#logger.error(error);

      return StormError.create(error);
    } finally {
      this.#logger.stopwatch("Acidic Engine - Prepare");
    }
  };

  public generate = async (
    context: Context
  ): Promise<StormError | Array<{ plugin: string; error: Error }>> => {
    this.#logger.start("Acidic Engine - Generate");

    try {
      this.#logger.start("Running Plugins");

      const issues: Array<{ plugin: string; error: Error }> = [];

      const plugins: PluginInfo<PluginOptions>[] = Array.from(
        context.wrapper.service.plugins.map(
          plugin =>
            context.plugins.table.get(this.getPluginSchemaHashKey(plugin))!
        )
      );

      await Promise.allSettled(
        plugins.map(plugin => {
          try {
            context.plugins.current = plugin.pluginId;

            if (plugin.handle && plugin.generator) {
              this.#logger.info(
                `🧪 Generating code with ${chalk
                  .hex(this.#config.colors.primary)
                  .bold(plugin.name)} plugin`
              );

              return Promise.resolve(
                plugin.handle(plugin.options, context, plugin.generator)
              );
            }
          } catch (e) {
            this.#logger.error(e);
            issues.push({
              plugin: plugin.name,
              error: StormError.create(e)
            });
          }

          return Promise.resolve();
        })
      );

      this.#logger.stopwatch("Running Plugins");

      return issues;
    } catch (error) {
      this.#logger.error(error);

      return StormError.create(error);
    } finally {
      this.#logger.stopwatch("Acidic Engine - Generate");
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
  ): Promise<Context> => {
    if (!options.schema) {
      throw new StormError(AcidicErrorCode.missing_schema, {
        message: "A valid schema must be provided to the Acidic Engine"
      });
    }

    let modelPath: string | undefined;
    let model: Model | undefined;
    let schema!: AcidicSchemaWrapper;
    if (isString(options.schema)) {
      model = await this.readModelFile(options.schema);
      modelPath = options.schema;
      schema = AcidicSchemaWrapper.loadSchema(model);
    } else if (isModel(options.schema)) {
      model = options.schema;
      schema = AcidicSchemaWrapper.loadSchema(model);
    } else {
      schema = AcidicSchemaWrapper.loadSchema(options.schema);
    }

    await Promise.all(
      schema.service.plugins.map(plugin =>
        this.getPluginInfo(plugin.provider, null, {
          ...plugin,
          output: plugin.output
            ? plugin.output
            : joinPaths(this.outputPath, plugin.name)
        })
      )
    );

    return {
      schema: model,
      schemaPath: modelPath,
      wrapper: schema,
      config: this.#config.extensions.acidic,
      plugins: {
        table: this.#pluginTable
      },
      logger: this.#logger
    };
  };

  private getPluginModulePath(provider: string) {
    let pluginModulePath = provider;
    if (pluginModulePath.startsWith("@acidic/")) {
      pluginModulePath = `file://${join(
        pluginModulePath.replace(
          "@acidic/",
          join(__dirname, "../../../../../plugins/")
        ),
        "index.cjs"
      )}`;
    }

    return pluginModulePath;
  }

  private async getPluginModule(pluginProvider: string): Promise<PluginModule> {
    if (!pluginProvider) {
      throw new StormError(AcidicErrorCode.plugin_not_found, {
        message: `Plugin "${pluginProvider}" has invalid provider option`
      });
    }

    if (PLUGIN_CACHE.has(pluginProvider)) {
      return PLUGIN_CACHE.get(pluginProvider)!;
    }

    let pluginModule: PluginModule;
    let resolvedPath!: string;
    try {
      resolvedPath = pluginProvider;
      pluginModule = await import(resolvedPath);
    } catch (origError) {
      resolvedPath = this.getPluginModulePath(pluginProvider);

      try {
        pluginModule = await import(resolvedPath);
      } catch (error) {
        this.#logger.error(
          `Unable to load plugin module ${pluginProvider}: ${origError}`
        );

        throw new StormError(AcidicErrorCode.plugin_not_found, {
          message: isSet(origError)
            ? `Error: ${stringify(origError)}`
            : undefined
        });
      }
    }

    if (!pluginModule) {
      this.#logger.error(`Plugin provider ${pluginProvider} cannot be found`);
      throw new StormError(AcidicErrorCode.plugin_not_found, {
        message: `Plugin provider ${pluginProvider} cannot be found`
      });
    }

    if (!pluginModule.name) {
      this.#logger.warn(
        `Plugin provider ${pluginProvider} is missing a "name" export`
      );
    }

    if (
      (pluginModule.execute && !pluginModule.generator) ||
      (!pluginModule.execute && pluginModule.generator)
    ) {
      throw new StormError(AcidicErrorCode.invalid_plugin, {
        message: `Plugin provider ${pluginProvider} is missing a "generator" or "handle" export. If a one of the "generator" or "handle" exports are set, then both "generator" and "handle" must be set.`
      });
    }

    if (
      !pluginModule.execute &&
      (!pluginModule.hooks ||
        Object.keys(pluginModule.hooks).some((hookName: string) =>
          isFunction((pluginModule.hooks as any)?.[hookName])
        ))
    ) {
      this.#logger.warn(
        `Plugin provider ${pluginProvider} is missing both the "handle" and "extend" exports. If a plugin does not have a "handle" or "extend" export, then it will be ignored.`
      );
    }

    pluginModule = {
      ...pluginModule,
      resolvedPath: findFilePath(resolvedPath)
    };
    PLUGIN_CACHE.set(pluginProvider, pluginModule);

    return pluginModule;
  }

  private async getPluginInfo(
    pluginProvider: string,
    parentPluginName: string | null,
    pluginOptions: PluginOptions & { output: string }
  ): Promise<PluginInfo> {
    if (!pluginProvider) {
      throw new StormError(AcidicErrorCode.plugin_not_found, {
        message: `Plugin ${pluginProvider} has invalid provider option`
      });
    }

    const module: PluginModule = await this.getPluginModule(pluginProvider);

    const options = {
      ...module.options,
      ...pluginOptions
    };
    const name =
      typeof module.name === "string"
        ? (module.name as string)
        : pluginProvider;

    options.headerName = options.headerName ?? name;
    const hashKey = this.getPluginHashKey(options, pluginProvider);
    if (this.#pluginTable.has(hashKey)) {
      return this.#pluginTable.get(hashKey)!;
    }

    const dependencies = Array.isArray(module.dependencies)
      ? (module.dependencies as string[])
      : [];
    const pluginId = hash(hashKey as any);

    const pluginInfo: PluginInfo = {
      ...module,
      module,
      dependencyOf: parentPluginName,
      pluginId,
      name,
      provider: pluginProvider,
      options: {
        ...options,
        output: join(
          options.output,
          `${name
            .toLowerCase()
            .replace("/", "-")
            .replace("\\", "-")}_${pluginId}`
        )
      },
      dependencies: []
    };

    if (dependencies) {
      for (const dependency of dependencies) {
        pluginInfo.dependencies.push(
          await this.getPluginInfo(dependency, pluginInfo.name, {
            ...pluginInfo.options,
            output: pluginOptions.output
          })
        );
      }
    }

    this.#pluginTable.set(hashKey, pluginInfo);
    return pluginInfo;
  }

  private getPluginSchemaHashKey = (
    pluginSchema: PluginSchema
  ): PluginContextMapKey =>
    this.getPluginHashKey({ ...pluginSchema }, pluginSchema.provider);

  private getPluginHashKey = (
    options: PluginOptions,
    provider: PluginInfo["provider"]
  ): PluginContextMapKey => ({
    options: { ...options, provider },
    provider
  });

  /**
   * Loads a Acidic document from a file.
   *
   * @param fileName File name
   * @returns Parsed and validated AST
   */
  private readModelFile = async (fileName: string): Promise<Model> => {
    const extensions = this.#services.LanguageMetaData.fileExtensions;
    if (!extensions.includes(extname(fileName))) {
      throw new StormError(AcidicErrorCode.invalid_schema_extension, {
        message: `Invalid schema file. Please choose a file with extension: ${extensions}.`
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
      ?.value as Model;

    const pluginDocuments = parsed?.declarations.reduce(
      (ret: LangiumDocument[], decl: AbstractDeclaration) => {
        if (isPlugin(decl)) {
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
        validationChecks: "all"
      }
    );

    const validationErrors = langiumDocuments.all
      .flatMap(d => d.diagnostics ?? [])
      .filter(e => e.severity === 1)
      .toArray();

    if (validationErrors.length > 0) {
      this.#logger.error(
        `Acidic Schema validation errors: \n${validationErrors
          .map(
            validationError =>
              `line ${validationError.range.start.line + 1}: ${
                validationError.message
              } [${document.textDocument.getText(validationError.range)}]`
          )
          .join("\n")}`
      );

      throw new StormError(AcidicErrorCode.invalid_schema, {
        message: "Invalid schema was provided to the Acidic Engine"
      });
    }

    const model = document.parseResult.value as Model;
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

    const dataSources = model.declarations.filter(d => isDataSource(d));
    if (dataSources.length == 0) {
      throw new StormError(AcidicErrorCode.invalid_schema, {
        message:
          "Acidic Schema validation errors: \nModel must define a data source"
      });
    } else if (dataSources.length > 1) {
      throw new StormError(AcidicErrorCode.invalid_schema, {
        message:
          "Acidic Schema validation errors: \nMultiple data source declarations are not allowed"
      });
    }

    mergeBaseModel(model);

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
      const model = document.parseResult.value as Model;

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
