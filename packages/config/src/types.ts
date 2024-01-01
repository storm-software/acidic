import { OptionValue, PluginOptions } from "@acidic/schema";
import { StormConfig } from "@storm-software/config-tools";

/**
 * Acidic configuration options
 */
export type AcidicConfig = StormConfig<
  "acidic",
  {
    /**
     * The default options for all plugins
     */
    defaultOptions?: Omit<PluginOptions, "provider">;

    /**
     * The base output directory where the generated code/artifacts will be written to
     */
    outputPath?: string;

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
    ignored?: string | readonly string[];
  } & Record<
    string,
    OptionValue | OptionValue[] | Record<string, OptionValue | OptionValue[]>
  >
>;
