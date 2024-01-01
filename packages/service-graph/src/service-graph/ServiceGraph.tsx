import { ServiceSchema } from "@acidic/schema";
import React from "react";
import "reactflow/dist/style.css";
import { GraphStoreProvider } from "../state/GraphStoreProvider";
import { ServiceGraphLayout } from "./service-graph-layout";

export interface ServiceGraphProps {
  className?: string;
  schema?: ServiceSchema;
}

export const ServiceGraph = ({ className, schema }: ServiceGraphProps) => {
  return (
    <div className="h-full w-full border-[1px] border-slate-600/50">
      <GraphStoreProvider initialValues={{ schemas: schema ? [schema] : [] }}>
        <ServiceGraphLayout className={className} />
      </GraphStoreProvider>
    </div>
  );
};
