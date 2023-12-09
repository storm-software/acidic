import { AstNode, Reference } from "langium";
import {
  AcidicEvent,
  AcidicModel,
  AcidicObject,
  AcidicObjectField,
  FunctionDecl,
  Model,
  ReferenceExpr,
  isAcidicEnumField,
  isArrayExpr,
  isModel,
  isReferenceExpr
} from "../ast";
import { ExpressionContext, STD_LIB_MODULE_NAME } from "../constants";

export function resolved<T extends AstNode>(ref: Reference<T>): T {
  if (!ref.ref) {
    throw new Error(`Reference not resolved: ${ref.$refText}`);
  }
  return ref.ref;
}

/**
 * Gets the toplevel Acidic Object containing the given node.
 */
export function getContainingModel(node: AstNode | undefined): Model | null {
  if (!node) {
    return null;
  }
  return isModel(node) ? node : getContainingModel(node.$container);
}

/**
 * Returns if the given node is declared in stdlib.
 */
export function isFromStdlib(node: AstNode) {
  const model = getContainingModel(node);
  return (
    !!model &&
    !!model.$document &&
    model.$document.uri.path.endsWith(STD_LIB_MODULE_NAME)
  );
}

/**
 * Gets lists of unique fields declared at the data model level
 */
export function getUniqueFields(
  model: AcidicModel | AcidicObject | AcidicEvent
) {
  const uniqueAttrs = model.attributes.filter(
    attr => attr.decl.ref?.name === "@@unique" || attr.decl.ref?.name === "@@id"
  );
  return uniqueAttrs.map(uniqueAttr => {
    const fieldsArg = uniqueAttr.args.find(
      a => a.$resolvedParam?.name === "fields"
    );
    if (!fieldsArg || !isArrayExpr(fieldsArg.value)) {
      return [];
    }

    return fieldsArg.value.items
      .filter((item): item is ReferenceExpr => isReferenceExpr(item))
      .map(item => resolved(item.target) as AcidicObjectField);
  });
}

/**
 * Gets `@@unique` fields declared at the acidic object level
 */
export function getAcidicObjectUniqueFields(
  model: AcidicModel | AcidicObject | AcidicEvent
) {
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
 * Gets `@@id` fields declared at the data model level
 */
export function getModelIdFields(
  model: AcidicModel | AcidicObject | AcidicEvent
) {
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

export function isAcidicEnumFieldReference(
  node: AstNode
): node is ReferenceExpr {
  return isReferenceExpr(node) && isAcidicEnumField(node.target.ref);
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
