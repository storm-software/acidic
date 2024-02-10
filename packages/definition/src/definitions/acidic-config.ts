import type { StormConfig } from "@storm-software/config";
import type { AcidicPluginOptions } from "../types";
import typia from "typia";

/**
 * Acidic configuration options
 */
export interface AcidicConfig extends StormConfig {
  extensions: {
    acidic: {
      /**
       * The default options for all plugins
       */
      defaultOptions?: Omit<AcidicPluginOptions, "provider">;

      /**
       * The base output directory where the generated code/artifacts will be written to
       */
      outputPath?: string;

      /**
       * The Acidic cache directory where cached file data will be written to and read from
       *
       * @remarks
       * This value will be generated using the `cacheDirectory` option in the base of the Storm config file if not explicitly provided in the extension configuration
       *
       * @default "./node_modules/.cache/storm/acidic"
       */
      cacheDirectory: string;

      /**
       * A path(s) to the input file(s) to be used by the engine. This can be a glob pattern or an array of glob patterns.
       *
       * @default "**\/*.acid"
       */
      input: string | readonly string[];

      /**
       * A path(s) to the file(s) to be ignored by the engine. This can be a glob pattern or an array of glob patterns.
       *
       * @default [ "**\/node_modules/**", "**\/dist/**","**\/.git/**", "**\/.idea/**", "**\/.vscode/**", "**\/build/**", "**\/coverage/**", "**\/tmp/**" ]
       */
      ignored: string | readonly string[];
    };
  } & Record<string, any>;
}

export const validateConfig = typia.createValidate<AcidicConfig>();
export const stringifyConfig = typia.json.createStringify<AcidicConfig>();
export const parseConfig = typia.json.createAssertParse<AcidicConfig>();
