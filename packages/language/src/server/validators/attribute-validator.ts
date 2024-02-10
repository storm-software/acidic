import type { Attribute } from "../../__generated__/ast";
import type { AstValidator } from "../../types";
import type { ValidationAcceptor } from "langium";

/**
 * Validates attribute declarations.
 */
export default class AttributeValidator implements AstValidator<Attribute> {
  validate(_attr: Attribute, _accept: ValidationAcceptor): void {}
}
