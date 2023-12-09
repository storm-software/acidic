import { ValidationAcceptor } from "langium";
import { AcidicMutation, AcidicOperation } from "../ast";
import { AstValidator } from "../types";
import {
  validateAttributeApplication,
  validateDuplicatedDeclarations
} from "../utils";

/**
 * Validates data Type declarations.
 */
export default class AcidicMutationValidator
  implements AstValidator<AcidicMutation>
{
  validate(dm: AcidicMutation, accept: ValidationAcceptor): void {
    // this.validateBaseAbstractType(dm, accept);
    validateDuplicatedDeclarations(dm.$resolvedFields, accept);
    this.validateAttributes(dm, accept);
    this.validateFields(dm, accept);
  }

  private validateFields(dm: AcidicMutation, accept: ValidationAcceptor) {
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

  private validateAttributes(dm: AcidicMutation, accept: ValidationAcceptor) {
    dm.attributes.forEach(attr => {
      validateAttributeApplication(attr, accept);
    });
  }
}

export interface MissingOppositeRelationData {
  relationAcidicMutationName: string;
  relationFieldName: string;
  // it might be the abstract type in the imported document
  relationFieldDocUri: string;

  // the name of AcidicMutation that the relation field belongs to.
  // the document is the same with the error node.
  operationGroupName: string;
}
