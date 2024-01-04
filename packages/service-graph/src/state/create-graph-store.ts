import {
  EnumSchema,
  EventSchema,
  ModelSchema,
  NodeKind,
  ObjectSchema,
  OperationSchema,
  PluginSchema,
  ServiceSchema
} from "@acidic/schema";
import {
  SimpleWritableAtom,
  createAtomStore,
  setAtomPrivate
} from "@storm-stack/jotai";
import { atom } from "jotai";
import { RESET, atomWithDefault } from "jotai/utils";
import {
  BackgroundVariant,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
  isEdge,
  isNode
} from "reactflow";
import { getNodeType, getNodeTypeColor } from "../utilities";
import { getNodeId } from "../utilities/get-node-id";
import { NodeType } from "../utilities/node-types";

const getWorkspaceNodes = (schemas: ServiceSchema[]): Node<any>[] => {
  return schemas.reduce((nodes: Node<any>[], schema: ServiceSchema) => {
    let serviceNodes: Node<any>[] = [];
    serviceNodes = getServiceNodes(schema, nodes, serviceNodes);

    if (!nodes.some(node => node.id === schema.name)) {
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

const calculateNodeYPosition = (count: number) => {};

const getServiceNodes = (
  schema: ServiceSchema,
  existingNodes: Node<any>[],
  serviceNodes: Node<any>[]
): Node<any>[] => {
  serviceNodes = schema.enums.reduce(
    (ret: Node<any>[], enumSchema: EnumSchema) => {
      const node: Node<any> = {
        id: getNodeId(enumSchema.name, schema.name),
        type: NodeType.ENUM_NODE,
        data: {
          name: enumSchema.name
        },
        position: { x: 50, y: serviceNodes.length * 100 },
        dragHandle: "acidic-drag",
        draggable: true,
        focusable: true,
        parentNode: schema.name,
        extent: "parent"
      };
      ret.push(node);

      return ret;
    },
    serviceNodes
  );

  serviceNodes = schema.models.reduce(
    (ret: Node<any>[], modelSchema: ModelSchema) => {
      const node: Node<any> = {
        id: getNodeId(modelSchema.name, schema.name),
        type: NodeType.MODEL_NODE,
        data: {
          name: modelSchema.name
        },
        position: { x: 200, y: serviceNodes.length * 100 },
        dragHandle: "acidic-drag",
        draggable: true,
        focusable: true,
        parentNode: schema.name,
        extent: "parent"
      };
      ret.push(node);

      return ret;
    },
    serviceNodes
  );
  serviceNodes = schema.objects.reduce(
    (ret: Node<any>[], objectSchema: ObjectSchema) => {
      if (!ret.some(existing => existing.id === objectSchema.name)) {
        const node: Node<any> = {
          id: getNodeId(objectSchema.name, schema.name),
          type: NodeType.OBJECT_NODE,
          data: {
            name: objectSchema.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );

  serviceNodes = schema.events.reduce(
    (ret: Node<any>[], eventSchema: EventSchema) => {
      if (!ret.some(existing => existing.id === eventSchema.name)) {
        const node: Node<any> = {
          id: getNodeId(eventSchema.name, schema.name),
          type: NodeType.EVENT_NODE,
          data: {
            name: eventSchema.name
          },
          position: { x: 400, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          expandParent: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );
  serviceNodes = schema.queries.reduce(
    (ret: Node<any>[], operationSchema: OperationSchema) => {
      if (!ret.some(existing => existing.id === operationSchema.name)) {
        const node: Node<any> = {
          id: getNodeId(operationSchema.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationSchema.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );
  serviceNodes = schema.mutations.reduce(
    (ret: Node<any>[], operationSchema: OperationSchema) => {
      if (!ret.some(existing => existing.id === operationSchema.name)) {
        const node: Node<any> = {
          id: getNodeId(operationSchema.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationSchema.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );
  serviceNodes = schema.subscriptions.reduce(
    (ret: Node<any>[], operationSchema: OperationSchema) => {
      if (!ret.some(existing => existing.id === operationSchema.name)) {
        const node: Node<any> = {
          id: getNodeId(operationSchema.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationSchema.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );

  serviceNodes = schema.plugins.reduce(
    (ret: Node<any>[], pluginSchema: PluginSchema) => {
      if (!ret.some(existing => existing.id === pluginSchema.name)) {
        const node: Node<any> = {
          id: getNodeId(pluginSchema.name, schema.name),
          type: NodeType.PLUGIN_NODE,
          data: {
            name: pluginSchema.name
          },
          position: { x: 600, y: serviceNodes.length * 100 },
          dragHandle: "acidic-drag",
          draggable: true,
          focusable: true,
          parentNode: schema.name,
          extent: "parent"
        };
        ret.push(node);
      }

      return ret;
    },
    serviceNodes
  );

  return serviceNodes;
};

const getWorkspaceEdges = (schemas: ServiceSchema[]): Edge<any>[] => {
  return schemas.reduce((edges: Edge<any>[], schema: ServiceSchema) => {
    return getServiceEdges(schema, edges);
  }, []);
};

const getServiceEdges = (
  schema: ServiceSchema,
  edges: Edge<any>[]
): Edge<any>[] => {
  /*schema.enums.reduce((ret: Edge<any>[], enumSchema: EnumSchema) => {
    const node: Edge<any> = {
      id: getNodeId(enumSchema.name, schema.name),
      type: "enumNode",
      data: {
        name: enumSchema.name
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
    .filter(model => model.ref.relationships.length > 0)
    .reduce((ret: Edge<any>[], modelSchema: ModelSchema) => {
      const modelId = getNodeId(modelSchema.name, schema.name);
      modelSchema.ref.relationships.forEach(relationship => {
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
      });

      return ret;
    }, edges);
  schema.objects
    .filter(objectSchema => objectSchema.relationships.length > 0)
    .reduce((ret: Edge<any>[], objectSchema: ObjectSchema) => {
      const objectId = getNodeId(objectSchema.name, schema.name);
      objectSchema.relationships.forEach(relationship => {
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
      });

      return ret;
    }, edges);

  return edges;
};

export interface GraphStore {
  schemas: ServiceSchema[];
  isShowingMinimap: boolean;
  isShowingOptions: boolean;
  backgroundVariant: BackgroundVariant | null;
}

export interface ExtendedGraphStore {
  nodes: Node[];
  edges: Edge[];
}

const atomWithNodes = (atoms: SimpleWritableAtom<ServiceSchema[]>) => {
  const baseAtom = atomWithDefault<Node[]>(get =>
    getWorkspaceNodes(get(atoms))
  );
  setAtomPrivate(baseAtom);

  return atom(
    get => get(baseAtom),
    (
      get,
      set,
      action: NodeChange[] | Node[] | ((nodes: Node[]) => Node[]) | typeof RESET
    ) => {
      if (action === RESET) {
        return set(baseAtom, RESET);
      } else if (Array.isArray(action)) {
        if (action.every(node => isNode(node as Node))) {
          set(baseAtom, get(baseAtom));
        } else {
          set(
            baseAtom,
            applyNodeChanges(action as NodeChange[], get(baseAtom))
          );
        }
      }
    }
  );
};

const atomWithEdges = (atoms: SimpleWritableAtom<ServiceSchema[]>) => {
  const baseAtom = atomWithDefault<Edge[]>(get =>
    getWorkspaceEdges(get(atoms))
  );
  setAtomPrivate(baseAtom);

  return atom(
    get => get(baseAtom),
    (
      get,
      set,
      action: EdgeChange[] | Edge[] | ((edges: Edge[]) => Edge[]) | typeof RESET
    ) => {
      if (action === RESET) {
        return set(baseAtom, RESET);
      } else if (Array.isArray(action)) {
        if (action.every(node => isEdge(node as Node))) {
          set(baseAtom, get(baseAtom));
        } else {
          set(
            baseAtom,
            applyEdgeChanges(action as EdgeChange[], get(baseAtom))
          );
        }
      }
    }
  );
};

export const { useGraphStore, graphStore, GraphProvider } = createAtomStore(
  {
    schemas: [],
    isShowingMinimap: true,
    isShowingOptions: true,
    backgroundVariant: null
  } as GraphStore,
  {
    name: "graph",
    extend: atoms => ({
      nodes: atomWithNodes(atoms.schemas),
      edges: atomWithEdges(atoms.schemas)
    })
  }
);
