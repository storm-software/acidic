import { StormLog } from "@storm-stack/logging";
import { ExtensionContext } from "vscode";

export interface AcidicWorkspaceContext extends ExtensionContext {
  logger: StormLog;
}
