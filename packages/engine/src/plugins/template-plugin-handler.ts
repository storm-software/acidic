import { isFile } from "@storm-stack/file-system";
import { stringify } from "@storm-stack/serialization";
import { EMPTY_STRING } from "@storm-stack/utilities";
import { readFile } from "fs/promises";
import { glob } from "glob";
import { join } from "path";
import { TemplateGenerator } from "../generators/template-generator";
import {
  Context,
  NodeSchema,
  PluginHandler,
  TEMPLATE_EXTENSIONS,
  TemplatePluginOptions,
  TemplatePluginPaths
} from "../types";

export type TemplateDetails = {
  name: string;
  content: string;
};

/**
 * Runs the core functionality of a template style plugin generator
 */
export const createTemplatePluginHandler =
  <TOptions extends TemplatePluginOptions = TemplatePluginOptions>(
    templatePaths: TemplatePluginPaths,
    filterTemplates?: (
      options: TOptions,
      context: Context,
      generator: TemplateGenerator<TOptions>,
      node: NodeSchema | null,
      templates: Array<TemplateDetails>
    ) => Array<TemplateDetails>
  ): PluginHandler<TOptions> =>
  async (
    options: TOptions,
    context: Context,
    generator: TemplateGenerator<TOptions>
  ) => {
    context.logger.debug(
      `Generating templates with options:
${stringify(options)}`
    );

    const partials = await registerPartials(
      templatePaths.partialsPath,
      options,
      context,
      generator
    );
    const _filterTemplates = await getFilterTemplates(
      partials,
      filterTemplates
    );

    let templates = await getTemplates(
      context,
      templatePaths.templatePath!,
      options.templatePath
    );

    // Allow the plugin to filter the templates to be used
    // based on the options and context
    templates = _filterTemplates(options, context, generator, null, templates);

    // Remove any templates that are meant to be specific to a model node
    templates = templates.filter(
      (template: TemplateDetails) => !template.name.includes("__name__")
    );

    const service = context.schema.service;
    let generated = await Promise.all(
      templates.map(template =>
        getGeneratedContent(options, context, service, generator, template)
      )
    );

    await Promise.all(
      generated.map(file => generator.write(options, file.content, file.name))
    );

    if (
      templatePaths.enumTemplatePath &&
      service.enums &&
      service.enums.length > 0
    ) {
      context.logger.debug(
        `Running template based generation for ${service.enums.length} enums`
      );

      await generateNodeSchemaTemplates(
        templatePaths.enumTemplatePath,
        options,
        context,
        service.enums,
        generator,
        _filterTemplates
      );
    }

    if (
      templatePaths.objectTemplatePath &&
      service.objects &&
      service.objects.length > 0
    ) {
      context.logger.info(
        `Running template based generation for ${service.objects.length} api models`
      );

      await generateNodeSchemaTemplates(
        templatePaths.objectTemplatePath,
        options,
        context,
        service.objects,
        generator,
        _filterTemplates
      );
    }

    if (
      templatePaths.modelTemplatePath &&
      service.models &&
      service.models.length > 0
    ) {
      context.logger.debug(
        `Running template based generation for ${service.models.length} data models`
      );

      await generateNodeSchemaTemplates(
        templatePaths.modelTemplatePath,
        options,
        context,
        service.models,
        generator,
        _filterTemplates
      );
    }

    if (
      templatePaths.eventTemplatePath &&
      service.events &&
      service.events.length > 0
    ) {
      context.logger.debug(
        `Running template based generation for ${service.events.length} inputs`
      );

      await generateNodeSchemaTemplates(
        templatePaths.eventTemplatePath,
        options,
        context,
        service.events,
        generator,
        _filterTemplates
      );
    }

    if (
      templatePaths.queryTemplatePath &&
      service.queries &&
      service.queries.length > 0
    ) {
      context.logger.debug(
        `Running template based generation for ${service.queries.length} query operations`
      );

      await generateNodeSchemaTemplates(
        templatePaths.queryTemplatePath,
        options,
        context,
        service.queries,
        generator,
        _filterTemplates
      );
    }

    if (
      templatePaths.mutationTemplatePath &&
      service.mutations &&
      service.mutations.length > 0
    ) {
      context.logger.debug(
        `Running template based generation for ${service.mutations.length} mutation operations`
      );

      await generateNodeSchemaTemplates(
        templatePaths.mutationTemplatePath,
        options,
        context,
        service.mutations,
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

      await generateNodeSchemaTemplates(
        templatePaths.subscriptionTemplatePath,
        options,
        context,
        service.subscriptions,
        generator,
        _filterTemplates
      );
    }

    await generator.save(options);
  };

const getFilterTemplates = <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  partials: Array<TemplateDetails>,
  filterTemplates?: (
    options: TOptions,
    context: Context,
    generator: TemplateGenerator<TOptions>,
    node: NodeSchema | null,
    templates: Array<TemplateDetails>
  ) => Array<TemplateDetails>
) => {
  const partialTemplates = partials.map(template => template.name);

  return (
    options: TOptions,
    context: Context,
    generator: TemplateGenerator<TOptions>,
    node: NodeSchema | null,
    templates: Array<TemplateDetails>
  ): Array<TemplateDetails> => {
    if (!templates || templates.length === 0) {
      return [];
    }

    let result = templates;
    if (filterTemplates) {
      result = filterTemplates(options, context, generator, node, result);
    }

    return partialTemplates && partialTemplates.length > 0
      ? result.filter(
          template =>
            !partialTemplates.some(partialTemplate =>
              template.name.includes(partialTemplate)
            )
        )
      : result;
  };
};

const registerPartials = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  partialsPath: string | string[] = [],
  options: TOptions,
  context: Context,
  generator: TemplateGenerator<TOptions>
): Promise<Array<TemplateDetails>> => {
  if (partialsPath && partialsPath.length > 0) {
    let partials = await getTemplates(context, partialsPath);

    if (options.filterTemplates) {
      partials = options.filterTemplates(
        options,
        context,
        generator,
        null,
        partials
      );
    }

    if (partials && partials.length > 0) {
      context.logger.debug(
        `Registering the following partials: ${partials
          .map(partial => partial.name)
          .join(", ")}`
      );

      await generator.registerPartials(
        partials.map(partial => ({
          ...partial,
          name: formatFileName(partial.name)
        }))
      );
      return partials;
    }
  }

  return [];
};

const generateNodeSchemaTemplates = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  templatePath: string | string[],
  options: TOptions,
  context: Context,
  nodes: NodeSchema[],
  generator: TemplateGenerator<TOptions>,
  filterTemplates?: (
    options: TOptions,
    context: Context,
    generator: TemplateGenerator<TOptions>,
    node: NodeSchema | null,
    templates: Array<TemplateDetails>
  ) => Array<TemplateDetails>
) => {
  let templates = await getTemplates(context, templatePath);

  for (const node of nodes) {
    let nodeTemplates = Array.from(templates);

    // Allow the plugin to filter the templates to be used
    // based on the options and context
    if (filterTemplates) {
      nodeTemplates = filterTemplates(
        options,
        context,
        generator,
        node,
        nodeTemplates
      );
    }

    const generated = await Promise.all(
      nodeTemplates.map(nodeTemplate =>
        getGeneratedContent(options, context, node, generator, nodeTemplate)
      )
    );

    await Promise.all(
      generated.map(file => generator.write(options, file.content, file.name))
    );
  }
};

export const getGeneratedContent = async <
  TOptions extends TemplatePluginOptions = TemplatePluginOptions
>(
  options: TOptions,
  context: Context,
  node: NodeSchema,
  generator: TemplateGenerator<TOptions>,
  template: TemplateDetails
): Promise<{ name: string; content: string }> => {
  const content = await generator.generate(options, node, context, template);

  const name = formatFileName(
    template.name
      .replace(__dirname, "")
      .replace(
        context.plugins.current
          ? context.plugins.table[context.plugins.current]?.module?.resolvedPath
          : EMPTY_STRING,
        EMPTY_STRING
      ),
    node
  );

  return {
    name,
    content
  };
};

export const getTemplates = async (
  context: Context,
  defaultPath: string | string[],
  optionsPath?: string | string[]
): Promise<Array<TemplateDetails>> => {
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
    `Found the following template files ${paths.join(
      ", "
    )}: ${templateNames.join(", ")}}`
  );

  return Promise.all(templateNames.map(getTemplate));
};

const formatFileName = (fileName: string, nodeSchema?: NodeSchema): string => {
  let result = TEMPLATE_EXTENSIONS.reduce((ret: string, ext: string) => {
    if (ret.endsWith(ext)) {
      return ret.replace(`.${ext}`, "");
    }

    return ret;
  }, fileName).replace("templates", "");

  if (nodeSchema) {
    result = result.replace("__name__", (nodeSchema as NodeSchema)?.name!);
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
  context: Context,
  path: string | string[]
): Promise<string[]> => {
  if (!path || (Array.isArray(path) && path.length === 0)) {
    return [];
  }

  if (Array.isArray(path)) {
    return (
      await Promise.all(path.map(p => getTemplateNames(context, p)))
    ).reduce((ret: string[], templateNamesListItem: string[]) => {
      templateNamesListItem.forEach((templateName: string) => {
        if (!ret.includes(templateName)) {
          ret.push(templateName);
        }
      });

      return ret;
    }, []);
  }

  context.logger.info(
    `Checking for template files in ${__dirname} with ${path}`
  );

  let templatePath = __dirname;
  let templateNames = await glob(path, {
    ignore: "node_modules/**",
    cwd: __dirname
  });
  if (!templateNames || templateNames.length === 0) {
    // Try getting the templates from the path of the plugin
    const resolvedPath =
      context.plugins.table[context.plugins.current!]?.module?.resolvedPath;
    if (resolvedPath) {
      context.logger.info(
        `Checking for template files in ${resolvedPath} with ${path}`
      );

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

const mergePaths = (
  defaultPath: string | string[],
  optionsPath?: string | string[]
): string[] => {
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
