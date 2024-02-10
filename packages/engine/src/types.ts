import type { AcidicConfig } from "@acidic/definition";
import type { AcidicSchema } from "@acidic/language/ast";
import type { AcidicPluginOptions, NodeDefinition, ServiceDefinition } from "@acidic/definition";
import type { StormTrace } from "@storm-stack/telemetry";
import type { IPluginModule, PluginHookFn, PluginInstance } from "@storm-stack/plugin-system";
import type { MaybePromise } from "@storm-stack/utilities";
import type { ESLint } from "eslint";
import type { HelperOptions } from "handlebars/runtime";
import type prettier from "prettier";
import type { CompilerOptions } from "ts-morph";
import type { AcidicDefinitionWrapper } from "./definitions";
import type { ServiceSchemaStatus } from "@acidic/messages/types";

export interface AcidicContext {
  /**
   * The sdl model to create the schema from
   */
  schema?: AcidicSchema;

  /**
   * The path to the sdl model file
   */
  schemaPath?: string;

  /**
   * The definition used to generate service code/artifacts from
   */
  definition: AcidicDefinitionWrapper;

  /**
   * The options used by acidic during generation
   * that is read from the acidic config file
   */
  config: AcidicConfig;

  /**
   * The logger used by the engine
   */
  logger: StormTrace;

  /**
   * The current plugin being executed
   */
  plugin?: PluginInstance;
}

export interface IGenerator<TOptions extends AcidicPluginOptions = AcidicPluginOptions> {
  generate(
    context: AcidicContext,
    node: NodeDefinition,
    options: TOptions,
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

export type AcidicPluginProcessor<
  TOptions extends AcidicPluginOptions = AcidicPluginOptions,
  TGenerator extends IGenerator<TOptions> = IGenerator<TOptions>
> = (context: AcidicContext, options: TOptions, generator?: TGenerator) => MaybePromise<void>;

/**
 * TypeScript Plugin configuration options
 */
export type TypescriptPluginOptions = AcidicPluginOptions & {
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
export type TemplatePluginOptions = AcidicPluginOptions & Partial<TemplatePluginPaths>;

export type TemplateGeneratorHelper = (
  getContext: () => AcidicContext,
  getOptions: () => TemplatePluginOptions,
  context?: any,
  arg1?: any,
  arg2?: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  options?: HelperOptions
) => any;

export type AcidicPluginHooks = {
  /**
   * A reference to the plugin postCreateContext function to extend the model based on pre-defined logic
   */
  "extend-context"?: PluginHookFn<AcidicContext>;

  /**
   * A reference to the plugin extend function to extend the model based on pre-defined logic
   */
  "extend-definition"?: PluginHookFn<AcidicContext>;

  /**
   * A reference to the plugin prepare definition function to extend the model based on pre-defined logic
   */
  validate?: PluginHookFn<AcidicContext>;

  /**
   * A reference to the plugin preGenerate function to extend the model based on pre-defined logic
   */
  generate?: PluginHookFn<AcidicContext>;
};

export const AcidicPluginHookNames = {
  EXTEND_CONTEXT: "extend-context",
  EXTEND_DEFINITION: "extend-definition",
  VALIDATE: "validate",
  GENERATE: "generate"
};

/**
 * Plugin module structure used in codegen
 */
export interface AcidicPluginModule<TOptions extends AcidicPluginOptions = AcidicPluginOptions>
  extends IPluginModule<AcidicContext> {
  /**
   * A reference to the plugin generator used to generate the code based on the acidic model
   */
  generator?: IGenerator<TOptions>;

  /**
   * A reference to the plugin runner
   */
  process?: AcidicPluginProcessor<TOptions>;

  /**
   * A list of dependencies that should be installed
   */
  dependencies?: string[];

  /**
   * The default options for the plugin
   */
  options?: TOptions;
}

export const TEMPLATE_EXTENSIONS = ["hbs", "hbr", "handlebars", "tpl", "template", "mustache"];

export interface ServiceStoreItem {
  path: string;
  status: ServiceSchemaStatus;
  definition: ServiceDefinition | null;
  error: string | null;
}

export interface AcidicStore {
  getServices: () => Promise<ServiceStoreItem[]>;
  getService: (path: string) => Promise<ServiceStoreItem | null | undefined>;
  setService: (path: string, item: ServiceStoreItem) => Promise<void>;
  deleteService: (path: string) => Promise<void>;
  clearServices: () => Promise<void>;
  getSetting: <T>(key: string) => Promise<T | null | undefined>;
  setSetting: <T>(key: string, setting: T) => Promise<void>;
  subscribe: (
    callback: (arg: {
      key: string;
      store: string;
      value: any;
    }) => MaybePromise<void>
  ) => () => void;
}
