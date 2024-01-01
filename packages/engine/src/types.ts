import { AcidicConfig } from "@acidic/config";
import { Model } from "@acidic/language/ast";
import {
  AcidicSchemaWrapper,
  NodeSchema,
  PluginOptions,
  ServiceSchema
} from "@acidic/schema";
import { StormLog } from "@storm-stack/logging";
import { MaybePromise } from "@storm-stack/utilities";
import { ESLint } from "eslint";
import { HelperOptions } from "handlebars/runtime";
import prettier from "prettier";
import { CompilerOptions } from "ts-morph";

export type PluginContextMapKey = Pick<PluginInfo, "options" | "provider">;

export interface PluginContext {
  /**
   * The current plugin being used
   */
  current?: string;

  /**
   * The map of plugins that are being used
   */
  table: WeakMap<PluginContextMapKey, PluginInfo>;
}

export interface Context {
  /**
   * The sdl model to create the schema from
   */
  schema?: Model;

  /**
   * The path to the sdl model file
   */
  schemaPath?: string;

  /**
   * The schema to generate service code/artifacts from
   */
  wrapper: AcidicSchemaWrapper;

  /**
   * The options used by acidic during generation
   * that is read from the acidic config file
   */
  config: AcidicConfig;

  /**
   * The context of the plugins that are being used
   */
  plugins: PluginContext;

  /**
   * The logger used by the engine
   */
  logger: StormLog;
}

export interface IGenerator<TOptions extends PluginOptions = PluginOptions> {
  generate(
    options: TOptions,
    node: NodeSchema,
    context: Context,
    params?: any
  ): Promise<string>;
  write(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension?: string
  ): Promise<void>;
}

export const GENERATOR_SYMBOL = Symbol("Generator");

export type PluginHandler<TOptions extends PluginOptions = PluginOptions> = (
  options: TOptions,
  context: Context,
  generator: IGenerator<TOptions>
) => MaybePromise<void>;

/**
 * Update the acidic schema based on the plugin options
 *
 * @remarks
 * Please note any changes made to the schema will be applied to all other plugins.
 *
 * If you want to update the schema for only the current plugin, use the `prepareSchema` hook instead.
 */
export type PluginHookExtendSchema<
  TOptions extends PluginOptions = PluginOptions
> = (options: TOptions, context: Context) => MaybePromise<ServiceSchema>;

/**
 * Update the acidic schema just prior to generating the code
 *
 * @remarks
 * Please note any changes made to the schema will **NOT** be applied to any other plugins.
 *
 * If you want to update the schema for all plugins, use the `extendSchema` hook instead.
 */
export type PluginHookPrepareSchema<
  TOptions extends PluginOptions = PluginOptions
> = (options: TOptions, context: Context) => MaybePromise<ServiceSchema>;

/**
 * Preform some action using the Context immediately after it is created (but before to generating the code)
 */
export type PluginHookPostCreateContext<
  TOptions extends PluginOptions = PluginOptions
> = (options: TOptions, context: Context) => MaybePromise<void>;

/**
 * Preform some action using the Context immediately before generating the code
 */
export type PluginHookPreGenerate<
  TOptions extends PluginOptions = PluginOptions
> = (options: TOptions, context: Context) => MaybePromise<void>;

export const PLUGIN_RUNNER_SYMBOL = Symbol("PluginRunner");

export type PluginInfo<TOptions extends PluginOptions = PluginOptions> = {
  pluginId: string;
  name: string;
  dependencyOf: string | null;
  provider: string;
  options: TOptions;
  generator?: IGenerator;
  hooks?: PluginHooks<TOptions>;
  handle?: PluginHandler<TOptions>;
  dependencies: PluginInfo<TOptions>[];
  module: PluginModule<TOptions>;
};

/**
 * TypeScript Plugin configuration options
 */
export type TypescriptPluginOptions = PluginOptions & {
  /**
   * Should the generated TypeScript files be compiled
   */
  compile?: boolean;

  /**
   * Should the generated TypeScript files be preserved
   */
  preserveTsFiles?: boolean;

  /**
   * Should prettier be used to format the generated code
   *
   * @default true
   */
  prettier?: boolean;

  /**
   * Should eslint be used to lint/fix the generated code
   *
   * @default true
   */
  lint?: boolean;

  /**
   * Should index files be created for each directory that contains generated files
   *
   * @default true
   */
  generateIndexFiles?: boolean;
};

export type TypeScriptGeneratorConfig = {
  /**
   * The compiler options to use when compiling the generated code
   */
  compiler?: CompilerOptions;

  /**
   * The options to use when running eslint
   */
  eslint?: ESLint.Options;

  /**
   * The options to use when running prettier
   */
  prettier?: prettier.Options;
};

export const DIRECTORY_TRACKER_SYMBOL = Symbol("DirectoryTracker");

/**
 * Paths to template files for a Template Plugin
 */
export type TemplatePluginPaths = {
  /**
   * The path to the template files. This can include a [glob](https://www.npmjs.com/package/glob) pattern.
   */
  templatePath?: string | string[];

  /**
   * The path to [the partial templates](https://handlebarsjs.com/guide/partials.html) that can be referenced in the main template files. This can include a [glob](https://www.npmjs.com/package/glob) pattern.
   */
  partialsPath?: string | string[];

  /**
   * The path to the API model template files. For each API model a file will be generated.
   */
  objectTemplatePath?: string | string[];

  /**
   * The path to the interface template files. For each interface a file will be generated.
   */
  interfaceTemplatePath?: string | string[];

  /**
   * The path to the enum template files. For each enum a file will be generated.
   */
  enumTemplatePath?: string | string[];

  /**
   * The path to the data model template files. For each data model a file will be generated.
   */
  modelTemplatePath?: string | string[];

  /**
   * The path to the event schema template files. For each event definition, a file will be generated.
   */
  eventTemplatePath?: string | string[];

  /**
   * The path to the query operation group template files. For each operation group a file will be generated.
   */
  queryTemplatePath?: string | string[];

  /**
   * The path to the mutation operation group template files. For each operation group a file will be generated.
   */
  mutationTemplatePath?: string | string[];

  /**
   * The path to the subscription operation group template files. For each operation group a file will be generated.
   */
  subscriptionTemplatePath?: string | string[];
};

/**
 * Template Plugin options
 */
export type TemplatePluginOptions = PluginOptions &
  Partial<TemplatePluginPaths>;

export type TemplateGeneratorHelper = (
  getContext: () => Context,
  getOptions: () => TemplatePluginOptions,
  context?: any,
  arg1?: any,
  arg2?: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  options?: HelperOptions
) => any;

export interface PluginHooks<TOptions extends PluginOptions = PluginOptions> {
  /**
   * A reference to the plugin postCreateContext function to extend the model based on pre-defined logic
   */
  postCreateContext?: PluginHookPostCreateContext<TOptions>;

  /**
   * A reference to the plugin extend function to extend the model based on pre-defined logic
   */
  extendSchema?: PluginHookExtendSchema<TOptions>;

  /**
   * A reference to the plugin prepareSchema function to extend the model based on pre-defined logic
   */
  prepareSchema?: PluginHookPrepareSchema<TOptions>;

  /**
   * A reference to the plugin preGenerate function to extend the model based on pre-defined logic
   */
  preGenerate?: PluginHookPreGenerate<TOptions>;
}

/**
 * Plugin module structure used in codegen
 */
export type PluginModule<TOptions extends PluginOptions = PluginOptions> = {
  /**
   * The display name of the plugin
   */
  name?: string;

  /**
   * The default options for the plugin
   */
  options?: TOptions;

  /**
   * Functions that can be used to hook into the Acidic lifecycle
   */
  hooks?: PluginHooks<TOptions>;

  /**
   * A reference to the plugin generator used to generate the code based on the acidic model
   */
  generator?: IGenerator<TOptions>;

  /**
   * A reference to the plugin runner
   */
  execute?: PluginHandler<TOptions>;

  /**
   * A list of dependencies that should be installed
   */
  dependencies?: string[];

  /**
   * The path/url/package name the plugin was resolved at
   */
  resolvedPath: string;
};

export type ConnectorType =
  | "mysql"
  | "mongodb"
  | "sqlite"
  | "postgresql"
  | "postgres"
  | "sqlserver"
  | "cockroachdb"
  | "jdbc:sqlserver";
export const ConnectorType = {
  MYSQL: "mysql" as ConnectorType,
  MONGO_DB: "mongodb" as ConnectorType,
  SQLITE: "sqlite" as ConnectorType,
  POSTGRESQL: "postgresql" as ConnectorType,
  POSTGRES: "postgres" as ConnectorType,
  SQL_SERVER: "sqlserver" as ConnectorType,
  COCKROACH_DB: "cockroachdb" as ConnectorType,
  JDBC_SQL_SERVER: "jdbc:sqlserver" as ConnectorType
};

export const TEMPLATE_EXTENSIONS = [
  "hbs",
  "hbr",
  "handlebars",
  "tpl",
  "template",
  "mustache"
];
