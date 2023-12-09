import { isInvocationExpr } from "@acidic/language/ast";
import { isFromStdlib } from "@acidic/language/utils";
import { AstNode } from "langium/lib/syntax-tree";

/**
 * Returns if the given expression is a "future()" method call.
 */
export function isFutureExpr(node: AstNode) {
  return !!(
    isInvocationExpr(node) &&
    node.function.ref?.name === "future" &&
    isFromStdlib(node.function.ref)
  );
}
