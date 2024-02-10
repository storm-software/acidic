import type { StormTrace } from "@storm-stack/telemetry";
import type { ExtensionContext } from "vscode";

export interface AcidicWorkspaceContext extends ExtensionContext {
  logger: StormTrace;
}
