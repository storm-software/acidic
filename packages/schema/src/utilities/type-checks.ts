import {
  EnumSchema,
  EventSchema,
  ModelSchema,
  MutationSchema,
  NodeKind,
  ObjectSchema,
  QuerySchema,
  ServiceSchema,
  SubscriptionSchema
} from "../types";

/**
 * Type check to see if value is of type `EnumSchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `EnumSchema`
 */
export const isEnumSchema = (value: unknown): value is EnumSchema => {
  return (value as EnumSchema)?.kind === NodeKind.ENUM;
};

/**
 * Type check to see if value is of type `ModelSchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `ModelSchema`
 */
export const isModelSchema = (value: unknown): value is ModelSchema => {
  return (value as ModelSchema)?.kind === NodeKind.MODEL;
};

/**
 * Type check to see if value is of type `ObjectSchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `ObjectSchema`
 */
export const isObjectSchema = (value: unknown): value is ObjectSchema => {
  return (value as ObjectSchema)?.kind === NodeKind.OBJECT;
};

/**
 * Type check to see if value is of type `EventSchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `EventSchema`
 */
export const isEventSchema = (value: unknown): value is EventSchema => {
  return (value as EventSchema)?.kind === NodeKind.EVENT;
};

/**
 * Type check to see if value is of type `QuerySchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `QuerySchema`
 */
export const isQuerySchema = (value: unknown): value is QuerySchema => {
  return (value as QuerySchema)?.kind === NodeKind.QUERY;
};

/**
 * Type check to see if value is of type `MutationSchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `MutationSchema`
 */
export const isMutationSchema = (value: unknown): value is MutationSchema => {
  return (value as MutationSchema)?.kind === NodeKind.MUTATION;
};

/**
 * Type check to see if value is of type `SubscriptionSchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `SubscriptionSchema`
 */
export const isSubscriptionSchema = (
  value: unknown
): value is SubscriptionSchema => {
  return (value as SubscriptionSchema)?.kind === NodeKind.SUBSCRIPTION;
};

/**
 * Type check to see if value is of type `ServiceSchema`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `ServiceSchema`
 */
export const isServiceSchema = (value: unknown): value is ServiceSchema => {
  return (value as ServiceSchema)?.kind === NodeKind.SERVICE;
};
