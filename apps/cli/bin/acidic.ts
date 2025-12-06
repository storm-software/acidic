#!/usr/bin/env node

import {
  loadStormConfig,
  exitWithSuccess,
  handleProcess,
  writeFatal,
  writeSuccess,
  exitWithError,
} from '@storm-software/config-tools'
import {createCLIAcidicProgram} from '@acidic/cli'
import {createAcidicConfig} from '@acidic/node-engine'
import {StormTrace} from '@storm-stack/telemetry'

void (async () => {
  const config = await loadStormConfig()
  const logger = StormTrace.create(config, 'Acidic CLI')

  try {
    handleProcess(config)

    await createCLIAcidicProgram(await createAcidicConfig(), logger)

    logger.success(`Completed execution of the Acidic Engine CLI application.`)
    exitWithSuccess(config)
  } catch (error) {
    logger.fatal(
      `An error occured while running the Acidic Engine CLI application.\n\nError: ${(error as Error)?.message}`,
    )
    exitWithError(config)
    process.exit(1)
  }
})()
