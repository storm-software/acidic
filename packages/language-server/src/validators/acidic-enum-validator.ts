import { AcidicEnum, AcidicEnumField } from "@acidic/language/ast";
import { AstValidator } from "@acidic/language/types";
import {
  validateAttributeApplication,
  validateDuplicatedDeclarations
} from "@acidic/language/utils";
import { ValidationAcceptor } from "langium";

/**
 * Validates enum declarations.
 */
export default class AcidicEnumValidator implements AstValidator<AcidicEnum> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(_enum: AcidicEnum, accept: ValidationAcceptor) {
    validateDuplicatedDeclarations(_enum.fields, accept);
    this.validateAttributes(_enum, accept);
    _enum.fields.forEach(field => {
      this.validateField(field, accept);
    });
  }

  private validateAttributes(_enum: AcidicEnum, accept: ValidationAcceptor) {
    _enum.attributes.forEach(attr => {
      validateAttributeApplication(attr, accept);
    });
  }

  private validateField(field: AcidicEnumField, accept: ValidationAcceptor) {
    field.attributes.forEach(attr => {
      validateAttributeApplication(attr, accept);
    });
  }
}
