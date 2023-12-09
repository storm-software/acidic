import { AstNode, LangiumDocuments, Mutable, getDocument } from "langium";
import { URI, Utils } from "vscode-uri";
import {
  AcidicEvent,
  AcidicModel,
  AcidicMutation,
  AcidicObject,
  AcidicObjectAttribute,
  AcidicObjectField,
  AcidicQuery,
  AcidicSubscription,
  Expression,
  Model,
  ModelImport,
  ReferenceExpr,
  isAcidicEvent,
  isAcidicModel,
  isAcidicMutation,
  isAcidicObject,
  isAcidicObjectField,
  isAcidicQuery,
  isAcidicSubscription,
  isArrayExpr,
  isInvocationExpr,
  isMemberAccessExpr,
  isModel,
  isReferenceExpr
} from "../ast";
import { isFromStdlib } from "./server-utils";

export function extractAcidicModelsWithAllowRules(model: Model): AcidicModel[] {
  return model.declarations.filter(
    d =>
      isAcidicModel(d) &&
      d.attributes.some(attr => attr.decl.ref?.name === "@@allow")
  ) as AcidicModel[];
}

export function mergeBaseModel(model: Model) {
  model.declarations
    .filter(x => x.$type === "AcidicObject" || x.$type === "AcidicModel")
    .forEach(decl => {
      const dataModel = decl as AcidicObject | AcidicModel;

      dataModel.fields = dataModel.superTypes
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .flatMap(superType => updateContainer(superType.ref!.fields, dataModel))
        .concat(dataModel.fields) as AcidicObjectField[];

      dataModel.attributes = dataModel.superTypes
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .flatMap(superType =>
          updateContainer(superType.ref!.attributes, dataModel)
        )
        .concat(dataModel.attributes) as AcidicObjectAttribute[];
    });

  // remove abstract models
  model.declarations = model.declarations.filter(
    x => !(x.$type == "AcidicModel" && x.isAbstract)
  );
}

function updateContainer<T extends AstNode>(
  nodes: T[],
  container: AstNode
): Mutable<T>[] {
  return nodes.map(node => {
    const cloneField = Object.assign({}, node);
    const mutable = cloneField as Mutable<T>;
    // update container
    mutable.$container = container;
    return mutable;
  });
}

export function getIdFields(dataModel: AcidicModel | AcidicObject) {
  const fieldLevelId = dataModel.$resolvedFields.find(f =>
    f.attributes.some(attr => attr.decl.$refText === "@id")
  );
  if (fieldLevelId) {
    return [fieldLevelId];
  } else {
    // get model level @@id attribute
    const modelIdAttr = dataModel.attributes.find(
      attr => attr.decl?.ref?.name === "@@id"
    );
    if (
      modelIdAttr &&
      Array.isArray(modelIdAttr.args) &&
      modelIdAttr.args.length > 0
    ) {
      // get fields referenced in the attribute: @@id([field1, field2]])
      if (!isArrayExpr(modelIdAttr.args[0]?.value)) {
        return [];
      }
      const argValue = modelIdAttr.args[0]?.value;
      return argValue?.items
        .filter(
          (expr): expr is ReferenceExpr =>
            isReferenceExpr(expr) && !!getAcidicObjectFieldReference(expr)
        )
        .map(expr => expr.target.ref as AcidicObjectField);
    }
  }
  return [];
}

export function isAuthInvocation(node: AstNode) {
  return (
    isInvocationExpr(node) &&
    node.function.ref?.name === "auth" &&
    isFromStdlib(node.function.ref)
  );
}

export function getAcidicObjectReference(
  expr: Expression
): AcidicObject | undefined {
  if (isReferenceExpr(expr) && isAcidicObject(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicObject(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicModelReference(
  expr: Expression
): AcidicModel | undefined {
  if (isReferenceExpr(expr) && isAcidicModel(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicModel(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicObjectFieldReference(
  expr: Expression
): AcidicObjectField | undefined {
  if (isReferenceExpr(expr) && isAcidicObjectField(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicObjectField(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicQueryReference(
  expr: Expression
): AcidicQuery | undefined {
  if (isReferenceExpr(expr) && isAcidicQuery(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicQuery(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicMutationReference(
  expr: Expression
): AcidicMutation | undefined {
  if (isReferenceExpr(expr) && isAcidicMutation(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicMutation(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicSubscriptionReference(
  expr: Expression
): AcidicSubscription | undefined {
  if (isReferenceExpr(expr) && isAcidicSubscription(expr.target.ref)) {
    return expr.target.ref;
  } else if (
    isMemberAccessExpr(expr) &&
    isAcidicSubscription(expr.member.ref)
  ) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicEventReference(
  expr: Expression
): AcidicEvent | undefined {
  if (isReferenceExpr(expr) && isAcidicEvent(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicEvent(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function resolveImportUri(imp: ModelImport): URI | undefined {
  if (imp.path === undefined || imp.path.length === 0) {
    return undefined;
  }
  const dirUri = Utils.dirname(getDocument(imp).uri);
  let grammarPath = imp.path;
  if (!grammarPath.endsWith(".storm")) {
    grammarPath += ".storm";
  }
  return Utils.resolvePath(dirUri, grammarPath);
}

export function resolveTransitiveImports(
  documents: LangiumDocuments,
  model: Model
): Model[] {
  return resolveTransitiveImportsInternal(documents, model);
}

function resolveTransitiveImportsInternal(
  documents: LangiumDocuments,
  model: Model,
  initialModel = model,
  visited: Set<URI> = new Set(),
  models: Set<Model> = new Set()
): Model[] {
  const doc = getDocument(model);
  if (initialModel !== model) {
    models.add(model);
  }
  if (!visited.has(doc.uri)) {
    visited.add(doc.uri);
    for (const imp of model.imports) {
      const importedModel = resolveImport(documents, imp);
      if (importedModel) {
        resolveTransitiveImportsInternal(
          documents,
          importedModel,
          initialModel,
          visited,
          models
        );
      }
    }
  }
  return Array.from(models);
}

export function resolveImport(
  documents: LangiumDocuments,
  imp: ModelImport
): Model | undefined {
  const resolvedUri = resolveImportUri(imp);
  try {
    if (resolvedUri) {
      const resolvedDocument = documents.getOrCreateDocument(resolvedUri);
      const node = resolvedDocument.parseResult.value;
      if (isModel(node)) {
        return node;
      }
    }
  } catch {
    // NOOP
  }
  return undefined;
}

export function getAllDeclarationsFromImports(
  documents: LangiumDocuments,
  model: Model
) {
  const imports = resolveTransitiveImports(documents, model);
  return model.declarations.concat(...imports.map(imp => imp.declarations));
}
