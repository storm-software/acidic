import { AcidicImport, Model, isModel } from "@acidic/language";
import { LangiumDocuments, getDocument } from "langium";
import { URI, Utils } from "vscode-uri";

export function resolveImportUri(imp: AcidicImport): URI | undefined {
  if (imp.path === undefined || imp.path.length === 0) {
    return undefined;
  }
  const dirUri = Utils.dirname(getDocument(imp).uri);
  let grammarPath = imp.path;
  if (!grammarPath.endsWith(".acid")) {
    grammarPath += ".acid";
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
  imp: AcidicImport
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
