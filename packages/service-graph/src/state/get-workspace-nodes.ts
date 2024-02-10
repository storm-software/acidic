import type { ServiceDefinition } from "@acidic/definition";
import { NodeType } from "../utilities/node-types";
import type { Node } from "reactflow";
import { getServiceNodes } from "./get-service-nodes";

export const getWorkspaceNodes = (schemas: ServiceDefinition[]): Node<any>[] => {
  return schemas.reduce((nodes: Node<any>[], schema: ServiceDefinition) => {
    let serviceNodes: Node<any>[] = [];
    serviceNodes = getServiceNodes(schema, nodes, serviceNodes);

    if (!nodes.some((node) => node.id === schema.name)) {
      serviceNodes.unshift({
        id: schema.name,
        type: NodeType.SERVICE_NODE,
        data: {
          name: schema.name
        },
        position: { x: 0, y: 0 },
        dragHandle: "acidic-drag",
        draggable: true,
        focusable: true,
        style: {
          width: 1400,
          height: 800 + serviceNodes.length * 150
        }
      });
    }

    nodes.push(...serviceNodes);
    return nodes;
  }, []);
};
