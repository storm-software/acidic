import clsx from "clsx";
import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Panel,
  addEdge,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import iconImage from "../../../../../assets/icons/dark/icon.png";
import { useGraphStore } from "../../state";
import { getLayout } from "../../utilities/get-layout";
import { getNodeColor } from "../../utilities/get-node-color";

/*const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } }
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];*/

export interface ServiceGraphLayoutProps {
  className?: string;
}

export const ServiceGraphLayout: React.FC<ServiceGraphLayoutProps> = ({
  className
}: ServiceGraphLayoutProps) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes] = useGraphStore().use.nodes();
  const [edges, setEdges] = useGraphStore().use.edges();
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds: Edge[]) => addEdge(params, eds));

      const layout = getLayout(nodes, edges);

      setNodes([...layout.nodes]);
      setEdges([...layout.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [setEdges, nodes, edges]
  );

  return (
    <div className={clsx("h-[30rem] w-full", className)}>
      <ReactFlow
        fitView={true}
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={onConnect}>
        <Background
          className="bg-gradient-to-br from-zinc-900 to-gray-800 stroke-teal-600/30"
          variant={BackgroundVariant.Dots}
        />
        <Controls />
        <MiniMap
          nodeColor={getNodeColor}
          nodeStrokeWidth={3}
          zoomable={true}
          pannable={true}
        />
      </ReactFlow>
      <Panel
        position="top-left"
        className="p-2 px-3 text-2xl font-bold text-white">
        <a href="https://acidic.io" target="_blank" rel="noreferrer">
          <img src={iconImage} alt="Acidic" className="h-16 w-16" />
        </a>
      </Panel>
    </div>
  );
};
