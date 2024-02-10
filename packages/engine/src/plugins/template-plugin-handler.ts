import type { NodeDefinition } from "@acidic/definition";
import { isFile } from "@storm-stack/file-system";
import { StormParser } from "@storm-stack/serialization";
import { EMPTY_STRING } from "@storm-stack/utilities";
import { readFile } from "node:fs/promises";
import { glob } from "glob";
import { join } from "node:path";
import type { TemplateGenerator } from "../generators/template-generator";
import {
  type AcidicContext,
  type AcidicPluginProcessor,
  TEMPLATE_EXTENSIONS,
  type TemplatePluginOptions,
  type TemplatePluginPaths
} from "../types";

export type TemplateDetails = {
  name: string;
  content: string;
};

/**
 * Runs the core functionality of a template style plugin generator
 */
export const createTemplatePluginHandler =
  <
    TOptions extends TemplatePluginOptions = TemplatePluginOptions,
    TGenerator extends TemplateGenerator<TOptions> = TemplateGenerator<TOptions>
  >(
    templatePaths: TemplatePluginPaths,
    filterTemplates?: (   context: AcidicContext,
      node: NodeDefinition | null,
      options: TOptions,
      generator: TemplateGenerator<TOptions>,
      templates: TemplateDetails[]
    ) => TemplateDetails[]
  ): AcidicPluginProcessor<TOptions, TGenerator> =>
  async (context: AcidicContext, options: TOptions,  generator?: TGenerator) => {
    context.logger.debug(
      `Generating templates with options:
${StormParser.stringify(options)}`
    );

    if (!generator) {
      context.logger.warn("No generator provided, skipping template generation");
      return;
    }

    const partials = await registerPartials(      context,
      templatePaths.partialsPath,
      options,

      generator
    );
    const _filterTemplates = await getFilterTemplates(partials, filterTemplates);

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    let templates = await getTemplates(context, templatePaths.templatePath!, options.templatePath);

    // Allow the plugin to filter the templates to be used
    // based on the options and context
    templates = _filterTemplates(context, null, options,  generator,  templates);

    // Remove any templates that are meant to be specific to a model node
    templates = templates.filter(
      (template: TemplateDetails) => !template.name.includes("__name__")
    );

    const service = context.definition.service;
    const generated = await Promise.all(
      templates.map((template) =>
        getGeneratedContent(context, service, options,  generator, template)
      )
    );

    await Promise.all(generated.map((file) => generator.write(options, file.content, file.name)));

    if (templatePaths.enumTemplatePath && service.enums && service.enums.length > 0) {
      context.logger.debug(`Running template based generation for ${service.enums.length} enums`);

      await generateNodeDefinitionTemplates(  context,
        service.enums,
        templatePaths.enumTemplatePath,
        options,
        generator,
        _filterTemplates
      );
    }

    if (templatePaths.objectTemplatePath && service.objects && service.objects.length > 0) {
      context.logger.info(
        `Running template based generation for ${service.objects.length} api models`
      );

      await generateNodeDefinitionTemplates(  context,
        service.objects,
        templatePaths.objectTemplatePath,
        options,
        generator,
        _filterTemplates
      );
    }

    if (templatePaths.modelTemplatePath && service.models && service.models.length > 0) {
      context.logger.debug(
        `Running template based generation for ${service.models.length} data models`
      );

      await generateNodeDefinitionTemplates(  context,
        service.models,
        templatePaths.modelTemplatePath,
        options,
        generator,
        _filterTemplates
      );
    }

    if (templatePaths.eventTemplatePath && service.events && service.events.length > 0) {
      context.logger.debug(`Running template based generation for ${service.events.length} inputs`);

      await generateNodeDefinitionTemplates(  context,
        service.events,
        templatePaths.eventTemplatePath,
        options,
        generator,
        _filterTemplates
      );
    }

    if (templatePaths.queryTemplatePath && service.queries && service.queries.length > 0) {
      context.logger.debug(
        `Running template based generation for ${service.queries.length} query operations`
      );

      await generateNodeDefinitionTemplates(   context,
        service.queries,
        templatePaths.queryTemplatePath,
        options,
        generator,
        _filterTemplates
      );
    }

    if (templatePaths.mutationTemplatePath && service.mutations && service.mutations.length > 0) {
      context.logger.debug(
        `Running template based generation for ${service.mutations.length} mutation operations`
      );

      await generateNodeDefinitionTemplates(    context,
        service.mutations,
        templatePaths.mutationTemplatePath,
        options,
        generator,
        _filterTemplates
      );
    }

    if (
      templatePaths.subscriptionTemplatePath &&
      service.subscriptions &&
      service.subscriptions.length > 0
    ) {
      context.logger.debug(
        `Running template based generation for ${service.subscriptions.length} subscription operations`
      );

      await generateNodeDefinitionTemplates(
        context,
        service.subscriptions,
        templatePaths.subscriptionTemplatePath,
        options,
        generator,
        _filterTemplates
      );
    }

    await generator.save(options);
  };

const getFilterTemplates = <TOptions extends TemplatePluginOptions = TemplatePluginOptions>(
  partials: TemplateDetails[],
  filterTemplates?: ( context: AcidicContext,
    node: NodeDefinition | null,
    options: TOptions,
    generator: TemplateGenerator<TOptions>,
    templates: TemplateDetails[]
  ) => TemplateDetails[]
) => {
  const partialTemplates = partials.map((template) => template.name);

  return (    context: AcidicContext,
    node: NodeDefinition | null,
    options: TOptions,
    generator: TemplateGenerator<TOptions>,
    templates: TemplateDetails[]
  ): TemplateDetails[] => {
    if (!templates || templates.length === 0) {
      return [];
    }

    let result = templates;
    if (filterTemplates) {
      result = filterTemplates(context, node, options,  generator, result);
    }

    return partialTemplates && partialTemplates.length > 0
      ? result.filter(
          (template) =>
            !partialTemplates.some((partialTemplate) => template.name.includes(partialTemplate))
        )
      : result;
  };
};

const registerPartials = async <TOptions extends TemplatePluginOptions = TemplatePluginOptions>(  context: AcidicContext,
  partialsPath: string | string[] = [],
  options: TOptions,
  generator: TemplateGenerator<TOptions>
): Promise<TemplateDetails[]> => {
  if (partialsPath && partialsPath.length > 0) {
    let partials = await getTemplates(context, partialsPath);

    if (options.filterTemplates) {
      partials = options.filterTemplates(context, null, options, generator,  partials);
    }

    if (partials && partials.length > 0) {
      context.logger.debug(
        `Registering the following partials: ${partials.map((partial) => partial.name).join(", ")}`
      );

      await generator.registerPartials(
        partials.map((partial) => ({
          ...partial,
          name: formatFileName(partial.name)
        }))
      );
      return partials;
    }
  }

  return [];
};

const generateNodeDefinitionTemplates = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  context: AcidicContext,
  nodes: NodeDefinition[],
  templatePath: string | string[],
  options: TOptions,
  generator: TemplateGenerator<TOptions>,
  filterTemplates?: (    context: AcidicContext,
    node: NodeDefinition | null,
    options: TOptions,
    generator: TemplateGenerator<TOptions>,
    templates: TemplateDetails[]
  ) => TemplateDetails[]
) => {
  const templates = await getTemplates(context, templatePath);

  for (const node of nodes) {
    let nodeTemplates = Array.from(templates);

    // Allow the plugin to filter the templates to be used
    // based on the options and context
    if (filterTemplates) {
      nodeTemplates = filterTemplates(context, node, options, generator,  nodeTemplates);
    }

    const generated = await Promise.all(
      nodeTemplates.map((nodeTemplate) =>
        getGeneratedContent(context, node, options,  generator, nodeTemplate)
      )
    );

    await Promise.all(generated.map((file) => generator.write(options, file.content, file.name)));
  }
};

export const getGeneratedContent = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  context: AcidicContext,
  node: NodeDefinition,
  options: TOptions,
  generator: TemplateGenerator<TOptions>,
  template: TemplateDetails
): Promise<{ name: string; content: string }> => {
  const content = await generator.generate(context, node , options, template);

  const name = formatFileName(
    template.name
      .replace(__dirname, "")
      .replace(context.plugin ? context.plugin.resolvedPath : EMPTY_STRING, EMPTY_STRING),
    node
  );

  return {
    name,
    content
  };
};

export const getTemplates = async (
  context: AcidicContext,
  defaultPath: string | string[],
  optionsPath?: string | string[]
): Promise<TemplateDetails[]> => {
  const paths = mergePaths(defaultPath, optionsPath);
  if (!paths || (Array.isArray(paths) && paths.length === 0)) {
    return [];
  }

  const templateNames = await getTemplateNames(context, paths);
  if (!templateNames || templateNames.length === 0) {
    context.logger.warn(`No template files found in ${paths.join(", ")}`);
    return [];
  }

  context.logger.info(
    `Found the following template files ${paths.join(", ")}: ${templateNames.join(", ")}}`
  );

  return Promise.all(templateNames.map(getTemplate));
};

const formatFileName = (fileName: string, nodeDefinition?: NodeDefinition): string => {
  let result = TEMPLATE_EXTENSIONS.reduce((ret: string, ext: string) => {
    if (ret.endsWith(ext)) {
      return ret.replace(`.${ext}`, "");
    }

    return ret;
  }, fileName).replace("templates", "");

  if (nodeDefinition) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    result = result.replace("__name__", (nodeDefinition as NodeDefinition)?.name!);
  }

  return result;
};

const getTemplate = async (templateName: string): Promise<TemplateDetails> => {
  const content = await readFile(templateName, { encoding: "utf8" });

  return {
    name: templateName,
    content
  };
};

const getTemplateNames = async (
  context: AcidicContext,
  path: string | string[]
): Promise<string[]> => {
  if (!path || (Array.isArray(path) && path.length === 0)) {
    return [];
  }

  if (Array.isArray(path)) {
    return (await Promise.all(path.map((p) => getTemplateNames(context, p)))).reduce(
      (ret: string[], templateNamesListItem: string[]) => {
        for (const templateName of templateNamesListItem) {
          if (!ret.includes(templateName)) {
            ret.push(templateName);
          }
        }

        return ret;
      },
      []
    );
  }

  context.logger.info(`Checking for template files in ${__dirname} with ${path}`);

  let templatePath = __dirname;
  let templateNames = await glob(path, {
    ignore: "node_modules/**",
    cwd: __dirname
  });
  if (!templateNames || templateNames.length === 0) {
    // Try getting the templates from the path of the plugin
    const resolvedPath = context.plugin?.definition.provider;
    if (resolvedPath) {
      context.logger.info(`Checking for template files in ${resolvedPath} with ${path}`);

      templatePath = resolvedPath;
      templateNames = await glob(path, {
        ignore: "node_modules/**",
        cwd: resolvedPath
      });
    }
  }

  return templateNames.reduce((ret: string[], templateName: string) => {
    const fullPath = join(templatePath, templateName);
    if (
      isFile(fullPath) &&
      TEMPLATE_EXTENSIONS.some((ext: string) => fullPath.endsWith(ext)) &&
      !ret.includes(fullPath)
    ) {
      ret.push(fullPath);
    }

    return ret;
  }, []);
};

const mergePaths = (defaultPath: string | string[], optionsPath?: string | string[]): string[] => {
  const paths: string[] = [];
  if (Array.isArray(defaultPath)) {
    paths.push(...defaultPath);
  } else if (defaultPath) {
    paths.push(defaultPath);
  }

  if (optionsPath) {
    if (Array.isArray(optionsPath)) {
      paths.push(...optionsPath);
    } else if (optionsPath) {
      paths.push(optionsPath);
    }
  }

  return paths;
};
