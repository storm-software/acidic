import { ServiceDefinition } from "@acidic/schema";
import React, { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { GraphProvider } from "./create-graph-store";

export interface GraphStoreProviderProps {
  schemas: ServiceDefinition[];
  children: ReactNode;
}

export const GraphStoreProvider = ({
  children,
  schemas = []
}: GraphStoreProviderProps) => {
  return (
    <GraphProvider initialValues={{ schemas }}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </GraphProvider>
  );
};
