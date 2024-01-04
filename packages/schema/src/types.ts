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

export type NodeKind =
  | "event"
  | "plugin"
  | "model"
  | "object"
  | "operation"
  | "enum"
  | "data_source"
  | "relationship"
  | "query"
  | "mutation"
  | "subscription"
  | "service";
export const NodeKind = {
  EVENT: "event" as NodeKind,
  PLUGIN: "plugin" as NodeKind,
  MODEL: "model" as NodeKind,
  OBJECT: "object" as NodeKind,
  OPERATION: "operation" as NodeKind,
  ENUM: "enum" as NodeKind,
  DATA_SOURCE: "data_source" as NodeKind,
  RELATIONSHIP: "relationship" as NodeKind,
  QUERY: "query" as NodeKind,
  MUTATION: "mutation" as NodeKind,
  SUBSCRIPTION: "subscription" as NodeKind,
  SERVICE: "service" as NodeKind
};

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

/**
 * Plugin configuration option value type
 */
export type OptionValue = null | string | number | boolean;

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
  Record<
    string,
    OptionValue | OptionValue[] | Record<string, OptionValue | OptionValue[]>
  >;

export interface NodeSchema {
  /**
   * The type of the schema
   */
  kind: NodeKind;

  /**
   * The name of the schema
   */
  name: string;

  /**
   * Comments associated with the data source
   */
  comments?: string[];
}

export interface DataSourceSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  kind: "data_source";

  /**
   * The connector type
   */
  provider: ConnectorType;

  /**
   * The url to the data source
   */
  url: string;

  /**
   * The direct url to the data source
   */
  directUrl?: string;

  /**
   * The proxy url to the data source
   */
  proxyUrl?: string;
}

export interface PluginSchema extends NodeSchema {
  /**
   * The name of the schema
   */
  kind: "plugin";

  /**
   * The connector type
   */
  provider: string;

  dependencyOf: string | null;

  dependencies: string[];

  /**
   * The plugin output path (relative to the base path provided in the acidic config)
   */
  output: string;

  options: Record<string, any>;
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
  kind: "enum";

  /**
   * The enum fields
   */
  fields: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface BaseObjectFieldSchema {
  /**
   * The name of the boolean
   */
  name: string;

  /**
   * The value type
   */
  type: ObjectFieldSchemaType;

  /**
   * Comments associated with the boolean
   */
  comments?: string[];

  /**
   * Is the field required
   */
  isRequired?: boolean;

  /**
   * Is the field an array
   */
  isArray?: boolean;

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface StringObjectFieldSchema extends BaseObjectFieldSchema {
  /**
   * The value type
   */
  type: "String";

  /**
   * The default value
   */
  defaultValue?: string | string[];

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
  isEmpty?: boolean;

  isUrl?: boolean;

  isEmail?: boolean;

  isSemver?: boolean;

  isLatitude?: boolean;

  isLongitude?: boolean;

  isPostalCode?: boolean;

  isCountryCode?: boolean;

  isTimezone?: boolean;

  isPhoneNumber?: boolean;

  isIpAddress?: boolean;

  isMacAddress?: boolean;

  isDatetime?: boolean;

  isUuid?: boolean;

  isCuid?: boolean;

  isSnowflake?: boolean;

  has?: string[];

  hasEvery?: string[];

  hasSome?: string[];
}

export interface NumberObjectFieldSchema extends BaseObjectFieldSchema {
  /**
   * The value type
   */
  type: "Float" | "Decimal";

  /**
   * The default value
   */
  defaultValue?: number | number[];

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

  isPositive?: boolean;

  isNonnegative?: boolean;

  isNegative?: boolean;

  isNonpositive?: boolean;

  isFinite?: boolean;

  isSafe?: boolean;

  equals?: number;

  gt?: number;

  gte?: number;

  lt?: number;

  lte?: number;

  has?: number[];

  hasEvery?: number[];

  hasSome?: number[];
}

export type IntegerObjectFieldSchema = Omit<NumberObjectFieldSchema, "type"> & {
  /**
   * The value type
   */
  type: "Int" | "BigInt";
};

export interface BooleanObjectFieldSchema extends BaseObjectFieldSchema {
  /**
   * The value type
   */
  type: "Boolean";

  /**
   * The default value
   */
  defaultValue?: boolean | boolean[];

  has?: boolean[];

  hasEvery?: boolean[];

  hasSome?: boolean[];
}

export interface DateTimeObjectFieldSchema extends BaseObjectFieldSchema {
  /**
   * The value type
   */
  type: "DateTime";

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

export interface EnumObjectFieldSchema extends BaseObjectFieldSchema {
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
  defaultValue?: StringEnumFieldSchema | IntegerEnumFieldSchema;

  has?: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];

  hasEvery?: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];

  hasSome?: StringEnumFieldSchema[] | IntegerEnumFieldSchema[];
}

export interface ReferenceObjectFieldSchema extends BaseObjectFieldSchema {
  /**
   * The value type
   */
  type: "Object";

  /**
   * The enum reference
   */
  ref: ObjectSchema;
}

export interface JsonObjectFieldSchema extends BaseObjectFieldSchema {
  /**
   * The value type
   */
  type: "Json";
}

export interface BytesObjectFieldSchema extends BaseObjectFieldSchema {
  /**
   * The value type
   */
  type: "Bytes";
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
  kind: "relationship";

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
  kind: "object";

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
  kind: "model";

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
  kind: "event";

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
   * The input/request of the operation
   */
  requestRef?: ObjectSchema;

  /**
   * The event fields
   */
  responseRef: OperationResponseSchema;

  /**
   * The url end point of the operation
   */
  url?: string;

  /**
   * The events emitted by the operation
   */
  emits: EventSchema[];

  /**
   * The attribute applied to the schema
   */
  attributes: AttributeSchema[];
}

export interface OperationResponseSchema {
  /**
   * The object reference
   */
  ref: ObjectSchema;

  /**
   * Is the field an array
   */
  isArray: boolean;
}

export interface QuerySchema extends OperationSchema {
  /**
   * The name of the schema
   */
  kind: "query";

  /**
   * An indicator of whether the query is live
   */
  isLive: boolean;
}

export interface MutationSchema extends OperationSchema {
  /**
   * The name of the schema
   */
  kind: "mutation";
}

export interface SubscriptionSchema extends OperationSchema {
  /**
   * The name of the schema
   */
  kind: "subscription";
}

export interface StringAttributeFieldSchema {
  /**
   * The name of the object
   */
  name?: string;

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
  name?: string;

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

export interface FieldAttributeFieldSchema {
  /**
   * The name of the object
   */
  name?: string;

  /**
   * The value type
   */
  type: "Field";

  /**
   * The default value
   */
  value: string;
}

export type AttributeFieldSchema =
  | StringAttributeFieldSchema
  | NumberAttributeFieldSchema
  | IntegerAttributeFieldSchema
  | BooleanAttributeFieldSchema
  | EnumAttributeFieldSchema
  | FieldAttributeFieldSchema;

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
  kind: "service";

  /**
   * The external service schema definitions imported into the current service
   */
  imports: string[];

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
