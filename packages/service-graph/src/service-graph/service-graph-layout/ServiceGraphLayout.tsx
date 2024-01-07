import { uuid } from "@storm-stack/unique-identifier";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  ConnectionLineType,
  Node,
  OnSelectionChangeParams,
  Panel,
  ReactFlowInstance,
  addEdge
} from "reactflow";
import "reactflow/dist/style.css";
import iconImage from "../../../../../assets/icons/dark/icon.png";
import { ActiveNodeDrawer } from "../../active-node-drawer";
import { ControlPanel } from "../../control-panel";
import { EnumNode } from "../../enum-node";
import { EventNode } from "../../event-node";
import { MiniMap } from "../../mini-map";
import { ModelNode } from "../../model-node";
import { ObjectNode } from "../../object-node";
import { OperationNode } from "../../operation-node";
import { PluginNode } from "../../plugin-node";
import { ServiceNode } from "../../service-node";
import { useGraphStore } from "../../state";
import { getLayoutElements } from "../../utilities/get-layout";
import { NodeType } from "../../utilities/node-types";
import "./ServiceGraphLayout.css";

export const NODE_TYPES = {
  [NodeType.MODEL_NODE]: ModelNode,
  [NodeType.ENUM_NODE]: EnumNode,
  [NodeType.EVENT_NODE]: EventNode,
  [NodeType.OPERATION_NODE]: OperationNode,
  [NodeType.OBJECT_NODE]: ObjectNode,
  [NodeType.PLUGIN_NODE]: PluginNode,
  [NodeType.SERVICE_NODE]: ServiceNode
};

export interface ServiceGraphLayoutProps {
  className?: string;
}

export const ServiceGraphLayout: React.FC<ServiceGraphLayoutProps> = ({
  className
}: ServiceGraphLayoutProps) => {
  const [nodes, setNodes] = useGraphStore().use.nodes();
  const [edges, setEdges] = useGraphStore().use.edges();

  const backgroundVariant = useGraphStore().get.backgroundVariant();
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const setActiveId = useGraphStore().set.activeId();
  const onSelect = useCallback(
    (elements: OnSelectionChangeParams) => {
      if (elements.nodes.length > 0 && elements.nodes[0]?.id) {
        setActiveId({ nodeId: elements.nodes[0].id, fieldId: null });
        setNodes(elements.nodes);
      }
    },
    [setActiveId, nodes]
  );

  const onConnect = useCallback(
    params => {
      const { nodes: layoutNodes, edges: layoutEdges } = getLayoutElements(
        nodes,
        edges,
        "LR"
      );

      setNodes([...layoutNodes]);
      setEdges(eds => [
        ...layoutEdges,
        ...addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    event => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (reactFlowInstance) {
        // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
        // and you don't need to subtract the reactFlowBounds.left/top anymore
        // details: https://reactflow.dev/whats-new/2023-11-10
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });
        const newNode = {
          id: uuid(),
          type,
          position,
          data: {}
        };

        setNodes((currentNodes: Node[]) => currentNodes.concat(newNode));
      }
    },
    [reactFlowInstance]
  );

  return (
    <div className={clsx("h-[40rem] w-full", className)}>
      <ReactFlow
        noDragClassName="acidic-no-drag"
        nodesDraggable={true}
        selectNodesOnDrag={false}
        elementsSelectable={true}
        onSelectionChange={onSelect}
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={NODE_TYPES}>
        <Background
          id="bg-1"
          color="#1a202c"
          variant={backgroundVariant ? backgroundVariant! : undefined}
        />

        <ControlPanel />
        <MiniMap reactFlowInstance={reactFlowInstance} />
        <ActiveNodeDrawer size="sm" />
        <Panel position="top-left" className="text-2xl font-bold text-white">
          <a href="https://acidic.io" target="_blank" rel="noreferrer">
            <img src={iconImage} alt="Acidic" className="h-16 w-16" />
          </a>
        </Panel>
      </ReactFlow>
    </div>
  );
};
