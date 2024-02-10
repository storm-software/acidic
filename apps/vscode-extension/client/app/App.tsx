import { ServiceGraphContainer } from "../components";
// biome-ignore lint/nursery/useImportType: <explanation>
import React from "react";

export const App: React.FC = () => {
  return (
    <div className="h-full w-full">
      <ServiceGraphContainer />
    </div>
  );
};
