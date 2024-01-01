import React, { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { GraphProvider, GraphStore } from "./create-graph-store";

export interface GraphStoreProviderProps {
  initialValues?: GraphStore;
  children: ReactNode;
}

export const GraphStoreProvider = ({
  children,
  initialValues = { schemas: [] }
}: GraphStoreProviderProps) => {
  return (
    <ReactFlowProvider>
      <GraphProvider initialValues={initialValues}>{children}</GraphProvider>
    </ReactFlowProvider>
  );
};
