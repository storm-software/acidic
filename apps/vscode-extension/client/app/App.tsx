import { ServiceGraph } from "@acidic/service-graph";
import React from "react";

export const App: React.FC = () => {
  return (
    <div className="h-full w-full p-2 pb-4">
      <ServiceGraph />
    </div>
  );
};
