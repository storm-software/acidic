// import { isFromStdlib } from "@acidic/language";
import { isInvocationExpr } from "@acidic/language";
import { AstNode } from "langium";

/**
 * Returns if the given expression is a "future()" method call.
 */
export function isFutureExpr(node: AstNode) {
  return !!(
    (isInvocationExpr(node) && node.function.ref?.name === "future") /*&&
    isFromStdlib(node.function.ref)*/
  );
}
