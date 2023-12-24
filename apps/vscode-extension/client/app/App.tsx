//import { SchemaTreeView } from "@acidic/vscode-components";
import { ServiceGraph } from "@acidic/service-graph";
import "../style/global.css";

export function App() {
  return (
    <div>
      {/*<SchemaTreeView repository="Acidic Repository" />*/}
      <h1>Acidic Service Graph</h1>
      <ServiceGraph />
    </div>
  );
}

export default App;
