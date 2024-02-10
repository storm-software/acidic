import { ServiceGraph, GraphStoreProvider } from "@acidic/service-graph";
import { ErrorBoundary } from "react-error-boundary";
// import { CommandId, getCommandId } from "@acidic/state";
//import { StormParser } from "@storm-stack/serialization";
// biome-ignore lint/nursery/useImportType: <explanation>
import React from "react";
import { useEffect, useState } from "react";
import { parseService, type ServiceDefinition } from "@acidic/definition";

export interface ServiceGraphContainerProps {
  className?: string;
}

interface vscode {
  postMessage(message: any): void;
}
declare const vscode: vscode;

/**
 * A UI tree item component for a specific service's schema
 *
 * @param props - The props for this component.
 * @returns A UI tree item component for a specific service's schema
 */
export const ServiceGraphContainer = (_props: ServiceGraphContainerProps): React.ReactElement => {
  const [schemas, setSchemas] = useState<ServiceDefinition[]>([]);
  //const [_, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      vscode.postMessage({
        type: "alert",
        text: "Received command in ServiceGraphContainer"
      });

      const message = event.data;
      switch (message.command) {
        case "updateServices": {
          if (message.data.services && Array.isArray(message.data.services)) {
            const updatedSchemas = message.data.services.map((service) => parseService(service));
            setSchemas(updatedSchemas);
          }

          break;
        }
      }
    };
    window.addEventListener("message", listener);

    // Post message to the extension whenever sapling is opened
    /*vscode.postMessage({
      type: "onReacTreeVisible",
      value: null
    });

    // Post message to the extension for the user's settings whenever sapling is opened
    vscode.postMessage({
      type: "onSettingsAcquire",
      value: null
    });*/

    return () => window.removeEventListener("message", listener);
  }, []);

  const logError = (error: Error, info: { componentStack: string }) => {
    console.error(error, info);
  };

  return (
    <ErrorBoundary
      FallbackComponent={(_) => (
        <div className="w-full h-full">
          <h1>An error occured while processing</h1>
        </div>
      )}
      onError={logError}
    >
      <div className="h-full w-full flex items-center justify-center">
        <GraphStoreProvider schemas={schemas}>
          <ServiceGraph />
        </GraphStoreProvider>
      </div>
    </ErrorBoundary>
  );
};
