import {
  exitWithError,
  exitWithSuccess,
  handleProcess
} from "@storm-software/config-tools";
import { StormTrace } from "@storm-stack/telemetry";
import { createAcidicConfig } from "@acidic/node-engine";
import { startLanguageServer } from "./service/create";
import {
  createConnection,
  IPCMessageReader,
  IPCMessageWriter
} from "vscode-languageserver/node";

/**
 * This is the entry point for the language server
 */
export const start = async () => {
  const config = await createAcidicConfig();
  const logger = StormTrace.create(config, "Acidic Language Server");

  handleProcess(config);

  try {
    const connection = process.argv.includes("--stdio")
      ? createConnection(process.stdin, process.stdout)
      : createConnection(
          new IPCMessageReader(process),
          new IPCMessageWriter(process)
        );

    // Start the language server
    startLanguageServer(connection);
  } catch (error) {
    logger.fatal(
      `An error occured while running the Acidic Engine CLI application.\n\nError: ${
        (error as Error)?.message
      }`
    );
    exitWithError(config);
  }

  exitWithSuccess(config);
};
