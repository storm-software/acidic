export type ServiceTreeItemType = "workspace" | "service" | "plugin";
export const ServiceTreeItemType = {
  WORKSPACE: "workspace" as ServiceTreeItemType,
  SERVICE: "service" as ServiceTreeItemType,
  PLUGIN: "plugin" as ServiceTreeItemType
};

export type ServiceTreeItemStatus =
  | "active"
  | "refreshing"
  | "loading"
  | "error";
export const ServiceTreeItemStatus = {
  ACTIVE: "active" as ServiceTreeItemStatus,
  REFRESHING: "refreshing" as ServiceTreeItemStatus,
  LOADING: "loading" as ServiceTreeItemStatus,
  ERROR: "error" as ServiceTreeItemStatus
};

export type ServiceTreeItemContextValue =
  | "workspace_active"
  | "workspace_refreshing"
  | "workspace_loading"
  | "service_active"
  | "service_refreshing"
  | "service_loading"
  | "plugin_active"
  | "plugin_refreshing"
  | "plugin_loading";
export const ServiceTreeItemContextValue = {
  WORKSPACE_ACTIVE: "workspace_active" as ServiceTreeItemContextValue,
  WORKSPACE_REFRESHING: "workspace_refreshing" as ServiceTreeItemContextValue,
  WORKSPACE_LOADING: "workspace_loading" as ServiceTreeItemContextValue,
  SERVICE_ACTIVE: "service_active" as ServiceTreeItemContextValue,
  SERVICE_REFRESHING: "service_refreshing" as ServiceTreeItemContextValue,
  SERVICE_LOADING: "service_loading" as ServiceTreeItemContextValue,
  PLUGIN_ACTIVE: "plugin_active" as ServiceTreeItemContextValue,
  PLUGIN_REFRESHING: "plugin_refreshing" as ServiceTreeItemContextValue,
  PLUGIN_LOADING: "plugin_loading" as ServiceTreeItemContextValue
};
