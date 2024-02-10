/**
 * The drizzle plugin used by Storm Software for building TypeScript applications.
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
import type { DrizzlePluginOptions } from "./types";
import { filterDrizzleTemplates } from "./utils";

export const name = "Drizzle ORM Generator";

export const generator = new TemplateGenerator<DrizzlePluginOptions>({});

export const process: AcidicPluginProcessor<
  DrizzlePluginOptions,
  TemplateGenerator<DrizzlePluginOptions>
> = createTemplatePluginHandler(
  {
    modelTemplatePath: "templates/schemas/**",
    enumTemplatePath: "templates/enums/**"
  },
  filterDrizzleTemplates
);
