import { ErrorCode } from "@storm-stack/errors";

export type AcidicSchemaErrorCode =
  | ErrorCode
  | "invalid_schema"
  | "invalid_attr_arg"
  | "invalid_relationship";
export const AcidicSchemaErrorCode = {
  ...ErrorCode,
  invalid_schema: "invalid_schema" as AcidicSchemaErrorCode,
  invalid_attr_arg: "invalid_attr_arg" as AcidicSchemaErrorCode,
  invalid_relationship: "invalid_relationship" as AcidicSchemaErrorCode
};
