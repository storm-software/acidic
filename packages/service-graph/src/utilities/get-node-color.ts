import { Node } from "reactflow";
import { NodeType } from "./node-types";

export const getNodeColor = (node: Node) => {
  return getNodeTypeColor(node?.type as NodeType);
};

export const getNodeTypeColor = (type: NodeType) => {
  switch (type) {
    case NodeType.MODEL_NODE:
      return "#0d9488";
    case NodeType.ENUM_NODE:
      return "#a855f7";
    case NodeType.PLUGIN_NODE:
      return "#ec4899";
    case NodeType.OPERATION_NODE:
      return "#0891b2";
    case NodeType.OBJECT_NODE:
      return "#b91c1c";
    case NodeType.EVENT_NODE:
      return "#f59e0b";
    case NodeType.SERVICE_NODE:
      return "rgba(80, 80, 80, 0.5)";
    default:
      return "#c2410c";
  }
};
