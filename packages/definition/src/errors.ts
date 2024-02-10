import { ErrorCode } from "@storm-stack/errors";

export type AcidicDefinitionErrorCode =
  | ErrorCode
  | "invalid_schema"
  | "invalid_attr_arg"
  | "invalid_relationship";
export const AcidicDefinitionErrorCode = {
  ...ErrorCode,
  invalid_schema: "invalid_schema" as AcidicDefinitionErrorCode,
  invalid_attr_arg: "invalid_attr_arg" as AcidicDefinitionErrorCode,
  invalid_relationship: "invalid_relationship" as AcidicDefinitionErrorCode
};
