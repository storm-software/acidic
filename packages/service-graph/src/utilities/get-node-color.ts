import { NodeType } from "../types";

export const getNodeColor = node => {
  return getNodeTypeColor(node?.type);
};

export const getNodeTypeColor = (type: NodeType) => {
  switch (type) {
    case NodeType.MODEL:
      return "#0d9488";
    case NodeType.ENUM:
      return "#a855f7";
    case NodeType.PLUGIN:
      return "#ec4899";
    case NodeType.REQUEST:
      return "#0891b2";
    case NodeType.OBJECT:
      return "#b91c1c";
    default:
      return "#c2410c";
  }
};
