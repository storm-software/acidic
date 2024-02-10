import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { type ReactFlowInstance, MiniMap as ReactFlowMiniMap } from "reactflow";
import { useGraphStore } from "../state";
import { getNodeColor } from "../utilities";

export interface MiniMapProps {
  className?: string;
  reactFlowInstance: ReactFlowInstance | null;
}

export const MiniMap = ({ className, reactFlowInstance }: MiniMapProps) => {
  const isShowingMinimap = useGraphStore().get.isShowingMinimap();

  const [isHovering, setIsHovering] = useState<boolean>(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();

      if (reactFlowInstance && isShowingMinimap) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        const viewport = reactFlowInstance.getViewport();
        setIsHovering(viewport.x - 200 < position.x && viewport.y - 200 < position.y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ReactFlowMiniMap
      className={clsx(className, "transition-all duration-500", {
        hidden: !isHovering
      })}
      position="bottom-right"
      nodeColor={getNodeColor}
      nodeStrokeColor="#444444"
      nodeStrokeWidth={3}
      maskColor="rgba(75, 85, 99, 0.4)"
      zoomable={true}
      pannable={true}
    />
  );
};
