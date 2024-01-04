import { ServiceSchema } from "@acidic/schema";
import React, { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import { GraphProvider } from "./create-graph-store";

export interface GraphStoreProviderProps {
  schemas: ServiceSchema[];
  children: ReactNode;
}

export const GraphStoreProvider = ({
  children,
  schemas = []
}: GraphStoreProviderProps) => {
  return (
    <ReactFlowProvider>
      <GraphProvider initialValues={{ schemas }}>{children}</GraphProvider>
    </ReactFlowProvider>
  );
};
