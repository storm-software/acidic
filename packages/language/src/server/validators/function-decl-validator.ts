import type { FunctionDecl } from "../../ast";
import type { AstValidator } from "../../types";
import { validateAttributeApplication } from "../../utilities";
import type { ValidationAcceptor } from "langium";

/**
 * Validates function declarations.
 */
export default class FunctionDeclValidator implements AstValidator<FunctionDecl> {
  validate(funcDecl: FunctionDecl, accept: ValidationAcceptor) {
    funcDecl.attributes.forEach((attr) => {
      validateAttributeApplication(attr, accept);
    });
  }
}
