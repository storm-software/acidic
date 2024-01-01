import { AcidicOperation, AcidicQuery } from "@acidic/language/ast";
import { AstValidator } from "@acidic/language/types";
import {
  validateAttributeApplication,
  validateDuplicatedDeclarations
} from "@acidic/language/utils";
import { ValidationAcceptor } from "langium";

/**
 * Validates data Type declarations.
 */
export default class AcidicQueryValidator implements AstValidator<AcidicQuery> {
  validate(dm: AcidicQuery, accept: ValidationAcceptor): void {
    // this.validateBaseAbstractType(dm, accept);
    validateDuplicatedDeclarations(dm.$resolvedFields, accept);
    this.validateAttributes(dm, accept);
    this.validateFields(dm, accept);
  }

  private validateFields(dm: AcidicQuery, accept: ValidationAcceptor) {
    dm.fields.forEach(field => this.validateField(field, accept));
  }

  private validateField(
    field: AcidicOperation,
    accept: ValidationAcceptor
  ): void {
    field.attributes.forEach(attr =>
      validateAttributeApplication(attr, accept)
    );
  }

  private validateAttributes(dm: AcidicQuery, accept: ValidationAcceptor) {
    dm.attributes.forEach(attr => {
      validateAttributeApplication(attr, accept);
    });
  }
}

export interface MissingOppositeRelationData {
  relationAcidicQueryName: string;
  relationFieldName: string;
  // it might be the abstract type in the imported document
  relationFieldDocUri: string;

  // the name of AcidicQuery that the relation field belongs to.
  // the document is the same with the error node.
  operationGroupName: string;
}
