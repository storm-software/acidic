import { FunctionDecl } from "@acidic/language/ast";
import { AstValidator } from "@acidic/language/types";
import { validateAttributeApplication } from "@acidic/language/utils";
import { ValidationAcceptor } from "langium";

/**
 * Validates function declarations.
 */
export default class FunctionDeclValidator
  implements AstValidator<FunctionDecl>
{
  validate(funcDecl: FunctionDecl, accept: ValidationAcceptor) {
    funcDecl.attributes.forEach(attr => {
      validateAttributeApplication(attr, accept);
    });
  }
}
