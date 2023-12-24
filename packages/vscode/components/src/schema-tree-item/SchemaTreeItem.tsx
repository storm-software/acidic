import { CommandName } from "@acidic/vscode-state";
import { useEffect, useState } from "react";

export interface SchemaTreeItemProps {
  /**
   * The name of the service.
   */
  service: string;
}

/**
 * A UI tree item component for a specific service's schema
 *
 * @param props - The props for this component.
 * @returns A UI tree item component for a specific service's schema
 */
export function SchemaTreeItem({ service }: SchemaTreeItemProps) {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data) {
        const { command, data } = event.data;
        if (
          command === CommandName.INIT_SCHEMA_START &&
          data?.service === service
        ) {
          setIsRefreshing(true);
        }
        if (
          command === CommandName.INIT_SCHEMA_END &&
          data?.service === service
        ) {
          setIsRefreshing(false);
        } else if (
          command === CommandName.REFRESH_SCHEMA_START &&
          data?.service === service
        ) {
          setIsRefreshing(true);
        } else if (
          command === CommandName.REFRESH_SCHEMA_END &&
          data?.service === service
        ) {
          setIsRefreshing(false);
        }
      }
    };
    window.addEventListener("message", listener);

    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <div>
      <h1 className="text-[color:var(--vscode-activityBar-foreground)]">
        Welcome to {service}! Currently refreshing: {isRefreshing.toString()}
      </h1>
    </div>
  );
}

export default SchemaTreeItem;
