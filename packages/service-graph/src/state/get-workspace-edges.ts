import type { ServiceDefinition } from "@acidic/definition";
import type { Edge } from "reactflow";
import { getServiceEdges } from "./get-service-edges";

export const getWorkspaceEdges = (schemas: ServiceDefinition[]): Edge<any>[] => {
  return schemas.reduce((edges: Edge<any>[], schema: ServiceDefinition) => {
    return getServiceEdges(schema, edges);
  }, []);
};
