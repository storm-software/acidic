import type { AcidicFieldAttribute, AcidicObject, AcidicObjectAttribute } from "../ast";

function isValidationAttribute(attr: AcidicObjectAttribute | AcidicFieldAttribute) {
  return attr.decl.ref?.attributes.some((attr) => attr.decl.$refText === "@@@validation");
}

/**
 * Returns if the given model contains any data validation rules (both at the model
 * level and at the field level).
 */
export function hasValidationAttributes(acidicObject: AcidicObject) {
  if (acidicObject.attributes.some((attr) => isValidationAttribute(attr))) {
    return true;
  }

  if (
    acidicObject.fields.some((field) =>
      field.attributes.some((attr) => isValidationAttribute(attr))
    )
  ) {
    return true;
  }

  return false;
}
