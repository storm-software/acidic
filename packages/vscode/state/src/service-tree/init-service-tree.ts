import { StormLog } from "@storm-stack/logging";
import { ExtensionContext, commands, window } from "vscode";
import { CommandName, getCommandId } from "../commands";
import { listenForAndStoreCollapsibleChanges } from "../utilities/tree-item-collapsible-store";
import { ServiceTreeProvider } from "./service-tree-provider";

export function initServiceTree(
  context: ExtensionContext,
  config: any,
  logger: StormLog,
  onReadyFn: () => void
): ServiceTreeProvider {
  const serviceExplorer = new ServiceTreeProvider(config, logger, onReadyFn);
  const serviceExplorerView = window.createTreeView(
    "acidicWorkspace.views.services",
    {
      treeDataProvider: serviceExplorer,
      showCollapseAll: true
    }
  );
  context.subscriptions.push(
    commands.registerCommand(
      getCommandId(CommandName.REFRESH_SCHEMA_START),
      serviceExplorer.refresh
    )
  );

  listenForAndStoreCollapsibleChanges(serviceExplorerView, context);

  return serviceExplorer;
}
