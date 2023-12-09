import {
  AcidicEnum,
  AcidicEnumField,
  AcidicEvent,
  AcidicFieldAttribute,
  AcidicInternalAttribute,
  AcidicModel,
  AcidicMutation,
  AcidicObject,
  AcidicObjectAttribute,
  AcidicObjectField,
  AcidicOperation,
  AcidicQuery,
  AcidicSubscription,
  AstNode,
  Expression,
  FunctionDecl,
  Model,
  ReferenceExpr,
  ServiceID,
  isAcidicEnum,
  isAcidicEnumField,
  isAcidicEvent,
  isAcidicModel,
  isAcidicMutation,
  isAcidicObject,
  isAcidicQuery,
  isAcidicSubscription,
  isArrayExpr,
  isLiteralExpr,
  isObjectExpr,
  isReferenceExpr,
  isServiceID
} from "@acidic/language/ast";
import { ExpressionContext } from "@acidic/language/constants";
import { getLiteral, getLiteralArray, resolved } from "@acidic/language/utils";
import { PluginOptions } from "../types";

/**
 * Gets data types that are not ignored
 */
export function getServiceId(model: Model): string {
  const serviceIds = model.declarations.filter((d): d is ServiceID =>
    isServiceID(d)
  );
  if (!serviceIds || serviceIds.length === 0 || !serviceIds[0]?.name) {
    return "Service Name";
  }

  return serviceIds[0].name;
}

/**
 * Gets data models that are not ignored
 */
export function getAcidicModels(model: Model): AcidicModel[] {
  return model.declarations.filter(
    (d): d is AcidicModel => isAcidicModel(d) && !hasAttribute(d, "@@ignore")
  );
}

/**
 * Gets data models that are not ignored
 */
export function getAcidicEnums(model: Model): AcidicEnum[] {
  return model.declarations.filter(
    (d): d is AcidicEnum => isAcidicEnum(d) && !hasAttribute(d, "@@ignore")
  );
}

/**
 * Gets data types that are not ignored
 */
export function getAcidicObjects(model: Model): AcidicObject[] {
  return model.declarations.filter(
    (d): d is AcidicObject => isAcidicObject(d) && !hasAttribute(d, "@@ignore")
  );
}

/**
 * Gets data types that are not ignored
 */
export function getAcidicQueries(model: Model): AcidicQuery[] {
  return model.declarations.filter(
    (d): d is AcidicQuery => isAcidicQuery(d) && !hasAttribute(d, "@@ignore")
  );
}

/**
 * Gets data types that are not ignored
 */
export function getAcidicMutations(model: Model): AcidicMutation[] {
  return model.declarations.filter(
    (d): d is AcidicMutation =>
      isAcidicMutation(d) && !hasAttribute(d, "@@ignore")
  );
}

/**
 * Gets data types that are not ignored
 */
export function getAcidicSubscriptions(model: Model): AcidicSubscription[] {
  return model.declarations.filter(
    (d): d is AcidicSubscription =>
      isAcidicSubscription(d) && !hasAttribute(d, "@@ignore")
  );
}

/**
 * Gets data types that are not ignored
 */
export function getAcidicEvents(model: Model): AcidicEvent[] {
  return model.declarations.filter(
    (d): d is AcidicEvent =>
      isAcidicEvent(d) &&
      !hasAttribute(d as unknown as AcidicObject, "@@ignore")
  );
}

export function getObjectLiteral<T>(
  expr: Expression | undefined
): T | undefined {
  if (!expr || !isObjectExpr(expr)) {
    return undefined;
  }
  const result: Record<string, unknown> = {};
  for (const field of expr.fields) {
    let fieldValue: unknown;
    if (isLiteralExpr(field.value)) {
      fieldValue = getLiteral(field.value);
    } else if (isArrayExpr(field.value)) {
      fieldValue = getLiteralArray(field.value);
    } else if (isObjectExpr(field.value)) {
      fieldValue = getObjectLiteral(field.value);
    }
    if (fieldValue === undefined) {
      return undefined;
    } else {
      result[field.name] = fieldValue;
    }
  }
  return result as T;
}

export default function indentString(string: string, count = 4): string {
  const indent = " ";
  return string.replace(/^(?!\s*$)/gm, indent.repeat(count));
}

export function hasAttribute(
  decl:
    | AcidicModel
    | AcidicObject
    | AcidicObjectField
    | AcidicQuery
    | AcidicMutation
    | AcidicSubscription
    | AcidicOperation
    | AcidicEnum
    | AcidicEnumField,
  name: string
) {
  return !!(
    decl.attributes as (AcidicObjectAttribute | AcidicFieldAttribute)[]
  ).find(attr => resolved(attr.decl).name === name);
}

export function getAttributeArgs(
  attr: AcidicObjectAttribute | AcidicFieldAttribute | AcidicInternalAttribute
): Record<string, Expression> {
  const result: Record<string, Expression> = {};
  for (const arg of attr.args) {
    if (!arg.$resolvedParam) {
      continue;
    }
    result[arg.$resolvedParam.name] = arg.value;
  }
  return result;
}

export function getAttributeArg(
  attr: AcidicObjectAttribute | AcidicFieldAttribute | AcidicInternalAttribute,
  name: string
): Expression | undefined {
  for (const arg of attr.args) {
    if (arg.$resolvedParam?.name === name) {
      return arg.value;
    }
  }
  return undefined;
}

export function getAttributeArgLiteral<T extends string | number | boolean>(
  attr: AcidicObjectAttribute | AcidicFieldAttribute,
  name: string
): T | undefined {
  for (const arg of attr.args) {
    if (arg.$resolvedParam?.name === name) {
      return getLiteral<T>(arg.value);
    }
  }
  return undefined;
}

export function isAcidicEnumFieldReference(
  node: AstNode
): node is ReferenceExpr {
  return isReferenceExpr(node) && isAcidicEnumField(node.target.ref);
}

/**
 * Gets `@@id` fields declared at the data model level
 */
export function getModelIdFields(model: AcidicModel) {
  const idAttr = model.attributes.find(attr => attr.decl.ref?.name === "@@id");
  if (!idAttr) {
    return [];
  }
  const fieldsArg = idAttr.args.find(a => a.$resolvedParam?.name === "fields");
  if (!fieldsArg || !isArrayExpr(fieldsArg.value)) {
    return [];
  }

  return fieldsArg.value.items
    .filter((item): item is ReferenceExpr => isReferenceExpr(item))
    .map(item => resolved(item.target) as AcidicObjectField);
}

/**
 * Gets `@@unique` fields declared at the data model level
 */
export function getModelUniqueFields(model: AcidicModel) {
  const uniqueAttr = model.attributes.find(
    attr => attr.decl.ref?.name === "@@unique"
  );
  if (!uniqueAttr) {
    return [];
  }
  const fieldsArg = uniqueAttr.args.find(
    a => a.$resolvedParam?.name === "fields"
  );
  if (!fieldsArg || !isArrayExpr(fieldsArg.value)) {
    return [];
  }

  return fieldsArg.value.items
    .filter((item): item is ReferenceExpr => isReferenceExpr(item))
    .map(item => resolved(item.target) as AcidicObjectField);
}

/**
 * Returns if the given field is declared as an id field.
 */
export function isIdField(field: AcidicObjectField) {
  // field-level @id attribute
  if (hasAttribute(field, "@id")) {
    return true;
  }

  const model = field.$container as AcidicModel;

  // model-level @@id attribute with a list of fields
  const modelLevelIds = getModelIdFields(model);
  if (modelLevelIds.includes(field)) {
    return true;
  }

  if (
    model.fields.some(f => hasAttribute(f, "@id")) ||
    modelLevelIds.length > 0
  ) {
    // the model already has id field, don't check @unique and @@unique
    return false;
  }

  // then, the first field with @unique can be used as id
  const firstUniqueField = model.fields.find(f => hasAttribute(f, "@unique"));
  if (firstUniqueField) {
    return firstUniqueField === field;
  }

  // last, the first model level @@unique can be used as id
  const modelLevelUnique = getModelUniqueFields(model);
  if (modelLevelUnique.includes(field)) {
    return true;
  }

  return false;
}

/**
 * Returns if the given field is a relation field.
 */
export function isRelationshipField(field: AcidicObjectField) {
  return isAcidicModel(field.type.reference?.ref);
}

/**
 * Returns if the given field is a relation foreign key field.
 */
export function isForeignKeyField(field: AcidicObjectField) {
  const model = field.$container as AcidicModel;
  return model.fields.some(f => {
    // find @relation attribute
    const relAttr = f.attributes.find(
      attr => attr.decl.ref?.name === "@relation"
    );
    if (relAttr) {
      // find "fields" arg
      const fieldsArg = relAttr.args.find(
        a => a.$resolvedParam?.name === "fields"
      );

      if (fieldsArg && isArrayExpr(fieldsArg.value)) {
        // find a matching field reference
        return fieldsArg.value.items.some((item): item is ReferenceExpr => {
          if (isReferenceExpr(item)) {
            return item.target.ref === field;
          } else {
            return false;
          }
        });
      }
    }
    return false;
  });
}

export function requireOption<T>(options: PluginOptions, name: string): T {
  const value = options[name];
  if (value === undefined) {
    throw new Error(
      `Plugin "${options.name}" is missing required option: ${name}`
    );
  }
  return value as T;
}

export function getFunctionExpressionContext(funcDecl: FunctionDecl) {
  const funcAllowedContext: ExpressionContext[] = [];
  const funcAttr = funcDecl.attributes.find(
    attr => attr.decl.$refText === "@@@expressionContext"
  );
  if (funcAttr && Array.isArray(funcAttr.args) && funcAttr.args.length > 0) {
    const contextArg = funcAttr.args[0]!.value;
    if (isArrayExpr(contextArg)) {
      contextArg.items.forEach(item => {
        if (isAcidicEnumFieldReference(item)) {
          funcAllowedContext.push(item.target.$refText as ExpressionContext);
        }
      });
    }
  }
  return funcAllowedContext;
}
