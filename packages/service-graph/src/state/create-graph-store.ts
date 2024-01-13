import {
  EnumDefinition,
  EnumFieldDefinition,
  EventDefinition,
  ModelDefinition,
  MutationDefinition,
  NodeDefinition,
  NodeKind,
  ObjectDefinition,
  ObjectFieldDefinition,
  OperationDefinition,
  PluginDefinition,
  QueryDefinition,
  ServiceDefinition,
  SubscriptionDefinition
} from "@acidic/schema";
import {
  SimpleWritableAtom,
  StoreAtomsWithoutExtend,
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

export interface ActiveNode {
  service: ServiceDefinition;
  node: NodeDefinition | null;
  field: ObjectFieldDefinition | EnumFieldDefinition | null;
}

export interface ActiveNodeId {
  nodeId: string;
  fieldId: string | null;
}

export interface GraphStore {
  schemas: ServiceDefinition[];
  isShowingMinimap: boolean;
  isShowingOptions: boolean;
  backgroundVariant: BackgroundVariant | null;
  activeId: ActiveNodeId | null;
}

export interface ExtendedGraphStore {
  nodes: Node[];
  edges: Edge[];
}

const getWorkspaceNodes = (schemas: ServiceDefinition[]): Node<any>[] => {
  return schemas.reduce((nodes: Node<any>[], schema: ServiceDefinition) => {
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
  schema: ServiceDefinition,
  existingNodes: Node<any>[],
  serviceNodes: Node<any>[]
): Node<any>[] => {
  serviceNodes = schema.enums.reduce(
    (ret: Node<any>[], enumDefinition: EnumDefinition) => {
      const node: Node<any> = {
        id: getNodeId(enumDefinition.name, schema.name),
        type: NodeType.ENUM_NODE,
        data: {
          name: enumDefinition.name
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
    (ret: Node<any>[], modelDefinition: ModelDefinition) => {
      const node: Node<any> = {
        id: getNodeId(modelDefinition.name, schema.name),
        type: NodeType.MODEL_NODE,
        data: {
          name: modelDefinition.name
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
    (ret: Node<any>[], objectDefinition: ObjectDefinition) => {
      if (!ret.some(existing => existing.id === objectDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(objectDefinition.name, schema.name),
          type: NodeType.OBJECT_NODE,
          data: {
            name: objectDefinition.name
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
    (ret: Node<any>[], eventDefinition: EventDefinition) => {
      if (!ret.some(existing => existing.id === eventDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(eventDefinition.name, schema.name),
          type: NodeType.EVENT_NODE,
          data: {
            name: eventDefinition.name
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
    (ret: Node<any>[], operationDefinition: OperationDefinition) => {
      if (!ret.some(existing => existing.id === operationDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(operationDefinition.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationDefinition.name
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
    (ret: Node<any>[], operationDefinition: OperationDefinition) => {
      if (!ret.some(existing => existing.id === operationDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(operationDefinition.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationDefinition.name
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
    (ret: Node<any>[], operationDefinition: OperationDefinition) => {
      if (!ret.some(existing => existing.id === operationDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(operationDefinition.name, schema.name),
          type: NodeType.OPERATION_NODE,
          data: {
            name: operationDefinition.name
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
    (ret: Node<any>[], pluginDefinition: PluginDefinition) => {
      if (!ret.some(existing => existing.id === pluginDefinition.name)) {
        const node: Node<any> = {
          id: getNodeId(pluginDefinition.name, schema.name),
          type: NodeType.PLUGIN_NODE,
          data: {
            name: pluginDefinition.name
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

const getWorkspaceEdges = (schemas: ServiceDefinition[]): Edge<any>[] => {
  return schemas.reduce((edges: Edge<any>[], schema: ServiceDefinition) => {
    return getServiceEdges(schema, edges);
  }, []);
};

const getServiceEdges = (
  schema: ServiceDefinition,
  edges: Edge<any>[]
): Edge<any>[] => {
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
    .filter(model => model.data.relationships.length > 0)
    .reduce((ret: Edge<any>[], modelDefinition: ModelDefinition) => {
      const modelId = getNodeId(modelDefinition.name, schema.name);
      modelDefinition.data.relationships.forEach(relationship => {
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
    .filter(objectDefinition => objectDefinition.relationships.length > 0)
    .reduce((ret: Edge<any>[], objectDefinition: ObjectDefinition) => {
      const objectId = getNodeId(objectDefinition.name, schema.name);
      objectDefinition.relationships.forEach(relationship => {
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

const atomWithNodes = (atoms: SimpleWritableAtom<ServiceDefinition[]>) => {
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

const atomWithEdges = (atoms: SimpleWritableAtom<ServiceDefinition[]>) => {
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

export const findNodeDefinition = (
  nodeId: string,
  schemas: ServiceDefinition[],
  kind:
    | "plugins"
    | "enums"
    | "objects"
    | "models"
    | "events"
    | "queries"
    | "mutations"
    | "subscriptions"
): { node?: NodeDefinition; service: ServiceDefinition } | undefined => {
  const serviceDefinition = schemas?.find(
    service =>
      service[kind]?.some(
        schema => getNodeId(schema.name, service.name) === nodeId
      )
  );

  return serviceDefinition
    ? {
        service: serviceDefinition,
        node: serviceDefinition?.[kind]?.find(
          schema => getNodeId(schema.name, serviceDefinition.name) === nodeId
        )
      }
    : undefined;
};

const atomWithActiveNode = (atoms: StoreAtomsWithoutExtend<GraphStore>) => {
  const baseAtom = atomWithDefault<ActiveNode | null>(get => {
    const activeId = get(atoms.activeId);
    if (activeId) {
      let results = findNodeDefinition(
        activeId.nodeId,
        get(atoms.schemas),
        "models"
      );
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as ModelDefinition).data.fields.find(
              field => field.name === activeId.fieldId
            ) ?? null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(
        activeId.nodeId,
        get(atoms.schemas),
        "objects"
      );
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as ObjectDefinition).fields.find(
              field => field.name === activeId.fieldId
            ) ?? null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(
        activeId.nodeId,
        get(atoms.schemas),
        "events"
      );
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as EventDefinition).data.fields.find(
              field => field.name === activeId.fieldId
            ) ?? null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(
        activeId.nodeId,
        get(atoms.schemas),
        "queries"
      );
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as QueryDefinition).request?.fields.find(
              field => field.name === activeId.fieldId
            ) ??
              (results.node as QueryDefinition).response?.ref.fields.find(
                field => field.name === activeId.fieldId
              ) ??
              null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(
        activeId.nodeId,
        get(atoms.schemas),
        "mutations"
      );
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as MutationDefinition).request?.fields.find(
              field => field.name === activeId.fieldId
            ) ??
              (results.node as MutationDefinition).response?.ref.fields.find(
                field => field.name === activeId.fieldId
              ) ??
              null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(
        activeId.nodeId,
        get(atoms.schemas),
        "subscriptions"
      );
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((
              results.node as SubscriptionDefinition
            ).request?.fields.find(field => field.name === activeId.fieldId) ??
              (
                results.node as SubscriptionDefinition
              ).response?.ref.fields.find(
                field => field.name === activeId.fieldId
              ) ??
              null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(
        activeId.nodeId,
        get(atoms.schemas),
        "enums"
      );
      if (results) {
        let field: EnumFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field =
              (results.node as EnumDefinition).fields.find(
                field => field.name === activeId.fieldId
              ) ?? null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }
    }

    return null;
  });
  setAtomPrivate(baseAtom);

  return atom(
    get => get(baseAtom),
    (get, set, action: ActiveNodeId | typeof RESET) => {
      if (action === RESET) {
        return set(baseAtom, RESET);
      } else if (action) {
        set(atoms.activeId, action);
      }
    }
  );
};

export const { useGraphStore, graphStore, GraphProvider } = createAtomStore(
  {
    schemas: [],
    isShowingMinimap: true,
    isShowingOptions: true,
    backgroundVariant: null,
    activeId: null
  } as GraphStore,
  {
    name: "graph",
    extend: atoms => ({
      nodes: atomWithNodes(atoms.schemas),
      edges: atomWithEdges(atoms.schemas),
      active: atomWithActiveNode(atoms)
    })
  }
);
