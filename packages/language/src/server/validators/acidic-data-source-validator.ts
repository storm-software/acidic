import { type AcidicDataSource, isInvocationExpr } from "../../ast";
import { SUPPORTED_PROVIDERS } from "../../constants";
import type { AstValidator } from "../../types";
import { getStringLiteral, validateDuplicatedDeclarations } from "../../utilities";
import type { ValidationAcceptor } from "langium";

/**
 * Validates data source declarations.
 */
export default class AcidicDataSourceValidator implements AstValidator<AcidicDataSource> {
  public validate(ds: AcidicDataSource, accept: ValidationAcceptor): void {
    validateDuplicatedDeclarations(ds.fields, accept);
    this.validateProvider(ds, accept);
    this.validateUrl(ds, accept);
    this.validateRelationMode(ds, accept);
  }

  private validateProvider(ds: AcidicDataSource, accept: ValidationAcceptor) {
    const provider = ds.fields.find((f) => f.name === "provider");
    if (!provider) {
      accept("error", 'datasource must include a "provider" field', {
        node: ds
      });
      return;
    }

    const value = getStringLiteral(provider.value);
    if (!value) {
      accept("error", '"provider" must be set to a string literal', {
        node: provider.value
      });
    } else if (!SUPPORTED_PROVIDERS.includes(value)) {
      accept(
        "error",
        `Provider "${value}" is not supported. Choose from ${SUPPORTED_PROVIDERS.map(
          (p) => '"' + p + '"'
        ).join(" | ")}.`,
        { node: provider.value }
      );
    }
  }

  private validateUrl(ds: AcidicDataSource, accept: ValidationAcceptor) {
    const url = ds.fields.find((f) => f.name === "url");
    if (!url) {
      accept("error", 'datasource must include a "url" field', {
        node: ds
      });
    }

    for (const fieldName of ["url", "shadowDatabaseUrl"]) {
      const field = ds.fields.find((f) => f.name === fieldName);
      if (!field) {
        continue;
      }
      const value = getStringLiteral(field.value);
      if (!value && !(isInvocationExpr(field.value) && field.value.function.ref?.name === "env")) {
        accept(
          "error",
          `"${fieldName}" must be set to a string literal or an invocation of "env" function`,
          {
            node: field.value
          }
        );
      }
    }
  }

  private validateRelationMode(ds: AcidicDataSource, accept: ValidationAcceptor) {
    const field = ds.fields.find((f) => f.name === "relationMode");
    if (field) {
      const val = getStringLiteral(field.value);
      if (!val || !["foreignKeys", "prisma"].includes(val)) {
        accept("error", '"relationMode" must be set to "foreignKeys" or "prisma"', {
          node: field.value
        });
      }
    }
  }
}
