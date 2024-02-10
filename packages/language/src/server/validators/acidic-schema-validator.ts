import { type AcidicSchema, isAcidicDataSource } from "../../ast";
import { PLUGIN_MODULE_NAME, STD_LIB_MODULE_NAME } from "../../constants";
import type { AstValidator } from "../../types";
import { validateDuplicatedDeclarations } from "../../utilities";
import type { LangiumDocuments, ValidationAcceptor } from "langium";
import {
  getAllDeclarationsFromImports,
  resolveImport,
  resolveTransitiveImports
} from "../../utilities/import-utilities";

/**
 * Validates toplevel schema.
 */
export default class AcidicSchemaValidator implements AstValidator<AcidicSchema> {
  constructor(protected readonly documents: LangiumDocuments) {}
  validate(schema: AcidicSchema, accept: ValidationAcceptor): void {
    this.validateImports(schema, accept);
    validateDuplicatedDeclarations(schema.declarations, accept);

    const importedSchemas = resolveTransitiveImports(this.documents, schema);

    const importedNames = new Set(
      importedSchemas.flatMap((m) => m.declarations.map((d) => d.name))
    );

    for (const declaration of schema.declarations) {
      if (importedNames.has(declaration.name)) {
        accept("error", `A ${declaration.name} already exists in an imported module`, {
          node: declaration,
          property: "name"
        });
      }
    }

    if (
      !schema.$document?.uri.path.endsWith(STD_LIB_MODULE_NAME) &&
      !schema.$document?.uri.path.endsWith(PLUGIN_MODULE_NAME)
    ) {
      this.validateDataSources(schema, accept);
    }
  }

  private validateDataSources(schema: AcidicSchema, accept: ValidationAcceptor) {
    const dataSources = getAllDeclarationsFromImports(this.documents, schema).filter((d) =>
      isAcidicDataSource(d)
    );
    if (dataSources.length > 1 && dataSources[1]) {
      accept("error", "Multiple datasource declarations are not allowed", {
        node: dataSources[1]
      });
    }
  }

  private validateImports(schema: AcidicSchema, accept: ValidationAcceptor) {
    schema.imports.forEach((imp) => {
      const importedSchema = resolveImport(this.documents, imp);
      if (!importedSchema) {
        accept("error", `Cannot find model file ${imp.path}.storm`, {
          node: imp
        });
      }
    });
  }
}
