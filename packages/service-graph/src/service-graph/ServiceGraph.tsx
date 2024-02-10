// biome-ignore lint/nursery/useImportType: <explanation>
import React from "react";
import { ServiceGraphLayout } from "./service-graph-layout";

export interface ServiceGraphProps {
  className?: string;
}

export const ServiceGraph = ({
  className
}: ServiceGraphProps): React.ReactElement<ServiceGraphProps> => {
  return (
    <div className="h-full w-full min-h-[500px] border-[1px] border-gray-600/50">
      <ServiceGraphLayout className={className} />
    </div>
  );
};
