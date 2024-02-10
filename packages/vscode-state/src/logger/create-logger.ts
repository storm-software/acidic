import type { AcidicConfig } from "@acidic/definition";
import { StormTrace } from "@storm-stack/telemetry";
import "pino-pretty";
import { createVsCodeLogger } from "./vscode-logger";

export const createLogger = (config: AcidicConfig): StormTrace => {
  return StormTrace.create(config, "Acidic Engine", [createVsCodeLogger(config)]);
};
