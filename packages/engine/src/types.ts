import { Model } from "@acidic/language/ast";
import { ConnectorType as PrismaConnectorType } from "@prisma/generator-helper";
import { PackageManagers } from "@storm-stack/file-system";
import { StormLog } from "@storm-stack/logging";
import { MaybePromise } from "@storm-stack/utilities";
import { ESLint } from "eslint";
import { HelperOptions } from "handlebars/runtime";
import prettier from "prettier";
import { CompilerOptions } from "ts-morph";
import { AcidicSchema } from "./schema/acidic-schema";

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
  model?: Model;

  /**
   * The path to the sdl model file
   */
  modelPath?: string;

  /**
   * The schema to generate service code/artifacts from
   */
  schema: AcidicSchema;

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

/**
 * Plugin configuration option value type
 */
export type OptionValue = string | number | boolean;

/**
 * Plugin configuration options
 */
export type PluginOptions = {
  /**
   * The name of the provider
   */
  provider: string;

  /**
   * The output directory
   */
  output?: string;
} & GeneratorOptions &
  Record<string, OptionValue | OptionValue[]>;

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

/**
 * Acidic configuration options
 */
export type AcidicConfig = {
  /**
   * The default options for all plugins
   */
  defaultOptions?: Omit<PluginOptions, "provider">;

  /**
   * The base output directory where the generated code/artifacts will be written to
   */
  outputPath: string;

  /**
   * The package manager to use
   */
  packageManager: PackageManagers;
} & Record<string, OptionValue | OptionValue[]>;

export const ConnectorType = {
  MYSQL: "mysql" as PrismaConnectorType,
  MONGO_DB: "mongodb" as PrismaConnectorType,
  SQLITE: "sqlite" as PrismaConnectorType,
  POSTGRESQL: "postgresql" as PrismaConnectorType,
  POSTGRES: "postgres" as PrismaConnectorType,
  SQL_SERVER: "sqlserver" as PrismaConnectorType,
  COCKROACH_DB: "cockroachdb" as PrismaConnectorType,
  JDBC_SQL_SERVER: "jdbc:sqlserver" as PrismaConnectorType
};

export const TEMPLATE_EXTENSIONS = [
  "hbs",
  "hbr",
  "handlebars",
  "tpl",
  "template",
  "mustache"
];

/**
 * Generator Write function options
 */
export type GeneratorOptions = {
  /**
   * The display name of the file being written. This will be added in the file's header
   */
  headerName?: string;

  /**
   * The header string to add to the file. If set to `true` the default header will be used. If set to `false` no header will be added.
   *
   * @default true
   */
  header?: string | boolean;

  /**
   * The footer string to add to the file. If set to `false` no header will be added.
   *
   * @default false
   */
  footer?: string | boolean;
} & Record<string, any>;

export interface NodeSchema {
  /**
   * The name of the schema
   */
  __type: string;

  /**
   * The name of the schema
   */
  name: string;
}

export interface DataSourceSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "DataSource";

  /**
   * The name of the data source
   */
  name: string;

  /**
   * Comments associated with the data source
   */
  comments?: string[];

  /**
   * The connector type
   */
  provider: PrismaConnectorType;

  /**
   * The url to the data source
   */
  url: string;
}

export interface PluginSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "Plugin";

  /**
   * The name of the data source
   */
  name: string;

  /**
   * Comments associated with the data source
   */
  comments?: string[];

  /**
   * The connector type
   */
  provider: PrismaConnectorType;

  /**
   * The url to the data source
   */
  url: string;

  /**
   * The plugin output path (relative to the base path provided in the acidic config)
   */
  output: string;
}

export interface StringEnumFieldSchema {
  /**
   * The name of the enum field
   */
  name: string;

  /**
   * Comments associated with the enum field
   */
  comments?: string[];

  /**
   * The value type
   */
  type: "String";

  /**
   * The value of the field
   */
  value: string;
}

export interface IntegerEnumFieldSchema {
  /**
   * The name of the enum field
   */
  name: string;

  /**
   * Comments associated with the enum field
   */
  comments?: string[];

  /**
   * The value type
   */
  type: "Int";

  /**
   * The value of the field
   */
  value: number;
}

export interface EnumSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "Enum";

  /**
   * The name of the data source
   */
  name: string;

  /**
   * Comments associated with the data source
   */
  comments?: string[];

  /**
   * The enum fields
   */
  fields: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface StringObjectFieldSchema {
  /**
   * The name of the object
   */
  name: string;

  /**
   * The value type
   */
  type: "String";

  /**
   * Comments associated with the object
   */
  comments?: string[];

  /**
   * The default value
   */
  defaultValue?: string;

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  /**
   * Does the field include the string
   */
  includes?: string;

  /**
   * Does the field start with the string
   */
  startsWith?: string;

  /**
   * Does the field end with the string
   */
  endsWith?: string;

  /**
   * Does the field match the regex
   */
  regex?: string;

  /**
   * The minimum length of the string
   */
  minLength?: number;

  /**
   * The maximum length of the string
   */
  maxLength?: number;

  /**
   * The string is empty
   */
  isEmpty: boolean;

  isUrl: boolean;

  isEmail: boolean;

  isSemver: boolean;

  isLatitude: boolean;

  isLongitude: boolean;

  isPostalCode: boolean;

  isCountryCode: boolean;

  isTimezone: boolean;

  isPhoneNumber: boolean;

  isIpAddress: boolean;

  isMacAddress: boolean;

  isDatetime: boolean;

  has?: string[];

  hasEvery?: string[];

  hasSome?: string[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface NumberObjectFieldSchema {
  /**
   * The name of the object
   */
  name: string;

  /**
   * The value type
   */
  type: "Float" | "Decimal";

  /**
   * Comments associated with the object
   */
  comments?: string[];

  /**
   * The default value
   */
  defaultValue?: number;

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  /**
   * The minimum allowed value
   */
  min?: number;

  /**
   * The maximum allowed value
   */
  max?: number;

  /**
   * Is the value a multiple of the number
   */
  multipleOf?: number;

  isPositive: boolean;

  isNonnegative: boolean;

  isNegative: boolean;

  isNonpositive: boolean;

  isFinite: boolean;

  isSafe: boolean;

  equals: number;

  gt: number;

  gte: number;

  lt: number;

  lte: number;

  has?: number[];

  hasEvery?: number[];

  hasSome?: number[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export type IntegerObjectFieldSchema = Omit<NumberObjectFieldSchema, "type"> & {
  /**
   * The value type
   */
  type: "Int" | "BigInt";
};

export interface BooleanObjectFieldSchema {
  /**
   * The name of the boolean
   */
  name: string;

  /**
   * The value type
   */
  type: "Boolean";

  /**
   * Comments associated with the boolean
   */
  comments?: string[];

  /**
   * The default value
   */
  defaultValue?: boolean;

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  has?: boolean[];

  hasEvery?: boolean[];

  hasSome?: boolean[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface DateTimeObjectFieldSchema {
  /**
   * The name of the boolean
   */
  name: string;

  /**
   * The value type
   */
  type: "DateTime";

  /**
   * Comments associated with the boolean
   */
  comments?: string[];

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  isNow: boolean;

  isUpdatedAt: boolean;

  has?: string[];

  hasEvery?: string[];

  hasSome?: string[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export type DateObjectFieldSchema = Omit<DateTimeObjectFieldSchema, "type"> & {
  /**
   * The value type
   */
  type: "Date";
};

export type TimeObjectFieldSchema = Omit<DateTimeObjectFieldSchema, "type"> & {
  /**
   * The value type
   */
  type: "Time";
};

export interface EnumObjectFieldSchema {
  /**
   * The name of the boolean
   */
  name: string;

  /**
   * The value type
   */
  type: "Enum";

  /**
   * Comments associated with the boolean
   */
  comments?: string[];

  /**
   * The enum reference
   */
  ref: EnumSchema;

  /**
   * The default value
   */
  defaultValue?: StringEnumFieldSchema | IntegerEnumFieldSchema;

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  has?: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];

  hasEvery?: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];

  hasSome?: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface ReferenceObjectFieldSchema {
  /**
   * The name of the boolean
   */
  name: string;

  /**
   * The value type
   */
  type: "Object";

  /**
   * Comments associated with the boolean
   */
  comments?: string[];

  /**
   * The enum reference
   */
  ref: ObjectSchema;

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface JsonObjectFieldSchema {
  /**
   * The name of the boolean
   */
  name: string;

  /**
   * The value type
   */
  type: "Json";

  /**
   * Comments associated with the boolean
   */
  comments?: string[];

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface BytesObjectFieldSchema {
  /**
   * The name of the boolean
   */
  name: string;

  /**
   * The value type
   */
  type: "Bytes";

  /**
   * Comments associated with the boolean
   */
  comments?: string[];

  /**
   * Is the field required
   */
  isRequired: boolean;

  /**
   * Is the field an array
   */
  isArray: boolean;

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export type ObjectFieldSchema =
  | StringObjectFieldSchema
  | NumberObjectFieldSchema
  | IntegerObjectFieldSchema
  | BooleanObjectFieldSchema
  | DateTimeObjectFieldSchema
  | DateObjectFieldSchema
  | TimeObjectFieldSchema
  | EnumObjectFieldSchema
  | ReferenceObjectFieldSchema
  | JsonObjectFieldSchema
  | BytesObjectFieldSchema;

export type ObjectFieldSchemaType =
  | "String"
  | "Float"
  | "Decimal"
  | "Int"
  | "BigInt"
  | "Boolean"
  | "DateTime"
  | "Date"
  | "Time"
  | "Enum"
  | "Object"
  | "Json"
  | "Bytes";

/**
 * An object that describes how two Acidic objects are related to one another.
 */
export interface ObjectRelationshipSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "Relationship";

  /**
   * A list of foreign keys that exist on the current object
   */
  fields: ObjectFieldSchema[];

  /**
   * A reference to the foreign object.
   */
  ref: ObjectSchema;

  /**
   * A list of keys that exist on the foreign object. These keys must be in the same order as the `fields` values.
   */
  references: ObjectFieldSchema[];
}

export interface ObjectSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "Object";

  /**
   * The name of the object
   */
  name: string;

  /**
   * Comments associated with the object
   */
  comments?: string[];

  /**
   * The object fields
   */
  fields: ObjectFieldSchema[];

  relationships: ObjectRelationshipSchema[];

  extends: ObjectSchema[];

  isExtend: boolean;

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface ModelSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "Model";

  /**
   * The name of the object
   */
  tableName: string;

  /**
   * The reference to the object schema
   */
  ref: ObjectSchema;
}

export interface EventSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "Event";

  /**
   * The name of the event
   */
  topic: string;

  /**
   * The reference to the object schema
   */
  ref: ObjectSchema;
}

export interface OperationSchema extends NodeSchema {
  /**
   * The name of the operation
   */
  name: string;

  /**
   * Comments associated with the operation
   */
  comments?: string[];

  /**
   * The input/request of the operation
   */
  input?: ObjectSchema;

  /**
   * The event fields
   */
  response: ObjectSchema | ObjectSchema[];

  /**
   * The events emitted by the operation
   */
  emits: EventSchema[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface QuerySchema extends OperationSchema {
  /**
   * The name of the schema
   */
  __type: "Query";

  /**
   * An indicator of whether the query is live
   */
  isLive: boolean;
}

export interface MutationSchema extends OperationSchema {
  /**
   * The name of the schema
   */
  __type: "Mutation";
}

export interface SubscriptionSchema extends OperationSchema {
  /**
   * The name of the schema
   */
  __type: "Subscription";
}

export interface StringAttributeFieldSchema {
  /**
   * The name of the object
   */
  name: string;

  /**
   * The value type
   */
  type: "String";

  /**
   * The default value
   */
  value: string;
}

export interface NumberAttributeFieldSchema {
  /**
   * The name of the object
   */
  name: string;

  /**
   * The value type
   */
  type: "Float" | "Decimal";

  /**
   * The default value
   */
  value: number;
}

export type IntegerAttributeFieldSchema = Omit<
  NumberAttributeFieldSchema,
  "type"
> & {
  /**
   * The value type
   */
  type: "Int" | "BigInt";
};

export interface BooleanAttributeFieldSchema {
  /**
   * The name of the boolean
   */
  name?: string;

  /**
   * The value type
   */
  type: "Boolean";

  /**
   * The default value
   */
  value: boolean;
}

export interface EnumAttributeFieldSchema {
  /**
   * The name of the boolean
   */
  name?: string;

  /**
   * The value type
   */
  type: "Enum";

  /**
   * The enum reference
   */
  ref: EnumSchema;

  /**
   * The default value
   */
  value: StringEnumFieldSchema | IntegerEnumFieldSchema;
}

export type AttributeFieldSchema =
  | StringAttributeFieldSchema
  | NumberAttributeFieldSchema
  | IntegerAttributeFieldSchema
  | BooleanAttributeFieldSchema
  | EnumAttributeFieldSchema;

export interface AttributeArgSchema {
  /**
   * The name of the attribute argument
   */
  name?: string;

  /**
   * The arguments of the attribute
   */
  fields: AttributeFieldSchema[];
}

export interface AttributeSchema {
  /**
   * The name of the attribute
   */
  name: string;

  /**
   * The arguments of the attribute
   */
  args: AttributeArgSchema[];
}

export interface ServiceSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  __type: "Service";

  /**
   * Comments associated with the service
   */
  comments?: string[];

  /**
   * The data sources used by the service
   */
  dataSource?: DataSourceSchema;

  /**
   * The plugins used to generate code/artifacts for the service
   */
  plugins: PluginSchema[];

  /**
   * The enums used by the service
   */
  enums: EnumSchema[];

  /**
   * The objects used by the service
   */
  objects: ObjectSchema[];

  /**
   * The models defined in the service
   */
  models: ModelSchema[];

  /**
   * The events emitted by the service
   */
  events: EventSchema[];

  /**
   * The queries defined in the service
   */
  queries: QuerySchema[];

  /**
   * The mutations defined in the service
   */
  mutations: OperationSchema[];

  /**
   * The subscriptions defined in the service
   */
  subscriptions: OperationSchema[];
}
