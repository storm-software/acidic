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

import type {
  PluginPluginOptions,
  PluginPluginResolvedConfig,
  PluginPluginUserConfig
} from "@powerlines/plugin-plugin/types/plugin";
import type { PluginContext } from "powerlines/types/context";

export interface InternalBuildPluginOptions extends PluginPluginOptions {}

export interface InternalBuildPluginUserConfig extends PluginPluginUserConfig {}

export interface InternalBuildPluginResolvedConfig extends PluginPluginResolvedConfig {}

export type InternalBuildPluginContext<
  TResolvedConfig extends InternalBuildPluginResolvedConfig =
    InternalBuildPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
