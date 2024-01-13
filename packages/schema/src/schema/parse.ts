import { parse } from "valibot";
import {
  BigIntObjectFieldDefinition,
  BigIntObjectFieldInput,
  BooleanObjectFieldDefinition,
  BooleanObjectFieldInput,
  DataSourceDefinition,
  DataSourceInput,
  DateObjectFieldDefinition,
  DateObjectFieldInput,
  DateTimeObjectFieldDefinition,
  DateTimeObjectFieldInput,
  DecimalObjectFieldDefinition,
  DecimalObjectFieldInput,
  EnumDefinition,
  EnumInput,
  EventDefinition,
  EventInput,
  IntegerObjectFieldDefinition,
  IntegerObjectFieldInput,
  ModelDefinition,
  ModelInput,
  MutationDefinition,
  MutationInput,
  NumberObjectFieldDefinition,
  NumberObjectFieldInput,
  ObjectDefinition,
  ObjectInput,
  PluginDefinition,
  PluginInput,
  QueryDefinition,
  QueryInput,
  ReferenceObjectFieldDefinition,
  ReferenceObjectFieldInput,
  ServiceDefinition,
  ServiceInput,
  StringObjectFieldDefinition,
  StringObjectFieldInput,
  SubscriptionDefinition,
  SubscriptionInput,
  TimeObjectFieldDefinition,
  TimeObjectFieldInput
} from "../types";
import {
  BigIntObjectFieldSchema,
  BooleanObjectFieldSchema,
  DataSourceSchema,
  DateObjectFieldSchema,
  DateTimeObjectFieldSchema,
  DecimalObjectFieldSchema,
  EnumSchema,
  EventSchema,
  IntegerObjectFieldSchema,
  ModelSchema,
  MutationSchema,
  NumberObjectFieldSchema,
  ObjectSchema,
  PluginSchema,
  QuerySchema,
  ReferenceObjectFieldSchema,
  ServiceSchema,
  StringObjectFieldSchema,
  SubscriptionSchema,
  TimeObjectFieldSchema
} from "./schema";

export const parseService = (input: ServiceInput): ServiceDefinition =>
  parse<typeof ServiceSchema>(ServiceSchema, input);

export const parseDataSource = (input: DataSourceInput): DataSourceDefinition =>
  parse<typeof DataSourceSchema>(DataSourceSchema, input);

export const parsePlugin = (input: PluginInput): PluginDefinition =>
  parse<typeof PluginSchema>(PluginSchema, input);

export const parseModel = (input: ModelInput): ModelDefinition =>
  parse<typeof ModelSchema>(ModelSchema, input);

export const parseObject = (input: ObjectInput): ObjectDefinition =>
  parse<typeof ObjectSchema>(ObjectSchema, input);

export const parseEnum = (input: EnumInput): EnumDefinition =>
  parse<typeof EnumSchema>(EnumSchema, input);

export const parseQuery = (input: QueryInput): QueryDefinition =>
  parse<typeof QuerySchema>(QuerySchema, input);

export const parseMutation = (input: MutationInput): MutationDefinition =>
  parse<typeof MutationSchema>(MutationSchema, input);

export const parseSubscription = (
  input: SubscriptionInput
): SubscriptionDefinition =>
  parse<typeof SubscriptionSchema>(SubscriptionSchema, input);

export const parseEvent = (input: EventInput): EventDefinition =>
  parse<typeof EventSchema>(EventSchema, input);

export const parseBooleanObjectField = (
  input: BooleanObjectFieldInput
): BooleanObjectFieldDefinition =>
  parse<typeof BooleanObjectFieldSchema>(BooleanObjectFieldSchema, input);

export const parseStringObjectField = (
  input: StringObjectFieldInput
): StringObjectFieldDefinition =>
  parse<typeof StringObjectFieldSchema>(StringObjectFieldSchema, input);

export const parseNumberObjectField = (
  input: NumberObjectFieldInput
): NumberObjectFieldDefinition =>
  parse<typeof NumberObjectFieldSchema>(NumberObjectFieldSchema, input);

export const parseDecimalObjectField = (
  input: DecimalObjectFieldInput
): DecimalObjectFieldDefinition =>
  parse<typeof DecimalObjectFieldSchema>(DecimalObjectFieldSchema, input);

export const parseIntegerObjectField = (
  input: IntegerObjectFieldInput
): IntegerObjectFieldDefinition =>
  parse<typeof IntegerObjectFieldSchema>(IntegerObjectFieldSchema, input);

export const parseBigIntObjectField = (
  input: BigIntObjectFieldInput
): BigIntObjectFieldDefinition =>
  parse<typeof BigIntObjectFieldSchema>(BigIntObjectFieldSchema, input);

export const parseReferenceObjectField = (
  input: ReferenceObjectFieldInput
): ReferenceObjectFieldDefinition =>
  parse<typeof ReferenceObjectFieldSchema>(ReferenceObjectFieldSchema, input);

export const parseDateTimeObjectField = (
  input: DateTimeObjectFieldInput
): DateTimeObjectFieldDefinition =>
  parse<typeof DateTimeObjectFieldSchema>(DateTimeObjectFieldSchema, input);

export const parseDateObjectField = (
  input: DateObjectFieldInput
): DateObjectFieldDefinition =>
  parse<typeof DateObjectFieldSchema>(DateObjectFieldSchema, input);

export const parseTimeObjectField = (
  input: TimeObjectFieldInput
): TimeObjectFieldDefinition =>
  parse<typeof TimeObjectFieldSchema>(TimeObjectFieldSchema, input);
