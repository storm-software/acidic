/**
 * The valibot plugin used by Storm Software for building TypeScript applications.
 *
 * @remarks
 *
 *
 * @packageDocumentation
 */

import {
  type AcidicPluginProcessor,
  TemplateGenerator,
  createTemplatePluginHandler
} from "@acidic/engine";
import type { ValibotPluginOptions } from "./types";

export const name = "Valibot Schema Generator";

export const generator = new TemplateGenerator<ValibotPluginOptions>({});

export const process: AcidicPluginProcessor<
  ValibotPluginOptions,
  TemplateGenerator<ValibotPluginOptions>
> = createTemplatePluginHandler({
  partialsPath: "templates/partials/**",
  modelTemplatePath: "templates/data-models/**",
  enumTemplatePath: "templates/enums/**",
  interfaceTemplatePath: "templates/interfaces/**"
});
