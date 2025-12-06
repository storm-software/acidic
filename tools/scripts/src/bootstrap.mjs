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

import { chalk, echo } from "zx";

try {
  echo`${chalk.whiteBright("⚙️  Bootstrapping the monorepo...")}`;

  //   await build({
  //     entryPoints: ["tools/nx/src/plugins/plugin.ts"],
  //     target: "node22",
  //     outdir: "dist/plugins",
  //     tsconfig: "tools/nx/tsconfig.json",
  //     packages: "bundle",
  //     external: ["nx", "@nx/*"],
  //     logLevel: "info",
  //     bundle: true,
  //     minify: false,
  //     format: "esm",
  //     platform: "node"
  //   });

  //   const proc = $`pnpm nx reset --onlyDaemon`.timeout(`${2 * 60}s`);
  //   proc.stdout.on("data", data => {
  //     echo`${data}`;
  //   });
  //   const result = await proc;
  //   if (result.exitCode !== 0) {
  //     throw new Error(
  //       `An error occurred while resetting the Nx daemon process: \n\n${result.message}\n`
  //     );
  //   }

  echo`${chalk.green(" ✔ Completed monorepo bootstrapping successfully!")}`;
} catch (error) {
  echo`${chalk.red(
    error?.message
      ? error.message
      : "A failure occurred while bootstrapping the monorepo"
  )}`;

  process.exit(1);
}
