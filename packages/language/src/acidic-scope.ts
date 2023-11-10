import {
  AstNode,
  AstNodeDescription,
  DefaultScopeComputation,
  DefaultScopeProvider,
  EMPTY_SCOPE,
  LangiumDocument,
  LangiumServices,
  Mutable,
  PrecomputedScopes,
  ReferenceInfo,
  Scope,
  StreamScope,
  equalURI,
  getContainerOfType,
  interruptAndCheck,
  stream,
  streamAllContents
} from "langium";
import { CancellationToken } from "vscode-jsonrpc";
import {
  DataModel,
  Input,
  Model,
  OperationGroup,
  isEnumField,
  isModel
} from "./__generated__/ast";
import { PLUGIN_MODULE_NAME, STD_LIB_MODULE_NAME } from "./constants";
import { resolveImportUri } from "./utils/ast-utils";

/**
 * Custom Langium ScopeComputation implementation which adds enum fields into global scope
 */
export class AcidicScopeComputation extends DefaultScopeComputation {
  constructor(private readonly services: LangiumServices) {
    super(services);
  }

  async computeExports(
    document: LangiumDocument<AstNode>,
    cancelToken?: CancellationToken | undefined
  ): Promise<AstNodeDescription[]> {
    const result = await super.computeExports(document, cancelToken);

    // add enum fields so they can be globally resolved across modules
    for (const node of streamAllContents(document.parseResult.value)) {
      if (cancelToken) {
        await interruptAndCheck(cancelToken);
      }
      if (isEnumField(node)) {
        const desc =
          this.services.workspace.AstNodeDescriptionProvider.createDescription(
            node,
            node.name,
            document
          );
        result.push(desc);
      }
    }

    return result;
  }

  override computeLocalScopes(
    document: LangiumDocument<AstNode>,
    cancelToken?: CancellationToken | undefined
  ): Promise<PrecomputedScopes> {
    const result = super.computeLocalScopes(document, cancelToken);

    //the $resolvedFields would be used in Linking stage for all the documents
    //so we need to set it at the end of the scope computation
    this.resolveBaseModels(document);
    return result;
  }

  private resolveBaseModels(document: LangiumDocument) {
    const model = document.parseResult.value as Model;

    model.declarations.forEach(decl => {
      if (
        decl.$type === "DataModel" ||
        decl.$type === "ApiModel" ||
        decl.$type === "Input" ||
        decl.$type === "Interface"
      ) {
        let dataModel: any = decl as DataModel;
        if (!dataModel) {
          dataModel = decl as Input;
        }

        dataModel.$resolvedFields = [...dataModel.fields];
        dataModel.superTypes.forEach(superType => {
          const superTypeDecl = superType.ref;
          if (superTypeDecl) {
            superTypeDecl.fields.forEach(field => {
              const cloneField = Object.assign({}, field);
              cloneField.$isInherited = true;
              const mutable = cloneField as Mutable<AstNode>;
              // update container
              mutable.$container = dataModel;
              dataModel.$resolvedFields.push(cloneField);
            });
          }
        });
      } else if (decl.$type === "OperationGroup") {
        const operationGroup = decl as OperationGroup;
        operationGroup.$resolvedFields = [...operationGroup.fields];
        /*operationGroup.superTypes.forEach(superType => {
          const superTypeDecl = superType.ref;
          if (superTypeDecl) {
            superTypeDecl.params.forEach(param => {
              const cloneField = Object.assign({}, param);
              cloneField.$isInherited = true;
              const mutable = cloneField as Mutable<AstNode>;
              // update container
              mutable.$container = operationGroup;
              operationGroup.$resolvedFields.push(cloneField);
            });
          }
        });*/
      }
    });
  }
}

export class AcidicScopeProvider extends DefaultScopeProvider {
  constructor(services: LangiumServices) {
    super(services);
  }

  protected override getGlobalScope(
    referenceType: string,
    context: ReferenceInfo
  ): Scope {
    const model = getContainerOfType(context.container, isModel);
    if (!model) {
      return EMPTY_SCOPE;
    }

    const importedUris = stream(model.imports)
      .map(resolveImportUri)
      .nonNullable();
    const importedElements = this.indexManager
      .allElements(referenceType)
      .filter(
        des =>
          // allow current document
          equalURI(des.documentUri, model.$document?.uri) ||
          // allow stdlib
          des.documentUri.path.endsWith(STD_LIB_MODULE_NAME) ||
          // allow plugin models
          des.documentUri.path.endsWith(PLUGIN_MODULE_NAME) ||
          // allow imported documents
          importedUris.some(importedUri => (des.documentUri, importedUri))
      );
    return new StreamScope(importedElements);
  }
}
