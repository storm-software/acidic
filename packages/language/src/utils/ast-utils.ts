import { AstNode, Mutable } from "langium";
import {
  AcidicEvent,
  AcidicModel,
  AcidicMutation,
  AcidicObject,
  AcidicObjectAttribute,
  AcidicObjectField,
  AcidicQuery,
  AcidicSchema,
  AcidicSubscription,
  Expression,
  ReferenceExpr,
  isAcidicEvent,
  isAcidicModel,
  isAcidicMutation,
  isAcidicObject,
  isAcidicObjectField,
  isAcidicQuery,
  isAcidicSubscription,
  isArrayExpr,
  isInvocationExpr,
  isMemberAccessExpr,
  isReferenceExpr
} from "../ast";
import { isFromStdlib } from "./server-utils";

export function extractAcidicModelsWithAllowRules(
  schema: AcidicSchema
): AcidicModel[] {
  return schema.declarations.filter(
    d =>
      isAcidicModel(d) &&
      d.attributes.some(attr => attr.decl.ref?.name === "@@allow")
  ) as AcidicModel[];
}

export function mergeBaseSchema(schema: AcidicSchema) {
  schema.declarations
    .filter(x => x.$type === "AcidicObject" || x.$type === "AcidicModel")
    .forEach(decl => {
      const model = decl as AcidicObject | AcidicModel;

      model.fields = model.superTypes
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .flatMap(superType => updateContainer(superType.ref!.fields, model))
        .concat(model.fields) as AcidicObjectField[];

      model.attributes = model.superTypes
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .flatMap(superType => updateContainer(superType.ref!.attributes, model))
        .concat(model.attributes) as AcidicObjectAttribute[];
    });

  // remove abstract models
  schema.declarations = schema.declarations.filter(
    x => !(x.$type == "AcidicModel" && x.isAbstract)
  );
}

function updateContainer<T extends AstNode>(
  nodes: T[],
  container: AstNode
): Mutable<T>[] {
  return nodes.map(node => {
    const cloneField = Object.assign({}, node);
    const mutable = cloneField as Mutable<T>;
    // update container
    mutable.$container = container;
    return mutable;
  });
}

export function getIdFields(model: AcidicModel | AcidicObject) {
  const fieldLevelId = model.$resolvedFields.find(f =>
    f.attributes.some(attr => attr.decl.$refText === "@id")
  );
  if (fieldLevelId) {
    return [fieldLevelId];
  } else {
    // get model level @@id attribute
    const modelIdAttr = model.attributes.find(
      attr => attr.decl?.ref?.name === "@@id"
    );
    if (
      modelIdAttr &&
      Array.isArray(modelIdAttr.args) &&
      modelIdAttr.args.length > 0
    ) {
      // get fields referenced in the attribute: @@id([field1, field2]])
      if (!isArrayExpr(modelIdAttr.args[0]?.value)) {
        return [];
      }
      const argValue = modelIdAttr.args[0]?.value;
      return argValue?.items
        .filter(
          (expr): expr is ReferenceExpr =>
            isReferenceExpr(expr) && !!getAcidicObjectFieldReference(expr)
        )
        .map(expr => expr.target.ref as AcidicObjectField);
    }
  }
  return [];
}

export function isAuthInvocation(node: AstNode) {
  return (
    isInvocationExpr(node) &&
    node.function.ref?.name === "auth" &&
    isFromStdlib(node.function.ref)
  );
}

export function getAcidicObjectReference(
  expr: Expression
): AcidicObject | undefined {
  if (isReferenceExpr(expr) && isAcidicObject(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicObject(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicModelReference(
  expr: Expression
): AcidicModel | undefined {
  if (isReferenceExpr(expr) && isAcidicModel(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicModel(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicObjectFieldReference(
  expr: Expression
): AcidicObjectField | undefined {
  if (isReferenceExpr(expr) && isAcidicObjectField(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicObjectField(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicQueryReference(
  expr: Expression
): AcidicQuery | undefined {
  if (isReferenceExpr(expr) && isAcidicQuery(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicQuery(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicMutationReference(
  expr: Expression
): AcidicMutation | undefined {
  if (isReferenceExpr(expr) && isAcidicMutation(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicMutation(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicSubscriptionReference(
  expr: Expression
): AcidicSubscription | undefined {
  if (isReferenceExpr(expr) && isAcidicSubscription(expr.target.ref)) {
    return expr.target.ref;
  } else if (
    isMemberAccessExpr(expr) &&
    isAcidicSubscription(expr.member.ref)
  ) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}

export function getAcidicEventReference(
  expr: Expression
): AcidicEvent | undefined {
  if (isReferenceExpr(expr) && isAcidicEvent(expr.target.ref)) {
    return expr.target.ref;
  } else if (isMemberAccessExpr(expr) && isAcidicEvent(expr.member.ref)) {
    return expr.member.ref;
  } else {
    return undefined;
  }
}
