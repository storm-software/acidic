import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { ServiceGraphLayout } from "./service-graph-layout";

export interface ServiceGraphProps {
  className?: string;
}

export const ServiceGraph = ({ className }: ServiceGraphProps) => {
  return (
    <div className="border-slate-600/500 border-2 w-full h-full">
      <ReactFlowProvider>
        <ServiceGraphLayout className={className} />
      </ReactFlowProvider>
    </div>
  );
};
