import type { AcidicOperation, AcidicSubscription } from "../../ast";
import type { AstValidator } from "../../types";
import { validateAttributeApplication, validateDuplicatedDeclarations } from "../../utilities";
import type { ValidationAcceptor } from "langium";

/**
 * Validates data Type declarations.
 */
export default class AcidicSubscriptionValidator implements AstValidator<AcidicSubscription> {
  validate(dm: AcidicSubscription, accept: ValidationAcceptor): void {
    // this.validateBaseAbstractType(dm, accept);
    validateDuplicatedDeclarations(dm.$resolvedFields, accept);
    this.validateAttributes(dm, accept);
    this.validateFields(dm, accept);
  }

  private validateFields(dm: AcidicSubscription, accept: ValidationAcceptor) {
    dm.fields.forEach((field) => this.validateField(field, accept));
  }

  private validateField(field: AcidicOperation, accept: ValidationAcceptor): void {
    field.attributes.forEach((attr) => validateAttributeApplication(attr, accept));
  }

  private validateAttributes(dm: AcidicSubscription, accept: ValidationAcceptor) {
    dm.attributes.forEach((attr) => {
      validateAttributeApplication(attr, accept);
    });
  }
}

export interface MissingOppositeRelationData {
  relationAcidicSubscriptionName: string;
  relationFieldName: string;
  // it might be the abstract type in the imported document
  relationFieldDocUri: string;

  // the name of AcidicSubscription that the relation field belongs to.
  // the document is the same with the error node.
  operationGroupName: string;
}
