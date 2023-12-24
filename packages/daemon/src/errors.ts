import { ErrorCode } from "@storm-stack/errors";

export type AcidicDaemonErrorCode =
  | ErrorCode
  | "missing_name"
  | "missing_schema"
  | "invalid_bus_payload";
export const AcidicDaemonErrorCode = {
  ...ErrorCode,
  missing_name: "missing_name" as AcidicDaemonErrorCode,
  missing_schema: "missing_schema" as AcidicDaemonErrorCode,
  invalid_bus_payload: "invalid_bus_payload" as AcidicDaemonErrorCode
};
