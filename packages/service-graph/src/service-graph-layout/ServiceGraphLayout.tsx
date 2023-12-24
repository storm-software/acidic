import clsx from "clsx";
import { useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import { getLayout } from "./get-layout";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } }
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export interface ServiceGraphLayoutProps {
  className?: string;
}

export const ServiceGraphLayout = ({ className }: ServiceGraphLayoutProps) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges(eds => addEdge(params, eds));

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
    <div className={clsx("h-[75rem] w-[75rem]", className)}>
      <ReactFlow
        fitView={true}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}>
        <Background color="#333" variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
