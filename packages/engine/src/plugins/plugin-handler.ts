import type { AcidicPluginOptions } from "@acidic/definition";
import type { AcidicPluginProcessor, AcidicContext, IGenerator } from "../types";

/**
 * Runs the core functionality of a plugin generator
 */
export const createPluginHandler =
  <
    TOptions extends AcidicPluginOptions = AcidicPluginOptions,
    TGenerator extends IGenerator<TOptions> = IGenerator<TOptions>
  >(
    fileName = "index"
  ): AcidicPluginProcessor<TOptions, TGenerator> =>
  async (context: AcidicContext, options: TOptions, generator?: TGenerator) => {
    if (generator) {
      const fileContent = await generator.generate(context, context.definition.service, options, {});

      await generator.write(options, fileContent, fileName);
    }
  };
