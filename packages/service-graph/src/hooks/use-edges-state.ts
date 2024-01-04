import { useCallback, useLayoutEffect, useRef } from "react";
import {
  Edge,
  EdgeChange,
  applyEdgeChanges,
  useEdgesState as useExternalEdgesState
} from "reactflow";
import { useGraphStore } from "../state";
import { useEvent } from "./use-event";

export function useEdgesState(): [
  Edge[],
  (edges: Edge[] | ((previous: Edge[]) => Edge[])) => void,
  (changes: EdgeChange[]) => void
] {
  const [internalEdges, setInternalEdges] = useGraphStore().use.edges();

  const initialState = useRef<Edge[]>(internalEdges);
  const [externalEdges, setExternalEdges, onExternalEdgesChange] =
    useExternalEdgesState(initialState.current);

  useLayoutEffect(() => {
    setInternalEdges(externalEdges);
  }, [externalEdges]);

  const setEdges = useCallback(
    (edges: Edge[] | ((previous: Edge[]) => Edge[])) => {
      setInternalEdges(edges);
      setExternalEdges(edges);
    },
    []
  );

  const handleEdgesChange = useEvent((changes: EdgeChange[]) => {
    setEdges(applyEdgeChanges(changes, internalEdges));
    onExternalEdgesChange(changes);
  });

  return [internalEdges, setEdges, handleEdgesChange];
}
