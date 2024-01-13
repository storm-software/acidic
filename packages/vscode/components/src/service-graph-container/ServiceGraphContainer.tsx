import { ServiceDefinition } from "@acidic/schema";
import { ServiceGraph } from "@acidic/service-graph";
import { CommandName, getCommandId } from "@acidic/vscode-rpc";
import { StormParser } from "@storm-stack/serialization";
import React, { useEffect, useState } from "react";

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
export function ServiceGraphContainer({
  className
}: ServiceGraphContainerProps) {
  const [schemas, setDefinitions] = useState<ServiceDefinition[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case getCommandId(CommandName.SET_SERVICES): {
          if (message.value) {
            const nextDefinitions = StormParser.parse<ServiceDefinition[]>(
              message.value
            );
            if (nextDefinitions) {
              setDefinitions(nextDefinitions);
            }
          }

          break;
        }
        case getCommandId(CommandName.SET_SETTINGS): {
          setSettings(message.value);
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

  return <ServiceGraph schemas={schemas} />;
}
