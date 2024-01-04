import { useCallback, useLayoutEffect, useRef } from "react";

export function useEvent(handler: (...args: any[]) => void) {
  const handlerRef = useRef<((...args: any[]) => void) | null>(null);

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current;

    return fn?.(...args);
  }, []);
}
