import {
  AbstractDeclaration,
  BinaryExpr,
  ExpressionType
} from "./__generated__/ast";
export type { AstNode, Reference } from "langium";
export * from "./__generated__/ast";

/**
 * Shape of type resolution result: an expression type or reference to a declaration
 */
export type ResolvedShape = ExpressionType | AbstractDeclaration;

/**
 * Resolved type information (attached to expressions by linker)
 */
export type ResolvedType = {
  decl?: ResolvedShape;
  array?: boolean;
  nullable?: boolean;
};

export const BinaryExprOperatorPriority: Record<
  BinaryExpr["operator"],
  number
> = {
  //LogicalExpr
  "||": 1,
  "&&": 1,
  //EqualityExpr
  "==": 2,
  "!=": 2,
  //ComparisonExpr
  ">": 3,
  "<": 3,
  ">=": 3,
  "<=": 3,
  in: 4,
  //CollectionPredicateExpr
  "^": 5,
  "?": 5,
  "!": 5
};

declare module "./__generated__/ast" {
  interface AttributeArg {
    /**
     * Resolved attribute param declaration
     */
    $resolvedParam?: AttributeParam;
  }

  interface AcidicObject {
    /**
     * Resolved fields, include inherited fields
     */
    $resolvedFields: Array<AcidicObjectField>;
  }

  interface AcidicModel {
    /**
     * Resolved fields, include inherited fields
     */
    $resolvedFields: Array<AcidicObjectField>;
  }

  interface AcidicEvent {
    /**
     * Resolved fields, include inherited fields
     */
    $resolvedFields: Array<AcidicObjectField>;
  }

  interface AcidicObjectField {
    $isInherited?: boolean;
  }

  interface AcidicQuery {
    /**
     * Resolved fields, include inherited fields
     */
    $resolvedFields: Array<AcidicOperation>;
  }

  interface AcidicMutation {
    /**
     * Resolved fields, include inherited fields
     */
    $resolvedFields: Array<AcidicOperation>;
  }

  interface AcidicSubscription {
    /**
     * Resolved fields, include inherited fields
     */
    $resolvedFields: Array<AcidicOperation>;
  }

  interface AcidicOperation {
    $isInherited?: boolean;
  }
}

declare module "langium" {
  export interface AstNode {
    /**
     * Resolved type information attached to expressions
     */
    $resolvedType?: ResolvedType;
  }
}
