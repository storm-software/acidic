import { NodeKind } from "@acidic/schema";
import { NodeType } from "./node-types";

export const getNodeType = (kind: NodeKind): NodeType => {
  switch (kind) {
    case NodeKind.ENUM:
      return NodeType.ENUM_NODE;
    case NodeKind.MODEL:
      return NodeType.MODEL_NODE;
    case NodeKind.PLUGIN:
      return NodeType.PLUGIN_NODE;
    case NodeKind.QUERY:
    case NodeKind.MUTATION:
    case NodeKind.SUBSCRIPTION:
      return NodeType.OPERATION_NODE;
    case NodeKind.OBJECT:
      return NodeType.OBJECT_NODE;
    case NodeKind.EVENT:
      return NodeType.EVENT_NODE;
    case NodeKind.SERVICE:
      return NodeType.SERVICE_NODE;
    default:
      return NodeType.OBJECT_NODE;
  }
};
