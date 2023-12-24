export type ServiceTreeItemType = "schema" | "plugin";
export const ServiceTreeItemType = {
  SCHEMA: "schema" as ServiceTreeItemType,
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
  | "schema_active"
  | "schema_refreshing"
  | "schema_loading"
  | "plugin_active"
  | "plugin_refreshing"
  | "plugin_loading";
export const ServiceTreeItemContextValue = {
  SCHEMA_ACTIVE: "schema_active" as ServiceTreeItemContextValue,
  SCHEMA_REFRESHING: "schema_refreshing" as ServiceTreeItemContextValue,
  SCHEMA_LOADING: "schema_loading" as ServiceTreeItemContextValue,
  PLUGIN_ACTIVE: "plugin_active" as ServiceTreeItemContextValue,
  PLUGIN_REFRESHING: "plugin_refreshing" as ServiceTreeItemContextValue,
  PLUGIN_LOADING: "plugin_loading" as ServiceTreeItemContextValue
};
