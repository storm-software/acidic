import { AcidicPluginOptions } from "@acidic/schema";
import {
  AcidicPluginHandler,
  type AcidicContext,
  type IGenerator
} from "../types";

/**
 * Runs the core functionality of a plugin generator
 */
export const createPluginHandler =
  <TOptions extends AcidicPluginOptions = AcidicPluginOptions>(
    fileName: string = "index"
  ): AcidicPluginHandler<TOptions> =>
  async (
    options: TOptions,
    context: AcidicContext,
    generator: IGenerator<TOptions>
  ) => {
    const fileContent = await generator.generate(
      options,
      context.wrapper.service,
      context,
      {}
    );

    await generator.write(options, fileContent, fileName);
  };
