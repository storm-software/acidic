//import { SchemaTreeView } from "@acidic/vscode-components";
import { ServiceGraph } from "@acidic/service-graph";
import { MemoExoticComponent, memo } from "react";
import "../style/global.css";

export const App: MemoExoticComponent<() => JSX.Element> = memo(() => {
  return (
    <div className="h-full w-full">
      <h1>Acidic Service Graph</h1>
      <ServiceGraph className="h-full w-full" />
    </div>
  );
});
