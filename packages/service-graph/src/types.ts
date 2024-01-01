import { NodeProps } from "reactflow";

export type NodeType =
  | "event"
  | "plugin"
  | "model"
  | "object"
  | "request"
  | "enum";
export const NodeType = {
  EVENT: "event" as NodeType,
  PLUGIN: "plugin" as NodeType,
  MODEL: "model" as NodeType,
  OBJECT: "object" as NodeType,
  REQUEST: "request" as NodeType,
  ENUM: "enum" as NodeType
};

export type BaseNodeProps = NodeProps<{ name: string }>;
