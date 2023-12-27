import { AcidicConfig } from "@acidic/config";
import { StormLog } from "@storm-stack/logging";
import "pino-pretty";
import { OutputChannel, window } from "vscode";

let _channel: OutputChannel;
export function getOutputChannel(): OutputChannel {
  if (!_channel) {
    _channel = window.createOutputChannel("Acidic Workspace");
  }

  return _channel;
}

export const createLogger = (config: AcidicConfig): StormLog => {
  return StormLog.create(
    config,
    "Acidic Engine" /*, [
    createVsCodeLogger(config)
  ]*/
  );
};
