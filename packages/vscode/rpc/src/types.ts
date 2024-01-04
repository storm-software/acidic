export type CommandName =
  | "onStartupFinished"
  | "openServiceGraph"
  | "onWorkspaceReady"
  | "setServices"
  | "setSettings"
  | "onRefresh"
  | "onRefreshFinished"
  | "selectWorkspaceManually";
export const CommandName = {
  ON_STARTUP_FINISHED: "onStartupFinished" as CommandName,
  OPEN_SERVICE_GRAPH: "openServiceGraph" as CommandName,
  ON_WORKSPACE_READY: "onWorkspaceReady" as CommandName,
  SET_SERVICES: "setServices" as CommandName,
  SET_SETTINGS: "setSettings" as CommandName,
  ON_REFRESH: "onRefresh" as CommandName,
  ON_REFRESH_FINISHED: "onRefreshFinished" as CommandName,
  SELECT_WORKSPACE_MANUALLY: "selectWorkspaceManually" as CommandName
};

export type ExtensionCommandName = `acidicWorkspace.${CommandName}`;

export interface VsCodeRpcMessageEvent<TData = any> {
  type: ExtensionCommandName;
  data?: string;
}

export interface VsCodeRpcMessage<TData = any> {
  command: CommandName;
  data?: TData;
}
