import { AcidicConfig } from "@acidic/config";
import { StormLog } from "@storm-stack/logging";
import "pino-pretty";
import { createVsCodeLogger } from "./vscode-logger";

export const createLogger = (config: AcidicConfig): StormLog => {
  return StormLog.create(config, "Acidic Engine", [createVsCodeLogger(config)]);
};
