import { ServiceSchema } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { GraphStoreProvider } from "../state/GraphStoreProvider";
import { ServiceGraphLayout } from "./service-graph-layout";

export interface ServiceGraphProps {
  className?: string;
  schemas?: ServiceSchema[];
}

export const ServiceGraph = ({ className, schemas }: ServiceGraphProps) => {
  return (
    <div className="h-full w-full border-[1px] border-gray-600/50">
      <GraphStoreProvider schemas={schemas ? schemas : []}>
        <ServiceGraphLayout className={className} />
      </GraphStoreProvider>
    </div>
  );
};
