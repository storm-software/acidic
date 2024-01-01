import { isAcidicImport } from "@acidic/language/ast";
import {
  DefaultDefinitionProvider,
  LangiumDocuments,
  LangiumServices,
  LeafCstNode,
  MaybePromise
} from "langium";
import { DefinitionParams, LocationLink, Range } from "vscode-languageserver";
import { resolveImport } from "./utilities";

export class AcidicDefinitionProvider extends DefaultDefinitionProvider {
  protected documents: LangiumDocuments;

  constructor(services: LangiumServices) {
    super(services);
    this.documents = services.shared.workspace.LangiumDocuments;
  }
  protected override collectLocationLinks(
    sourceCstNode: LeafCstNode,
    _params: DefinitionParams
  ): MaybePromise<LocationLink[] | undefined> {
    if (isAcidicImport(sourceCstNode.element)) {
      const importedModel = resolveImport(
        this.documents,
        sourceCstNode.element
      );
      if (importedModel?.$document) {
        const targetObject = importedModel;
        const selectionRange =
          this.nameProvider.getNameNode(targetObject)?.range ??
          Range.create(0, 0, 0, 0);
        const previewRange =
          targetObject.$cstNode?.range ?? Range.create(0, 0, 0, 0);
        return [
          LocationLink.create(
            importedModel.$document.uri.toString(),
            previewRange,
            selectionRange,
            sourceCstNode.range
          )
        ];
      }
      return undefined;
    }
    return super.collectLocationLinks(sourceCstNode, _params);
  }
}
