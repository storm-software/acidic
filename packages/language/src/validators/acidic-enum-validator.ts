import { ValidationAcceptor } from "langium";
import { AcidicEnum, AcidicEnumField } from "../ast";
import { AstValidator } from "../types";
import {
  validateAttributeApplication,
  validateDuplicatedDeclarations
} from "../utils";

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
