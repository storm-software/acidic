import { OutputChannel, window } from "vscode";

export interface Logger {
  log(message: string): void;
}

let _channel: OutputChannel;

export function getOutputChannel(): OutputChannel {
  if (!_channel) {
    _channel = window.createOutputChannel("Acidic Workspace");
  }
  return _channel;
}

export const outputLogger: Logger = {
  log(message) {
    getOutputChannel().appendLine(message);
  }
};
