import type { NodeDefinition } from "@acidic/definition";
import { findFileName } from "@storm-stack/file-system";
import * as Handlebars from "handlebars";
import type { TemplateDetails } from "../plugins/template-plugin-handler";
import type {
  AcidicContext,
  TemplateGeneratorHelper,
  TemplatePluginOptions,
  TypeScriptGeneratorConfig,
  TypescriptPluginOptions
} from "../types";
import { TypescriptGenerator } from "./typescript-generator";

/**
 * Base class for TypeScript generators
 */
export class TemplateGenerator<
  TOptions extends TemplatePluginOptions = TypescriptPluginOptions
> extends TypescriptGenerator<TOptions> {
  public get name(): string {
    return "Template Generator";
  }

  public override get fileExtension() {
    return "*";
  }

  public get handlebars(): typeof Handlebars {
    return Handlebars;
  }

  protected templates = new Map<string, Handlebars.TemplateDelegate>();
  protected partials: string[] = [];

  constructor(config: TypeScriptGeneratorConfig) {
    super(config);
  }

  public innerGenerate = async (  context: AcidicContext,
    node: NodeDefinition,
    options: TOptions,
      params: TemplateDetails
  ): Promise<string> => {

    const template = await this.getTemplate(params);

    return template({ node, options, context });
  };

  public getContext(): AcidicContext {
    return this.context!;
  }

  public getOptions(): TOptions {
    return this.options!;
  }

  public registerHelper = (name: string, helper: TemplateGeneratorHelper): void => {
    this.handlebars.registerHelper(
      name,
      (
        context?: any,
        arg1?: any,
        arg2?: any,
        arg3?: any,
        arg4?: any,
        arg5?: any,
        options?: Handlebars.HelperOptions
      ) => helper(this.getContext, this.getOptions, context, arg1, arg2, arg3, arg4, arg5, options)
    );
  };

  public registerPartial = (partial: TemplateDetails, name?: string) => {
    const partialName = name ? name : partial.name;

    if (!this.partials.includes(partialName)) {
      this.handlebars.registerPartial(partialName, partial.content);

      this.partials.push(partialName);
    }
  };

  public registerPartials = async (partials: Array<TemplateDetails>) =>
    Promise.all(
      partials.map((partial) =>
        Promise.resolve(
          this.handlebars.registerPartial(
            findFileName(partial.name).replace(".hbs", ""),
            partial.content
          )
        )
      )
    );

  protected getTemplate = async (
    template: TemplateDetails
  ): Promise<Handlebars.TemplateDelegate> => {
    let compiled = this.templates.get(template.name);
    if (!compiled) {
      this.context?.logger.info(`Compiling template for ${template.name}`);

      compiled = this.handlebars.compile(template.content, this.config.compiler);
      this.templates.set(template.name, compiled);
    }

    return compiled;
  };
}
