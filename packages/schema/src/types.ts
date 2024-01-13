import * as v from "valibot";
import {
  AttributeArgFieldSchema,
  AttributeArgSchema,
  AttributeSchema,
  BaseObjectFieldSchema,
  BigIntObjectFieldSchema,
  BooleanObjectFieldSchema,
  BytesObjectFieldSchema,
  DataSourceSchema,
  DateObjectFieldSchema,
  DateTimeObjectFieldSchema,
  DecimalObjectFieldSchema,
  EnumFieldSchema,
  EnumSchema,
  EventSchema,
  FieldSchema,
  FloatObjectFieldSchema,
  IntegerObjectFieldSchema,
  JsonObjectFieldSchema,
  ModelSchema,
  MutationSchema,
  NodeSchema,
  NumberObjectFieldSchema,
  ObjectFieldSchema,
  ObjectSchema,
  OperationSchema,
  PluginSchema,
  QuerySchema,
  ReferenceObjectFieldSchema,
  RelationshipSchema,
  ServiceSchema,
  StringObjectFieldSchema,
  SubscriptionSchema,
  TimeObjectFieldSchema
} from "./schema";

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
export type BaseOptionValue = null | string | number | boolean;

/**
 * Plugin configuration option value type
 */
export type OptionValue =
  | BaseOptionValue
  | BaseOptionValue[]
  | Record<string, BaseOptionValue | BaseOptionValue[]>;

/**
 * Plugin configuration options
 */
export type AcidicPluginOptions = {
  /**
   * The name of the provider
   */
  provider: string;

  /**
   * The output directory
   */
  output?: string;
} & GeneratorOptions &
  Record<string, OptionValue>;

/**
 * Input types (input)
 */
export type AttributeInput = v.Input<typeof AttributeSchema>;
export type AttributeArgInput = v.Input<typeof AttributeArgSchema>;
export type AttributeArgFieldInput = v.Input<typeof AttributeArgFieldSchema>;
export type NodeInput = v.Input<typeof NodeSchema>;
export type FieldInput = v.Input<typeof FieldSchema>;
export type ObjectInput = v.Input<typeof ObjectSchema>;
export type BaseObjectFieldInput = v.Input<typeof BaseObjectFieldSchema>;
export type ObjectFieldInput = v.Input<typeof ObjectFieldSchema>;
export type StringObjectFieldInput = v.Input<typeof StringObjectFieldSchema>;
export type NumberObjectFieldInput = v.Input<typeof NumberObjectFieldSchema>;
export type IntegerObjectFieldInput = v.Input<typeof IntegerObjectFieldSchema>;
export type DecimalObjectFieldInput = v.Input<typeof DecimalObjectFieldSchema>;
export type FloatObjectFieldInput = v.Input<typeof FloatObjectFieldSchema>;
export type BigIntObjectFieldInput = v.Input<typeof BigIntObjectFieldSchema>;
export type BooleanObjectFieldInput = v.Input<typeof BooleanObjectFieldSchema>;
export type DateTimeObjectFieldInput = v.Input<
  typeof DateTimeObjectFieldSchema
>;
export type DateObjectFieldInput = v.Input<typeof DateObjectFieldSchema>;
export type TimeObjectFieldInput = v.Input<typeof TimeObjectFieldSchema>;
export type BytesObjectFieldInput = v.Input<typeof BytesObjectFieldSchema>;
export type JsonObjectFieldInput = v.Input<typeof JsonObjectFieldSchema>;
export type ReferenceObjectFieldInput = v.Input<
  typeof ReferenceObjectFieldSchema
>;
export type RelationshipInput = v.Input<typeof RelationshipSchema>;
export type ServiceInput = v.Input<typeof ServiceSchema>;
export type DataSourceInput = v.Input<typeof DataSourceSchema>;
export type PluginInput = v.Input<typeof PluginSchema>;
export type ModelInput = v.Input<typeof ModelSchema>;
export type EventInput = v.Input<typeof EventSchema>;
export type OperationInput = v.Input<typeof OperationSchema>;
export type QueryInput = v.Input<typeof QuerySchema>;
export type MutationInput = v.Input<typeof MutationSchema>;
export type SubscriptionInput = v.Input<typeof SubscriptionSchema>;
export type EnumInput = v.Input<typeof EnumSchema>;
export type EnumFieldInput = v.Input<typeof EnumFieldSchema>;

/**
 * Definition types (output)
 */
export type AttributeDefinition = v.Output<typeof AttributeSchema>;
export type AttributeArgDefinition = v.Output<typeof AttributeArgSchema>;
export type AttributeArgFieldDefinition = v.Output<
  typeof AttributeArgFieldSchema
>;
export type NodeDefinition = v.Output<typeof NodeSchema>;
export type FieldDefinition = v.Output<typeof FieldSchema>;
export type ObjectDefinition = v.Output<typeof ObjectSchema>;
export type BaseObjectFieldDefinition = v.Output<typeof BaseObjectFieldSchema>;
export type ObjectFieldDefinition = v.Output<typeof ObjectFieldSchema>;
export type StringObjectFieldDefinition = v.Output<
  typeof StringObjectFieldSchema
>;
export type NumberObjectFieldDefinition = v.Output<
  typeof NumberObjectFieldSchema
>;
export type IntegerObjectFieldDefinition = v.Output<
  typeof IntegerObjectFieldSchema
>;
export type DecimalObjectFieldDefinition = v.Output<
  typeof DecimalObjectFieldSchema
>;
export type FloatObjectFieldDefinition = v.Output<
  typeof FloatObjectFieldSchema
>;
export type BigIntObjectFieldDefinition = v.Output<
  typeof BigIntObjectFieldSchema
>;
export type BooleanObjectFieldDefinition = v.Output<
  typeof BooleanObjectFieldSchema
>;
export type DateTimeObjectFieldDefinition = v.Output<
  typeof DateTimeObjectFieldSchema
>;
export type DateObjectFieldDefinition = v.Output<typeof DateObjectFieldSchema>;
export type TimeObjectFieldDefinition = v.Output<typeof TimeObjectFieldSchema>;
export type BytesObjectFieldDefinition = v.Output<
  typeof BytesObjectFieldSchema
>;
export type JsonObjectFieldDefinition = v.Output<typeof JsonObjectFieldSchema>;
export type ReferenceObjectFieldDefinition = v.Output<
  typeof ReferenceObjectFieldSchema
>;
export type RelationshipDefinition = v.Output<typeof RelationshipSchema>;
export type ServiceDefinition = v.Output<typeof ServiceSchema>;
export type DataSourceDefinition = v.Output<typeof DataSourceSchema>;
export type PluginDefinition = v.Output<typeof PluginSchema>;
export type ModelDefinition = v.Output<typeof ModelSchema>;
export type EventDefinition = v.Output<typeof EventSchema>;
export type OperationDefinition = v.Output<typeof OperationSchema>;
export type QueryDefinition = v.Output<typeof QuerySchema>;
export type MutationDefinition = v.Output<typeof MutationSchema>;
export type SubscriptionDefinition = v.Output<typeof SubscriptionSchema>;
export type EnumDefinition = v.Output<typeof EnumSchema>;
export type EnumFieldDefinition = v.Output<typeof EnumFieldSchema>;
