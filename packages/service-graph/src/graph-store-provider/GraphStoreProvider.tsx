import type { ServiceDefinition } from "@acidic/definition";
import React, { type ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { GraphProvider } from "../state/create-graph-store";

export interface GraphStoreProviderProps {
  schemas: ServiceDefinition[];
  children: ReactNode;
}

export const GraphStoreProvider = ({ children, schemas = [] }: GraphStoreProviderProps) => {
  return (
    <GraphProvider initialValues={{ schemas }}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </GraphProvider>
  );
};
