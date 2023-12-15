import { LoggerWrapper, LoggingConfig, StormLog } from "@storm-stack/logging";
import { OutputChannel, window } from "vscode";

let _channel: OutputChannel;
export function getOutputChannel(): OutputChannel {
  if (!_channel) {
    _channel = window.createOutputChannel("Acidic Workspace");
  }

  return _channel;
}

export const createLogger = (config: LoggingConfig): StormLog => {
  return StormLog.create(config, "Acidic Engine", [
    LoggerWrapper.wrap(
      {
        /**
         * Write a success message to the logs.
         *
         * @param message - The message to print.
         * @returns Either a promise that resolves to void or void.
         */
        success: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write a fatal message to the logs.
         *
         * @param message - The fatal message to be displayed.
         * @returns Either a promise that resolves to void or void.
         */
        fatal: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write an error message to the logs.
         *
         * @param message - The message to be displayed.
         * @returns Either a promise that resolves to void or void.
         */
        error: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write an exception message to the logs.
         *
         * @param message - The message to be displayed.
         * @returns Either a promise that resolves to void or void.
         */
        exception: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write a warning message to the logs.
         *
         * @param message - The message to be printed.
         * @returns Either a promise that resolves to void or void.
         */
        warn: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write an informational message to the logs.
         *
         * @param message - The message to be printed.
         * @returns Either a promise that resolves to void or void.
         */
        info: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write a debug message to the logs.
         *
         * @param message - The message to be printed.
         * @returns Either a promise that resolves to void or void.
         */
        debug: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write a trace message to the logs.
         *
         * @param message - The message to be printed.
         * @returns Either a promise that resolves to void or void.
         */
        trace: (message: string) => {
          getOutputChannel().appendLine(message);
        },

        /**
         * Write an informational message to the logs.
         *
         * @param message - The message to be printed.
         * @returns Either a promise that resolves to void or void.
         */
        log: (message: string) => {
          getOutputChannel().appendLine(message);
        }
      },
      config
    )
  ]);
};
