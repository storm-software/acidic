import {
  AcidicModel,
  AcidicObjectField,
  AcidicSchema,
  IssueCodes,
  isAcidicModel
} from "@acidic/language";
import {
  AstReflection,
  CodeActionProvider,
  IndexManager,
  LangiumDocument,
  LangiumDocuments,
  LangiumServices,
  MaybePromise,
  getDocument
} from "langium";
import {
  CodeAction,
  CodeActionKind,
  CodeActionParams,
  Command,
  Diagnostic
} from "vscode-languageserver";
import { AcidicFormatter } from "./acidic-formatter";
import { MissingOppositeRelationData } from "./validators/acidic-model-validator";

export class AcidicCodeActionProvider implements CodeActionProvider {
  protected readonly reflection: AstReflection;
  protected readonly indexManager: IndexManager;
  protected readonly formatter: AcidicFormatter;
  protected readonly documents: LangiumDocuments;

  constructor(services: LangiumServices) {
    this.reflection = services.shared.AstReflection;
    this.indexManager = services.shared.workspace.IndexManager;
    this.formatter = services.lsp.Formatter as AcidicFormatter;
    this.documents = services.shared.workspace.LangiumDocuments;
  }

  getCodeActions(
    document: LangiumDocument,
    params: CodeActionParams
  ): MaybePromise<Array<Command | CodeAction> | undefined> {
    const result: CodeAction[] = [];
    const acceptor = (ca: CodeAction | undefined) => ca && result.push(ca);
    for (const diagnostic of params.context.diagnostics) {
      this.createCodeActions(diagnostic, document, acceptor);
    }
    return result;
  }

  private createCodeActions(
    diagnostic: Diagnostic,
    document: LangiumDocument,
    accept: (ca: CodeAction | undefined) => void
  ) {
    switch (diagnostic.code) {
      case IssueCodes.MissingOppositeRelation:
        accept(this.fixMissingOppositeRelation(diagnostic, document));
    }

    return undefined;
  }

  private fixMissingOppositeRelation(
    diagnostic: Diagnostic,
    document: LangiumDocument
  ): CodeAction | undefined {
    const data = diagnostic.data as MissingOppositeRelationData;

    const rootCst =
      data.relationFieldDocUri == document.textDocument.uri
        ? document.parseResult.value
        : this.documents.all.find(
            doc => doc.textDocument.uri === data.relationFieldDocUri
          )?.parseResult.value;

    if (rootCst) {
      const schema = rootCst as AcidicSchema;
      const astNode = (
        schema.declarations.find(
          x => isAcidicModel(x) && x.name === data.relationAcidicModelName
        ) as AcidicModel
      )?.fields.find(
        x => x.name === data.relationFieldName
      ) as AcidicObjectField;

      if (!astNode) {
        return undefined;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const oppositeModel = astNode.type.reference!.ref! as AcidicModel;
      const lastField = oppositeModel.fields[oppositeModel.fields.length - 1];
      const currentSchema = document.parseResult.value as AcidicSchema;

      const container = currentSchema.declarations.find(
        decl => decl.name === data.dataModelName && isAcidicModel(decl)
      ) as AcidicModel;

      if (container && container.$cstNode) {
        // indent
        let indent = "\t";
        const formatOptions = this.formatter.getFormatOptions();
        if (formatOptions?.insertSpaces) {
          indent = " ".repeat(formatOptions.tabSize);
        }
        indent = indent.repeat(this.formatter.getIndent());

        let newText = "";
        if (astNode.type.array) {
          //post Post[]
          const idField = container.$resolvedFields.find(f =>
            f.attributes.find(attr => attr.decl.ref?.name === "@id")
          ) as AcidicObjectField;

          // if no id field, we can't generate reference
          if (!idField) {
            return undefined;
          }

          const typeName = container.name;
          const fieldName = this.lowerCaseFirstLetter(typeName);

          // might already exist
          let referenceField = "";

          const idFieldName = idField.name;
          const referenceIdFieldName =
            fieldName + this.upperCaseFirstLetter(idFieldName);

          if (
            !oppositeModel.$resolvedFields.find(
              f => f.name === referenceIdFieldName
            )
          ) {
            referenceField =
              "\n" + indent + `${referenceIdFieldName} ${idField.type.type}`;
          }

          newText =
            "\n" +
            indent +
            `${fieldName} ${typeName} @relation(fields: [${referenceIdFieldName}], references: [${idFieldName}])` +
            referenceField;
        } else {
          // user User @relation(fields: [userAbc], references: [id])
          const typeName = container.name;
          const fieldName = this.lowerCaseFirstLetter(typeName);
          newText = "\n" + indent + `${fieldName} ${typeName}[]`;
        }

        // the opposite model might be in the imported file
        const targetDocument = getDocument(oppositeModel);

        return {
          title: `Add opposite relation fields on ${oppositeModel.name}`,
          kind: CodeActionKind.QuickFix,
          diagnostics: [diagnostic],
          isPreferred: false,
          edit: {
            changes: {
              [targetDocument.textDocument.uri]: [
                {
                  range: {
                    start: lastField?.$cstNode!.range.end!,
                    end: lastField?.$cstNode!.range.end!
                  },
                  newText
                }
              ]
            }
          }
        };
      }
    }

    return undefined;
  }

  private lowerCaseFirstLetter(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private upperCaseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
