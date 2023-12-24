import React from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { ServiceGraphLayout } from "../service-graph-layout";

export interface ServiceGraphProps {
  className?: string;
}

export const ServiceGraph = ({ className }: ServiceGraphProps) => {
  return (
    <ReactFlowProvider>
      <ServiceGraphLayout className={className} />
    </ReactFlowProvider>
  );
};
