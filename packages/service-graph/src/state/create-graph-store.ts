import type {
  EnumDefinition,
  EnumFieldDefinition,
  EventDefinition,
  ModelDefinition,
  MutationDefinition,
  NodeDefinition,
  ObjectDefinition,
  ObjectFieldDefinition,
  QueryDefinition,
  ServiceDefinition,
  SubscriptionDefinition
} from "@acidic/definition";
import { type SimpleWritableAtom, createAtomStore, setAtomPrivate } from "@storm-stack/jotai";
import { type Atom, atom } from "jotai";
import { RESET, atomWithDefault } from "jotai/utils";
import {
  BackgroundVariant,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
  isEdge,
  isNode
} from "reactflow";
import { getNodeId } from "../utilities/get-node-id";
import { getWorkspaceNodes } from "./get-workspace-nodes";
import { getWorkspaceEdges } from "./get-workspace-edges";

export type StoreAtomsWithoutExtend<T> = {
  [K in keyof T]: T[K] extends Atom<any> ? T[K] : SimpleWritableAtom<T[K]>;
};

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

// const calculateNodeYPosition = (count: number) => {};


const atomWithNodes = (atoms: SimpleWritableAtom<ServiceDefinition[]>) => {
  const baseAtom = atomWithDefault<Node[]>((get) => getWorkspaceNodes(get(atoms)));
  setAtomPrivate(baseAtom);

  return atom(
    (get) => get(baseAtom),
    (get, set, action: NodeChange[] | Node[] | ((nodes: Node[]) => Node[]) | typeof RESET) => {
      if (action === RESET) {
        return set(baseAtom, RESET);
      }
      if (Array.isArray(action)) {
        if (action.every((node) => isNode(node as Node))) {
          set(baseAtom, get(baseAtom));
        } else set(baseAtom, applyNodeChanges(action as NodeChange[], get(baseAtom)));
      }
    }
  );
};

const atomWithEdges = (atoms: SimpleWritableAtom<ServiceDefinition[]>) => {
  const baseAtom = atomWithDefault<Edge[]>((get) => getWorkspaceEdges(get(atoms)));
  setAtomPrivate(baseAtom);

  return atom(
    (get) => get(baseAtom),
    (get, set, action: EdgeChange[] | Edge[] | ((edges: Edge[]) => Edge[]) | typeof RESET) => {
      if (action === RESET) {
        return set(baseAtom, RESET);
      }
      if (Array.isArray(action)) {
        if (action.every((node) => isEdge(node as Node))) {
          set(baseAtom, get(baseAtom));
        } else {
          set(baseAtom, applyEdgeChanges(action as EdgeChange[], get(baseAtom)));
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
  const serviceDefinition = schemas?.find((service) =>
    service[kind]?.some((schema) => getNodeId(schema.name, service.name) === nodeId)
  );

  return serviceDefinition
    ? {
        service: serviceDefinition,
        node: serviceDefinition?.[kind]?.find(
          (schema) => getNodeId(schema.name, serviceDefinition.name) === nodeId
        )
      }
    : undefined;
};

const atomWithActiveNode = (atoms: StoreAtomsWithoutExtend<GraphStore>) => {
  const baseAtom = atomWithDefault<ActiveNode | null>((get) => {
    const activeId = get(atoms.activeId);
    if (activeId) {
      let results = findNodeDefinition(activeId.nodeId, get(atoms.schemas), "models");
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as ModelDefinition).data.fields.find(
              (field) => field.name === activeId.fieldId
            ) ?? null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(activeId.nodeId, get(atoms.schemas), "objects");
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as ObjectDefinition).fields.find(
              (field) => field.name === activeId.fieldId
            ) ?? null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(activeId.nodeId, get(atoms.schemas), "events");
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as EventDefinition).data.fields.find(
              (field) => field.name === activeId.fieldId
            ) ?? null) as ObjectFieldDefinition | null;
          }
        }

        return {
          service: results.service,
          node: results.node ?? null,
          field
        };
      }

      results = findNodeDefinition(activeId.nodeId, get(atoms.schemas), "queries");
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as QueryDefinition).request?.fields.find(
              (field) => field.name === activeId.fieldId
            ) ??
              (results.node as QueryDefinition).response?.ref.fields.find(
                (field) => field.name === activeId.fieldId
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

      results = findNodeDefinition(activeId.nodeId, get(atoms.schemas), "mutations");
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as MutationDefinition).request?.fields.find(
              (field) => field.name === activeId.fieldId
            ) ??
              (results.node as MutationDefinition).response?.ref.fields.find(
                (field) => field.name === activeId.fieldId
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

      results = findNodeDefinition(activeId.nodeId, get(atoms.schemas), "subscriptions");
      if (results) {
        let field: ObjectFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field = ((results.node as SubscriptionDefinition).request?.fields.find(
              (field) => field.name === activeId.fieldId
            ) ??
              (results.node as SubscriptionDefinition).response?.ref.fields.find(
                (field) => field.name === activeId.fieldId
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

      results = findNodeDefinition(activeId.nodeId, get(atoms.schemas), "enums");
      if (results) {
        let field: EnumFieldDefinition | null = null;
        if (results.node) {
          if (activeId.fieldId) {
            field =
              (results.node as EnumDefinition).fields.find(
                (field) => field.name === activeId.fieldId
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
    (get) => get(baseAtom),
    (_get, set, action: ActiveNodeId | typeof RESET) => {
      if (action === RESET) {
        return set(baseAtom, RESET);
      }
      if (action) {
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
    backgroundVariant: BackgroundVariant.Lines,
    activeId: null
  } as GraphStore,
  {
    name: "graph",
    delay: 100,
    extend: (atoms) => ({
      nodes: atomWithNodes(atoms.schemas),
      edges: atomWithEdges(atoms.schemas),
      active: atomWithActiveNode(atoms)
    })
  }
);
