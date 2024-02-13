// import typia from "typia";
// import type { BaseDefinition, DataSourceDefinition, FieldDefinition, NodeDefinition } from "./service-definition";

// export enum NodeKind {
//   OBJECT = "object",
//   EVENT = "event",
//   PLUGIN = "plugin",
//   MODEL = "model",
//   ENUM = "enum",
//   DATA_SOURCE = "data_source",
//   QUERY = "query",
//   MUTATION = "mutation",
//   SUBSCRIPTION = "subscription",
//   SERVICE = "service"
// }

// export enum FieldType {
//   STRING = "string",
//   BOOLEAN = "boolean",
//   FLOAT = "float",
//   DECIMAL = "decimal",
//   INTEGER = "integer",
//   BIGINT = "bigint",
//   DATE_TIME = "datetime",
//   DATE = "date",
//   TIME = "time",
//   JSON = "json",
//   REFERENCE = "reference",
//   BYTES = "bytes",
//   NULL = "null",
//   ANY = "any"
// }

// export interface NodeReference {
//   name: string;
//   kind: NodeKind;
// }

// export interface FieldReference {
//   node: NodeReference;
//   name: string;
//   type: FieldType;
// }

// export interface AttributeArgFieldDefinitionReference extends BaseDefinition {
//   type: FieldType;
//   value: any;
// }

// export interface StringAttributeArgFieldDefinitionReference extends AttributeArgFieldDefinitionReference {
//   type: FieldType.STRING;
//   value: string;
// }

// export interface DecimalAttributeArgFieldDefinitionReference extends AttributeArgFieldDefinitionReference {
//   type: FieldType.DECIMAL;
//   value: number & typia.tags.Type<"float">;
// }

// export interface FloatAttributeArgFieldDefinitionReference extends AttributeArgFieldDefinitionReference {
//   type: FieldType.FLOAT;
//   value: number & typia.tags.Type<"float">;
// }

// export interface IntegerAttributeArgFieldDefinitionReference extends AttributeArgFieldDefinitionReference {
//   type: FieldType.INTEGER;
//   value: number & typia.tags.Type<"int32">;
// }

// export interface BigIntAttributeArgFieldDefinitionReference extends AttributeArgFieldDefinitionReference {
//   type: FieldType.INTEGER;
//   value: bigint;
// }

// export interface BooleanAttributeArgFieldDefinitionReference extends AttributeArgFieldDefinitionReference {
//   type: FieldType.BOOLEAN;
//   value: boolean;
// }

// export interface ReferenceAttributeArgFieldDefinitionReference extends AttributeArgFieldDefinitionReference {
//   type: FieldType.REFERENCE;
//   ref: NodeReference;
//   value: NodeReference | FieldReference;
// }

// export const assertAttributeArgField = typia.createAssert<AttributeArgFieldDefinitionReference>();

// export interface AttributeArgDefinitionReference extends BaseDefinition {
//   fields: AttributeArgFieldDefinitionReference[];
// }

// export interface AttributeDefinitionReference extends BaseDefinition {
//   args: AttributeArgDefinitionReference[];
// }

// export const assertAttributeReference = typia.createAssert<AttributeDefinitionReference>();

// /**
//  * Enum Definitions
//  */

// export interface EnumFieldDefinition extends FieldDefinition {
//   type: FieldType.STRING;
//   value: string;
// }

// export const assertEnumField = typia.createAssert<EnumFieldDefinition>();

// export interface EnumDefinition extends NodeDefinition {
//   kind: NodeKind.ENUM;
//   fields: EnumFieldDefinition[] & typia.tags.MinItems<1>;
// }

// export const assertEnum = typia.createAssert<EnumDefinition>();

// /**
//  * Object Definitions
//  */

// export interface ObjectFieldDefinition extends FieldDefinition {
//   isRequired: boolean;
//   isArray: boolean;
//   defaultValue?: any;
//   attributes: AttributeDefinitionReference[];
// }

// export const assertBaseObjectField = typia.createAssert<ObjectFieldDefinition>();

// export interface StringObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.STRING;
//   defaultValue?: string | string[];
//   includes?: string;
//   startsWith?: string;
//   endsWith?: string;
//   regex?: string;
//   minLength?: number & typia.tags.Type<"int32">;
//   maxLength?: number & typia.tags.Type<"int32">;
//   isEmpty: boolean;
//   isUrl: boolean;
//   isEmail: boolean;
//   isSemver: boolean;
//   isLatitude: boolean;
//   isLongitude: boolean;
//   isPostalCode: boolean;
//   isCountryCode: boolean;
//   isTimezone: boolean;
//   isPhoneNumber: boolean;
//   isIpAddress: boolean;
//   isMacAddress: boolean;
//   isDatetime: boolean;
//   isUuid: boolean;
//   isCuid: boolean;
//   isSnowflake: boolean;
//   isJwt: boolean;
//   isHexColor: boolean;
//   has?: string[];
//   hasEvery?: string[];
//   excluding?: string[];
// }

// export const assertStringObjectField = typia.createAssert<StringObjectFieldDefinition>();

// export interface NumberObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.DECIMAL | FieldType.FLOAT | FieldType.INTEGER;
//   defaultValue?: number | number[];
//   min?: number;
//   max?: number;
//   multipleOf?: number & typia.tags.Type<"int32">;
//   isPositive: boolean;
//   isNonnegative: boolean;
//   isNegative: boolean;
//   isNonpositive: boolean;
//   isFinite: boolean;
//   isSafe: boolean;
//   equals?: number;
//   gt?: number;
//   gte?: number;
//   lt?: number;
//   lte?: number;
//   has?: number[];
//   hasEvery?: number[];
//   excluding?: number[];
// }

// export const assertNumberObjectField = typia.createAssert<NumberObjectFieldDefinition>();

// export interface FloatObjectFieldDefinition extends NumberObjectFieldDefinition {
//   type: FieldType.FLOAT;
//   defaultValue?: (number & typia.tags.Type<"float">) | Array<number & typia.tags.Type<"float">>;
//   min?: number & typia.tags.Type<"float">;
//   max?: number & typia.tags.Type<"float">;
//   equals?: number & typia.tags.Type<"float">;
//   gt?: number & typia.tags.Type<"float">;
//   gte?: number & typia.tags.Type<"float">;
//   lt?: number & typia.tags.Type<"float">;
//   lte?: number & typia.tags.Type<"float">;
//   has?: Array<number & typia.tags.Type<"float">>;
//   hasEvery?: Array<number & typia.tags.Type<"float">>;
//   excluding?: Array<number & typia.tags.Type<"float">>;
// }

// export const assertFloatObjectField = typia.createAssert<FloatObjectFieldDefinition>();

// export interface DecimalObjectFieldDefinition extends NumberObjectFieldDefinition {
//   type: FieldType.DECIMAL;
//   defaultValue?: (number & typia.tags.Type<"double">) | Array<number & typia.tags.Type<"double">>;
//   min?: number & typia.tags.Type<"double">;
//   max?: number & typia.tags.Type<"double">;
//   equals?: number & typia.tags.Type<"double">;
//   gt?: number & typia.tags.Type<"double">;
//   gte?: number & typia.tags.Type<"double">;
//   lt?: number & typia.tags.Type<"double">;
//   lte?: number & typia.tags.Type<"double">;
//   has?: Array<number & typia.tags.Type<"double">>;
//   hasEvery?: Array<number & typia.tags.Type<"double">>;
//   excluding?: Array<number & typia.tags.Type<"double">>;
// }

// export const assertDecimalObjectField = typia.createAssert<DecimalObjectFieldDefinition>();

// export interface IntegerObjectFieldDefinition extends NumberObjectFieldDefinition {
//   type: FieldType.INTEGER;
//   defaultValue?: (number & typia.tags.Type<"int32">) | Array<number & typia.tags.Type<"int32">>;
//   min?: number & typia.tags.Type<"int32">;
//   max?: number & typia.tags.Type<"int32">;
//   equals?: number & typia.tags.Type<"int32">;
//   gt?: number & typia.tags.Type<"int32">;
//   gte?: number & typia.tags.Type<"int32">;
//   lt?: number & typia.tags.Type<"int32">;
//   lte?: number & typia.tags.Type<"int32">;
//   has?: Array<number & typia.tags.Type<"int32">>;
//   hasEvery?: Array<number & typia.tags.Type<"int32">>;
//   excluding?: Array<number & typia.tags.Type<"int32">>;
// }

// export const assertIntegerObjectField = typia.createAssert<IntegerObjectFieldDefinition>();

// export interface BigIntObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.BIGINT;
//   defaultValue?: (bigint & typia.tags.Type<"int64">) | Array<bigint & typia.tags.Type<"int64">>;
//   min?: bigint & typia.tags.Type<"int64">;
//   max?: bigint & typia.tags.Type<"int64">;
//   equals?: bigint & typia.tags.Type<"int64">;
//   multipleOf?: number & typia.tags.Type<"int32">;
//   isPositive: boolean;
//   isNonnegative: boolean;
//   isNegative: boolean;
//   isNonpositive: boolean;
//   isFinite: boolean;
//   isSafe: boolean;
//   gt?: bigint & typia.tags.Type<"int64">;
//   gte?: bigint & typia.tags.Type<"int64">;
//   lt?: bigint & typia.tags.Type<"int64">;
//   lte?: bigint & typia.tags.Type<"int64">;
//   has?: Array<bigint & typia.tags.Type<"int64">>;
//   hasEvery?: Array<bigint & typia.tags.Type<"int64">>;
//   excluding?: Array<bigint & typia.tags.Type<"int64">>;
// }

// export const assertBigIntObjectField = typia.createAssert<BigIntObjectFieldDefinition>();

// export interface BooleanObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.BOOLEAN;
//   defaultValue?: boolean | boolean[];
//   has?: boolean[];
//   hasEvery?: boolean[];
//   excluding?: boolean[];
// }

// export const assertBooleanObjectField = typia.createAssert<BooleanObjectFieldDefinition>();

// export interface BaseDateTimeObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.DATE_TIME | FieldType.DATE | FieldType.TIME;
//   isNow: boolean;
//   isPast: boolean;
//   isFuture: boolean;
//   isUpdatedAt: boolean;
//   has?: Date[];
//   hasEvery?: Date[];
//   excluding?: Date[];
// }

// export interface DateTimeObjectFieldDefinition extends BaseDateTimeObjectFieldDefinition {
//   type: FieldType.DATE_TIME;
// }

// export const assertDateTimeObjectField = typia.createAssert<DateTimeObjectFieldDefinition>();

// export interface DateObjectFieldDefinition extends BaseDateTimeObjectFieldDefinition {
//   type: FieldType.DATE;
// }

// export const assertDateObjectField = typia.createAssert<DateObjectFieldDefinition>();

// export interface TimeObjectFieldDefinition extends BaseDateTimeObjectFieldDefinition {
//   type: FieldType.TIME;
// }

// export const assertTimeObjectField = typia.createAssert<TimeObjectFieldDefinition>();

// export interface JsonObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.JSON;
// }

// export const assertJsonObjectField = typia.createAssert<JsonObjectFieldDefinition>();

// export interface BytesObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.BYTES;
// }

// export const assertBytesObjectField = typia.createAssert<BytesObjectFieldDefinition>();

// export interface ReferenceObjectFieldDefinition extends ObjectFieldDefinition {
//   type: FieldType.REFERENCE;
//   ref: NodeReference;
//   defaultValue?: NodeReference | FieldReference;
// }

// export const assertReferenceObjectField = typia.createAssert<ReferenceObjectFieldDefinition>();

// export const assertObjectField = typia.createAssert<ObjectFieldDefinition>();

// export interface RelationshipDefinitionReference extends BaseDefinition {
//   fields: FieldReference[];
//   ref: NodeReference;
//   references: FieldReference[];
// }

// export const assertRelationship = typia.createAssert<RelationshipDefinitionReference>();

// export interface ObjectDefinition extends NodeDefinition {
//   kind: NodeKind.OBJECT;
//   fields: ObjectFieldDefinition[];
//   extends: NodeDefinition[];
//   isExtending: boolean;
//   relationships: RelationshipDefinitionReference[];
//   attributes: AttributeDefinitionReference[];
// }

// export const assertObject = typia.createAssert<ObjectDefinition>();

// /**
//  * Model Definitions
//  */

// export interface ModelDefinition extends NodeDefinition {
//   kind: NodeKind.MODEL;
//   tableName: string;
//   data: NodeReference;
//   attributes: AttributeDefinitionReference[];
// }

// export const assertModel = typia.createAssert<ModelDefinition>();

// /**
//  * Event Definitions
//  */

// export interface EventDefinition extends NodeDefinition {
//   kind: NodeKind.EVENT;
//   topic: string;
//   data: NodeReference;
//   attributes: AttributeDefinitionReference[];
// }

// export const assertEvent = typia.createAssert<EventDefinition>();

// /**
//  * Operation Definitions
//  */

// export interface OperationDefinition extends NodeDefinition {
//   kind: NodeKind.QUERY | NodeKind.MUTATION | NodeKind.SUBSCRIPTION;
//   request: NodeReference;
//   response: {
//     ref: NodeReference;
//     isArray: boolean;
//   };
//   url?: string & typia.tags.Format<"url">;
//   emits: EventDefinition[];
//   attributes: AttributeDefinitionReference[];
// }

// export const assertOperation = typia.createAssert<OperationDefinition>();

// export interface QueryDefinition extends OperationDefinition {
//   kind: NodeKind.QUERY;
//   isLive: boolean;
// }

// export const assertQuery = typia.createAssert<QueryDefinition>();

// export interface MutationDefinition extends OperationDefinition {
//   kind: NodeKind.MUTATION;
// }

// export const assertMutation = typia.createAssert<MutationDefinition>();

// export interface SubscriptionDefinition extends OperationDefinition {
//   kind: NodeKind.SUBSCRIPTION;
// }

// export const assertSubscription = typia.createAssert<SubscriptionDefinition>();

// /**
//  * Data Source Definitions
//  */

// export enum DataSourceType {
//   MYSQL = "mysql",
//   MONGO_DB = "mongodb",
//   SQLITE = "sqlite",
//   POSTGRESQL = "postgresql",
//   POSTGRES = "postgres",
//   SQL_SERVER = "sqlserver",
//   COCKROACH_DB = "cockroachdb",
//   JDBC_SQL_SERVER = "jdbc:sqlserver"
// }

// /**
//  * Plugin Definitions
//  */

// export interface PluginDefinition extends NodeDefinition {
//   kind: NodeKind.PLUGIN;
//   provider: string;
//   dependencies: string[];
//   output?: string;
//   options: Record<string, any>;
//   attributes: AttributeDefinitionReference[];
// }

// export const assertPlugin = typia.createAssert<PluginDefinition>();

// /**
//  * Service Definitions
//  */

// export interface ServiceDefinition extends NodeDefinition {
//   baseUrl?: string & typia.tags.Format<"url">;
//   owner?: string;
//   kind: NodeKind.SERVICE;
//   imports: string[];
//   dataSource: DataSourceDefinition;
//   plugins: PluginDefinition[];
//   enums: EnumDefinition[];
//   objects: ObjectDefinition[];
//   models: ModelDefinition[];
//   events: EventDefinition[];
//   queries: QueryDefinition[];
//   mutations: MutationDefinition[];
//   subscriptions: SubscriptionDefinition[];
//   attributes: AttributeDefinitionReference[];
// }

// export const assertService = typia.createAssert<ServiceDefinition>();
// export const validateService = typia.createValidate<ServiceDefinition>();
// export const stringifyService = typia.json.createStringify<ServiceDefinition>();
// export const parseService = typia.json.createAssertParse<ServiceDefinition>();

// export const ServiceJsonSchema = typia.json.application<[ServiceDefinition], "ajv">();
