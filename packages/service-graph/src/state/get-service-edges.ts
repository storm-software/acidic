import  {
  type ModelDefinition,
  type ObjectDefinition,
  NodeKind,
  type ServiceDefinition
} from "@acidic/definition";
import { getNodeType, getNodeTypeColor } from "../utilities";
import { type Edge, MarkerType } from "reactflow";
import { getNodeId } from "../utilities/get-node-id";

export const getServiceEdges = (schema: ServiceDefinition, edges: Edge<any>[]): Edge<any>[] => {
  /*schema.enums.reduce((ret: Edge<any>[], enumDefinition: EnumDefinition) => {
    const node: Edge<any> = {
      id: getNodeId(enumDefinition.name, schema.name),
      type: "enumNode",
      data: {
        name: enumDefinition.name
      },
      position: { x: 0, y: 0 },
      dragHandle: "acidic-drag",
      parentNode: schema.name,
      extent: "parent"
    };
    ret.push(node);

    return ret;
  }, nodes);*/

  schema.models
    .filter((model) => model.data?.relationships.length > 0)
    .reduce((ret: Edge<any>[], modelDefinition: ModelDefinition) => {
      const modelId = getNodeId(modelDefinition.name, schema.name);
      if (modelDefinition?.data) {
        for (const relationship of modelDefinition.data.relationships) {
          const foreignId = getNodeId(relationship.ref.name, schema.name);
          const edge: Edge<any> = {
            id: `${modelId}-${foreignId}`,
            source: modelId,
            target: foreignId,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: getNodeTypeColor(getNodeType(NodeKind.MODEL))
            }
          };
          ret.push(edge);
        }
      }

      return ret;
    }, edges);
  schema.objects
    .filter((objectDefinition) => objectDefinition?.relationships.length > 0)
    .reduce((ret: Edge<any>[], objectDefinition: ObjectDefinition) => {
      const objectId = getNodeId(objectDefinition.name, schema.name);
      if (objectDefinition?.relationships) {
        for (const relationship of objectDefinition.relationships) {
          const foreignId = getNodeId(relationship.ref.name, schema.name);
          const edge: Edge<any> = {
            id: `${objectId}-${foreignId}`,
            source: objectId,
            target: foreignId,
            label: "Child Type",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: getNodeTypeColor(getNodeType(NodeKind.OBJECT))
            }
          };
          ret.push(edge);
        }
      }

      return ret;
    }, edges);

  return edges;
};
