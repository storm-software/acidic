import { useCallback, useLayoutEffect, useRef } from "react";
import {
  Node,
  NodeChange,
  applyNodeChanges,
  useNodesState as useExternalNodesState
} from "reactflow";
import { useGraphStore } from "../state";
import { useEvent } from "./use-event";

export function useNodesState(): [
  Node[],
  (nodes: Node[] | ((previous: Node[]) => Node[])) => void,
  (changes: NodeChange[]) => void
] {
  const [internalNodes, setInternalNodes] = useGraphStore().use.nodes();

  const initialState = useRef<Node[]>(internalNodes);
  const [externalNodes, setExternalNodes, onExternalNodesChange] =
    useExternalNodesState(initialState.current);

  useLayoutEffect(() => {
    setInternalNodes(externalNodes);
  }, [externalNodes]);

  const setNodes = useCallback(
    (nodes: Node[] | ((previous: Node[]) => Node[])) => {
      setInternalNodes(nodes);
      setExternalNodes(nodes);
    },
    []
  );

  const handleNodesChange = useEvent((changes: NodeChange[]) => {
    setNodes(applyNodeChanges(changes, internalNodes));
    onExternalNodesChange(changes);
  });

  return [internalNodes, setNodes, handleNodesChange];
}
