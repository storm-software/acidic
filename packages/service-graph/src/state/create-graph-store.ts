import {
  EnumSchema,
  EventSchema,
  ModelSchema,
  ObjectSchema,
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
import { NodeType } from "../types";
import { getNodeTypeColor } from "../utilities";
import { getNodeId } from "../utilities/get-node-id";

const getWorkspaceNodes = (schemas: ServiceSchema[]): Node<any>[] => {
  return schemas.reduce((nodes: Node<any>[], schema: ServiceSchema) => {
    if (!nodes.some(node => node.id === schema.name)) {
      nodes.push({
        id: schema.name,
        type: "serviceNode",
        data: {
          name: schema.name
        },
        position: { x: 0, y: 0 }
      });
    }

    return getServiceNodes(schema, nodes);
  }, []);
};

const getServiceNodes = (
  schema: ServiceSchema,
  nodes: Node<any>[]
): Node<any>[] => {
  schema.enums.reduce((ret: Node<any>[], enumSchema: EnumSchema) => {
    const node: Node<any> = {
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
  }, nodes);
  schema.models.reduce((ret: Node<any>[], modelSchema: ModelSchema) => {
    const node: Node<any> = {
      id: getNodeId(modelSchema.name, schema.name),
      type: "modelNode",
      data: {
        name: modelSchema.name
      },
      position: { x: 0, y: 0 },
      parentNode: schema.name,
      extent: "parent"
    };
    ret.push(node);

    return ret;
  }, nodes);
  schema.events.reduce((ret: Node<any>[], eventSchema: EventSchema) => {
    if (!ret.some(existing => existing.id === eventSchema.name)) {
      const node: Node<any> = {
        id: getNodeId(eventSchema.name, schema.name),
        type: "eventNode",
        data: {
          name: eventSchema.name
        },
        position: { x: 0, y: 0 },
        parentNode: schema.name,
        extent: "parent"
      };
      ret.push(node);
    }

    return ret;
  }, nodes);
  schema.objects.reduce((ret: Node<any>[], objectSchema: ObjectSchema) => {
    if (!ret.some(existing => existing.id === objectSchema.name)) {
      const node: Node<any> = {
        id: getNodeId(objectSchema.name, schema.name),
        type: "objectNode",
        data: {
          name: objectSchema.name
        },
        position: { x: 0, y: 0 },
        parentNode: schema.name,
        extent: "parent"
      };
      ret.push(node);
    }

    return ret;
  }, nodes);

  return nodes;
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
          id: `${modelId}->${foreignId}`,
          source: modelId,
          target: foreignId,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: getNodeTypeColor(NodeType.MODEL)
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
          id: `${objectId}->${foreignId}`,
          source: objectId,
          target: foreignId,
          label: "Child Type",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: getNodeTypeColor(NodeType.OBJECT)
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
    schemas: []
  } as GraphStore,
  {
    name: "graph",
    extend: atoms => ({
      nodes: atomWithNodes(atoms.schemas),
      edges: atomWithEdges(atoms.schemas)
    })
  }
);
