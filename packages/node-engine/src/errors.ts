import { ErrorCode } from "@storm-stack/errors";

export type AcidicErrorCode =
  | ErrorCode
  | "missing_schema"
  | "invalid_schema"
  | "invalid_schema_extension"
  | "codegen_failure"
  | "plugin_not_found"
  | "invalid_plugin"
  | "invalid_attr_arg"
  | "invalid_relationship"
  | "missing_name"
  | "invalid_bus_payload";
export const AcidicErrorCode = {
  ...ErrorCode,
  missing_schema: "missing_schema" as AcidicErrorCode,
  invalid_schema: "invalid_schema" as AcidicErrorCode,
  invalid_schema_extension: "invalid_schema_extension" as AcidicErrorCode,
  codegen_failure: "codegen_failure" as AcidicErrorCode,
  plugin_not_found: "plugin_not_found" as AcidicErrorCode,
  invalid_plugin: "invalid_plugin" as AcidicErrorCode,
  invalid_attr_arg: "invalid_attr_arg" as AcidicErrorCode,
  invalid_relationship: "invalid_relationship" as AcidicErrorCode,
  missing_name: "missing_name" as AcidicErrorCode,
  invalid_bus_payload: "invalid_bus_payload" as AcidicErrorCode
};
