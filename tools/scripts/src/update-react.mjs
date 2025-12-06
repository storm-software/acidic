#!/usr/bin/env zx
/* -------------------------------------------------------------------

                       ⚡ Storm Software - Acidic

 This code was released as part of the Acidic project. Acidic
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/acidic.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/acidic
 Documentation:            https://docs.stormsoftware.com/projects/acidic
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { $, chalk, echo } from "zx";

try {
  await echo`${chalk.whiteBright("🔄  Updating the workspace's React dependencies...")}`;

  await echo`${chalk.whiteBright("Checking for react, react-dom, and react-server-dom-webpack updates...")}`;
  let proc =
    $`pnpm add react@next react-dom@next react-server-dom-webpack@next --filter="earthquake"`.timeout(
      `${8 * 60}s`
    );
  proc.stdout.on("data", data => echo`${data}`);
  let result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while updating react and react-dom packages:\n\n${result.message}\n`
    );
  }

  proc = $`pnpm add typescript@next -w -D`.timeout(`${8 * 60}s`);
  proc.stdout.on("data", data => echo`${data}`);
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while updating @types/react and @types/react-dom packages:\n\n${result.message}\n`
    );
  }

  proc =
    $`pnpm add @types/react@ts6.0 @types/react-dom@ts6.0 -D --filter="acidic"`.timeout(
      `${8 * 60}s`
    );
  proc.stdout.on("data", data => echo`${data}`);
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while updating @types/react and @types/react-dom packages:\n\n${result.message}\n`
    );
  }

  echo`${chalk.green(" ✔ Successfully updated workspace's React package dependencies")}\n\n`;
} catch (error) {
  echo`${chalk.red(
    error?.message ??
      "A failure occurred while updating the workspace's React package dependencies."
  )}`;
  process.exit(1);
}
