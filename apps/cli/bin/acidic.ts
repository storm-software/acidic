#!/usr/bin/env node

import { exitWithError, exitWithSuccess, handleProcess } from "@storm-software/config-tools";
import { StormTrace } from "@storm-stack/telemetry";
import { createCLIAcidicProgram } from "@acidic/cli";
import { createAcidicConfig } from "@acidic/engine";

const config = await createAcidicConfig();
const logger = StormTrace.create(config, "Acidic CLI");

handleProcess(config);

try {
  await createCLIAcidicProgram(config, logger);
} catch (error) {
  logger.fatal(
    `An error occured while running the Acidic Engine CLI application.\n\nError: ${
      (error as Error)?.message
    }`
  );
  exitWithError(config);
}

exitWithSuccess(config);
