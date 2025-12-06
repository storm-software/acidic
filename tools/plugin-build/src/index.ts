/* -------------------------------------------------------------------

                   ⚡ Storm Software - Earthquake

 This code was released as part of the Earthquake project. Earthquake
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/earthquake.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/earthquake
 Documentation:            https://docs.stormsoftware.com/projects/earthquake
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import _plugin from "@powerlines/plugin-plugin";
import defu from "defu";
import type { ConfigResult, Plugin } from "powerlines/types/plugin";
import type {
  InternalBuildPluginContext,
  InternalBuildPluginOptions
} from "./types/plugin";

export * from "./types";

/**
 * The internal Earthquake Build plugin for Powerlines.
 *
 * @internal
 *
 * @param options - The internal earthquake build plugin user configuration options.
 * @returns A Powerlines plugin that is used to build the `earthquake` package.
 */
export const plugin = <
  TContext extends InternalBuildPluginContext = InternalBuildPluginContext
>(
  options: InternalBuildPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "internal-build",
    dependsOn: [
      _plugin({
        alloy: false,
        ...options
      })
    ],
    config() {
      return defu(options, {}) as ConfigResult<TContext>;
    }
  } as Plugin<TContext>;
};

export default plugin;
