import type { tags } from "typia";

export type CommandSourceId = "engine" | "client";
export const CommandSourceId = {
  ENGINE: "engine" as CommandSourceId,
  CLIENT: "client" as CommandSourceId
};

export type CommandId =
  | "onStartupFinished"
  | "onOpenServiceGraph"
  | "onWorkspaceReady"
  | "onLoadingService"
  | "onErrorService"
  | "onActiveService"
  | "onSetSettings"
  | "onRefreshWorkspace"
  | "onRefreshService"
  | "onSelectWorkspaceManually";
export const CommandId = {
  ON_STARTUP_FINISHED: "onStartupFinished" as CommandId,
  ON_OPEN_SERVICE_GRAPH: "onOpenServiceGraph" as CommandId,
  ON_WORKSPACE_READY: "onWorkspaceReady" as CommandId,
  ON_LOADING_SERVICE: "onLoadingService" as CommandId,
  ON_ERROR_SERVICE: "onErrorService" as CommandId,
  ON_ACTIVE_SERVICE: "onActiveService" as CommandId,
  ON_SET_SETTINGS: "onSetSettings" as CommandId,
  ON_REFRESH_WORKSPACE: "onRefreshWorkspace" as CommandId,
  ON_REFRESH_SERVICE: "onRefreshService" as CommandId,
  ON_SELECT_WORKSPACE_MANUALLY: "onSelectWorkspaceManually" as CommandId
};

export type ExtensionCommandId<TCommandId extends CommandId = CommandId> =
  `acidicWorkspace.${TCommandId}`;

export interface BaseCommand {
  correlationId: string & tags.Format<"uuid">;
  timestamp: number & tags.Type<"uint32">;
  sourceId: CommandSourceId;
  command: ExtensionCommandId;
  data?: any;
}

export interface OnWorkspaceReadyCommand extends BaseCommand {
  command: ExtensionCommandId<"onWorkspaceReady">;
  data: {
    workspaceRoot: string;
  };
}

export interface OnSelectWorkspaceManuallyCommand extends BaseCommand {
  command: ExtensionCommandId<"onSelectWorkspaceManually">;
  data: {
    workspaceRoot: string;
  };
}

export type ServiceSchemaStatus = "active" | "error" | "loading";
export const ServiceSchemaStatus = {
  ACTIVE: "active" as ServiceSchemaStatus,
  ERROR: "error" as ServiceSchemaStatus,
  LOADING: "loading" as ServiceSchemaStatus
};

export interface SetServiceCommand extends BaseCommand {
  data: {
    status: ServiceSchemaStatus;
    path: string;
    definition: string | null;
    error: string | null;
  };
}

export interface OnLoadingServiceCommand extends SetServiceCommand {
  command: ExtensionCommandId<"onLoadingService">;
  data: {
    status: "loading";
    path: string;
    definition: null;
    error: null;
  };
}

export interface OnErrorServiceCommand extends SetServiceCommand {
  command: ExtensionCommandId<"onErrorService">;
  data: {
    status: "error";
    path: string;
    definition: null;
    error: string;
  };
}

export interface OnActiveServiceCommand extends SetServiceCommand {
  command: ExtensionCommandId<"onActiveService">;
  data: {
    status: "active";
    path: string;
    definition: string;
    error: null;
  };
}

export interface OnRefreshWorkspaceCommand extends BaseCommand {
  command: ExtensionCommandId<"onRefreshWorkspace">;
}

export interface OnRefreshServiceCommand extends BaseCommand {
  command: ExtensionCommandId<"onRefreshService">;
  data: {
    path: string;
  };
}
