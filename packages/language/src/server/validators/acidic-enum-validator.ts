import type { AcidicEnum, AcidicEnumField } from "../../ast";
import type { AstValidator } from "../../types";
import { validateAttributeApplication, validateDuplicatedDeclarations } from "../../utilities";
import type { ValidationAcceptor } from "langium";

/**
 * Validates enum declarations.
 */
export default class AcidicEnumValidator implements AstValidator<AcidicEnum> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(_enum: AcidicEnum, accept: ValidationAcceptor) {
    validateDuplicatedDeclarations(_enum.fields, accept);
    this.validateAttributes(_enum, accept);
    for (const field of _enum.fields) {
      this.validateField(field, accept);
    }
  }

  private validateAttributes(_enum: AcidicEnum, accept: ValidationAcceptor) {
    for (const attr of _enum.attributes) {
      validateAttributeApplication(attr, accept);
    }
  }

  private validateField(field: AcidicEnumField, accept: ValidationAcceptor) {
    for (const attr of field.attributes) {
      validateAttributeApplication(attr, accept);
    }
  }
}
