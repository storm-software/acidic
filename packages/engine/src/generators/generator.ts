import type { AcidicPluginOptions, NodeDefinition } from "@acidic/definition";
import { EMPTY_STRING, isString } from "@storm-stack/utilities";
import type { AcidicContext, IGenerator } from "../types";

/**
 * Acidic base Code Generator
 */
export abstract class Generator<TOptions extends AcidicPluginOptions = AcidicPluginOptions>
  implements IGenerator
{
  protected context?: AcidicContext;
  protected options?: TOptions;

  public abstract get name(): string;

  public abstract get fileExtension(): string | "*";

  public abstract get commentStart(): string;

  public generate(
    context: AcidicContext,
    node: NodeDefinition,
    options: TOptions,
    params: any
  ): Promise<string> {
    this.context = context;
    this.options = options;

    return this.innerGenerate(context, node, options, params);
  }

  public abstract save(options: TOptions): Promise<void>;

  public write(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension?: string
  ): Promise<void> {
    return this.innerWrite(
      options,
      `
${this.getFileHeader(options)}

${fileContent}

${this.getFileFooter(options)}
  `,
      fileName,
      fileExtension ? fileExtension : this.fileExtension
    );
  }

  protected abstract innerGenerate(
    context: AcidicContext,
    node: NodeDefinition,
    options: TOptions,
    params: any
  ): Promise<string>;

  protected abstract innerWrite(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension: string
  ): Promise<void>;

  protected getFileHeader(options: TOptions): string {
    return options.header === false
      ? EMPTY_STRING
      : isString(options.header)
        ? options.header
        : this.getFileHeaderTemplate(
            options.headerName ? options.headerName : this.name,
            this.commentStart
          );
  }

  protected getFileFooter(options: TOptions): string {
    return options.footer === false
      ? EMPTY_STRING
      : isString(options.footer)
        ? options.footer
        : this.getFileFooterTemplate(this.commentStart);
  }

  protected getFileHeaderTemplate(name: string, commentStart = "//") {
    let padding = "";
    while (name.length + padding.length < 12) {
      padding += " ";
    }

    return `

${commentStart} -------------------------------------------------------------------
${commentStart}
${commentStart}                         ${padding}Storm Software
${commentStart}                 🧪 Acidic - ${name}
${commentStart}
${commentStart}             ** DO NOT MODIFY THIS FILE MANUALLY **
${commentStart} This file is automatically generated by the 🧪 Acidic Engine
${commentStart} CLI and should not be manually updated. Any manual updates made to
${commentStart} this file will be overwritten the next time the CLI is
${commentStart} ran.
${commentStart}
${commentStart} Acidic is released as a part of StormStack. StormStack is
${commentStart} maintained by Storm Software under the Apache License 2.0, and is
${commentStart} free for commercial and private use. For more information, please visit
${commentStart} our licensing page.
${commentStart}
${commentStart}    Website: https://acidic.io
${commentStart}    Repository: https://github.com/storm-software/acidic
${commentStart}    Documentation: https://acidic.io/docs
${commentStart}    Contact: https://acidic.io/contact
${commentStart}    Licensing: https://acidic.io/licensing
${commentStart}
${commentStart} -------------------------------------------------------------------


`;
  }

  protected getFileFooterTemplate = (_commentStart = "//") => "";
}
