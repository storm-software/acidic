import {
  type AcidicSchema,
  isAbstractDeclaration,
  isAcidicFieldAttribute,
  isAcidicObjectField,
  isAcidicOperation,
  isAcidicSchema,
  isAttributeArg
} from "../language";
import { AbstractFormatter, type AstNode, Formatting, type LangiumDocument } from "langium";
import type { FormattingOptions, Range, TextEdit } from "vscode-languageserver";

export class AcidicFormatter extends AbstractFormatter {
  private formatOptions?: FormattingOptions;
  protected format(node: AstNode): void {
    const formatter = this.getNodeFormatter(node);
    if (isAcidicObjectField(node)) {
      formatter.property("type").prepend(Formatting.oneSpace());
      if (node.attributes.length > 0) {
        formatter.properties("attributes").prepend(Formatting.oneSpace());
      }
    } else if (isAcidicFieldAttribute(node)) {
      formatter.keyword("(").surround(Formatting.noSpace());
      formatter.keyword(")").prepend(Formatting.noSpace());
      formatter.keyword(",").append(Formatting.oneSpace());
      if (node.args.length > 1) {
        formatter.nodes(...node.args.slice(1)).prepend(Formatting.oneSpace());
      }
    } else if (isAttributeArg(node)) {
      formatter.keyword(":").prepend(Formatting.noSpace());
      formatter.keyword(":").append(Formatting.oneSpace());
    } else if (isAbstractDeclaration(node)) {
      const bracesOpen = formatter.keyword("{");
      const bracesClose = formatter.keyword("}");
      // allow extra blank lines between declarations
      formatter.interior(bracesOpen, bracesClose).prepend(Formatting.indent({ allowMore: true }));
      bracesOpen.prepend(Formatting.oneSpace());
      bracesClose.prepend(Formatting.newLine());
    } else if (isAcidicSchema(node)) {
      const model = node as AcidicSchema;
      const nodes = formatter.nodes(...model.declarations);
      nodes.prepend(Formatting.noIndent());
    } else if (isAcidicOperation(node)) {
      formatter.property("name").prepend(Formatting.oneSpace());
      formatter.property("resultType").prepend(Formatting.oneSpace());
      if (node.attributes.length > 0) {
        formatter.properties("attributes").prepend(Formatting.oneSpace());
      }
    }
  }

  protected override doDocumentFormat(
    document: LangiumDocument<AstNode>,
    options: FormattingOptions,
    range?: Range | undefined
  ): TextEdit[] {
    this.formatOptions = options;
    return super.doDocumentFormat(document, options, range);
  }

  public getFormatOptions(): FormattingOptions | undefined {
    return this.formatOptions;
  }

  public getIndent() {
    return 1;
  }
}
