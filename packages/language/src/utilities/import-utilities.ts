import { type AcidicImport, type AcidicSchema, isAcidicSchema } from "@acidic/language";
import { type LangiumDocuments, getDocument } from "langium";
import { type URI, Utils } from "vscode-uri";

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
  schema: AcidicSchema
): AcidicSchema[] {
  return resolveTransitiveImportsInternal(documents, schema);
}

function resolveTransitiveImportsInternal(
  documents: LangiumDocuments,
  schema: AcidicSchema,
  initialSchema = schema,
  visited: Set<URI> = new Set(),
  schemas: Set<AcidicSchema> = new Set()
): AcidicSchema[] {
  const doc = getDocument(schema);
  if (initialSchema !== schema) {
    schemas.add(schema);
  }
  if (!visited.has(doc.uri)) {
    visited.add(doc.uri);
    for (const imp of schema.imports) {
      const importedModel = resolveImport(documents, imp);
      if (importedModel) {
        resolveTransitiveImportsInternal(documents, importedModel, initialSchema, visited, schemas);
      }
    }
  }
  return Array.from(schemas);
}

export function resolveImport(
  documents: LangiumDocuments,
  imp: AcidicImport
): AcidicSchema | undefined {
  const resolvedUri = resolveImportUri(imp);
  try {
    if (resolvedUri) {
      const resolvedDocument = documents.getOrCreateDocument(resolvedUri);
      const node = resolvedDocument.parseResult.value;
      if (isAcidicSchema(node)) {
        return node;
      }
    }
  } catch {
    // NOOP
  }
  return undefined;
}

export function getAllDeclarationsFromImports(documents: LangiumDocuments, schema: AcidicSchema) {
  const imports = resolveTransitiveImports(documents, schema);
  return schema.declarations.concat(...imports.map((imp) => imp.declarations));
}
