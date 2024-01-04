import { useCallback, useEffect, useRef } from "react";
import {
  Node,
  NodeChange,
  applyNodeChanges,
  useNodesState as useExternalNodesState
} from "reactflow";
import { useGraphStore } from "../state";
import { useEvent } from "./use-event";

export function useMouseHandler(reactFlowInstance: any) {
  const [internalNodes, setInternalNodes] = useGraphStore().use.isShowingMinimap();
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (reactFlowInstance) {
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
    }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };

  }, []);

  return ;
}
