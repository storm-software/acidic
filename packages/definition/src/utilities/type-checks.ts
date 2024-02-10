import {
  type EnumDefinition,
  type EventDefinition,
  type ModelDefinition,
  type MutationDefinition,
  NodeKind,
  type ObjectDefinition,
  type QueryDefinition,
  type ServiceDefinition,
  type SubscriptionDefinition
} from "../__generated__/typia";

/**
 * Type check to see if value is of type `EnumDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `EnumDefinition`
 */
export const isEnumDefinition = (value: unknown): value is EnumDefinition => {
  return (value as EnumDefinition)?.kind === NodeKind.ENUM;
};

/**
 * Type check to see if value is of type `ModelDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `ModelDefinition`
 */
export const isModelDefinition = (value: unknown): value is ModelDefinition => {
  return (value as ModelDefinition)?.kind === NodeKind.MODEL;
};

/**
 * Type check to see if value is of type `ObjectDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `ObjectDefinition`
 */
export const isObjectDefinition = (value: unknown): value is ObjectDefinition => {
  return (value as ObjectDefinition)?.kind === NodeKind.OBJECT;
};

/**
 * Type check to see if value is of type `EventDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `EventDefinition`
 */
export const isEventDefinition = (value: unknown): value is EventDefinition => {
  return (value as EventDefinition)?.kind === NodeKind.EVENT;
};

/**
 * Type check to see if value is of type `QueryDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `QueryDefinition`
 */
export const isQueryDefinition = (value: unknown): value is QueryDefinition => {
  return (value as QueryDefinition)?.kind === NodeKind.QUERY;
};

/**
 * Type check to see if value is of type `MutationDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `MutationDefinition`
 */
export const isMutationDefinition = (value: unknown): value is MutationDefinition => {
  return (value as MutationDefinition)?.kind === NodeKind.MUTATION;
};

/**
 * Type check to see if value is of type `SubscriptionDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `SubscriptionDefinition`
 */
export const isSubscriptionDefinition = (value: unknown): value is SubscriptionDefinition => {
  return (value as SubscriptionDefinition)?.kind === NodeKind.SUBSCRIPTION;
};

/**
 * Type check to see if value is of type `ServiceDefinition`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value is of type `ServiceDefinition`
 */
export const isServiceDefinition = (value: unknown): value is ServiceDefinition => {
  return (value as ServiceDefinition)?.kind === NodeKind.SERVICE;
};
