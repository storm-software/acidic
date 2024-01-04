export type NodeType =
  | "model"
  | "enum"
  | "event"
  | "operation"
  | "object"
  | "plugin"
  | "service";
export const NodeType = {
  MODEL_NODE: "model" as NodeType,
  ENUM_NODE: "enum" as NodeType,
  EVENT_NODE: "event" as NodeType,
  OPERATION_NODE: "operation" as NodeType,
  OBJECT_NODE: "object" as NodeType,
  PLUGIN_NODE: "plugin" as NodeType,
  SERVICE_NODE: "service" as NodeType
};
