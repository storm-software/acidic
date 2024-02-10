import { CommandId, getCommandId } from "@acidic/messages";
import type { StormTrace } from "@storm-stack/telemetry";
import { type ExtensionContext, commands, window } from "vscode";
import { listenForAndStoreCollapsibleChanges } from "../utilities/tree-item-collapsible-store";
import { ServiceTreeProvider } from "./service-tree-provider";

export async function initServiceTree(
  context: ExtensionContext,
  config: any,
  logger: StormTrace,
  onReadyFn: () => void
): Promise<ServiceTreeProvider> {
  logger.info("Initializing Service Tree");

  const serviceExplorer = await ServiceTreeProvider.create(config, logger, onReadyFn);
  const serviceExplorerView = window.createTreeView("acidicWorkspace.views.services", {
    treeDataProvider: serviceExplorer,
    showCollapseAll: true
  });
  context.subscriptions.push(
    commands.registerCommand(getCommandId(CommandId.ON_REFRESH_WORKSPACE), serviceExplorer.refresh)
  );

  listenForAndStoreCollapsibleChanges(serviceExplorerView, context);
  return serviceExplorer;
}
