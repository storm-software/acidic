export type CommandName =
  | "start"
  | "stop"
  | "refresh"
  | "onStartupFinished"
  | "initSchemaStart"
  | "initSchemaEnd"
  | "refreshSchemaStart"
  | "refreshSchemaEnd";
export const CommandName = {
  START: "start" as CommandName,
  STOP: "stop" as CommandName,
  REFRESH: "refresh" as CommandName,
  ON_STARTUP_FINISHED: "onStartupFinished" as CommandName,
  OPEN_SERVICE_GRAPH: "openServiceGraph" as CommandName,
  SET_WORKSPACE_READY: "setWorkspaceReady" as CommandName,
  INIT_SCHEMA_START: "initSchemaStart" as CommandName,
  INIT_SCHEMA_END: "initSchemaEnd" as CommandName,
  REFRESH_SCHEMA_START: "refreshSchemaStart" as CommandName,
  REFRESH_SCHEMA_END: "refreshSchemaEnd" as CommandName
};
