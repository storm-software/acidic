import type {
  AcidicAstType,
  AcidicDataSource,
  AcidicEnum,
  AcidicEvent,
  AcidicModel,
  AcidicMutation,
  AcidicObject,
  AcidicQuery,
  AcidicSchema,
  AcidicSubscription,
  Attribute,
  Expression,
  FunctionDecl,
  InvocationExpr
} from "../../__generated__/ast";
import {
  type AstNode,
  type LangiumDocument,
  type ValidationAcceptor,
  type ValidationChecks,
  ValidationRegistry
} from "langium";
import type { AcidicServices } from "../acidic-module";
import AcidicDataSourceValidator from "./acidic-data-source-validator";
import AcidicEnumValidator from "./acidic-enum-validator";
import AcidicEventValidator from "./acidic-event-validator";
import AcidicModelValidator from "./acidic-model-validator";
import AcidicMutationValidator from "./acidic-mutation-validator";
import AcidicObjectValidator from "./acidic-object-validator";
import { default as AcidicQueryValidator } from "./acidic-query-validator";
import AcidicSchemaValidator from "./acidic-schema-validator";
import AcidicSubscriptionValidator from "./acidic-subscription-validator";
import AttributeValidator from "./attribute-validator";
import ExpressionValidator from "./expression-validator";
import FunctionDeclValidator from "./function-decl-validator";
import FunctionInvocationValidator from "./function-invocation-validator";

/**
 * Registry for validation checks.
 */
export class AcidicValidationRegistry extends ValidationRegistry {
  constructor(services: AcidicServices) {
    super(services);
    const validator = services.validation.AcidicValidator;
    const checks: ValidationChecks<AcidicAstType> = {
      AcidicSchema: validator.checkAcidicSchema,
      AcidicDataSource: validator.checkAcidicDataSource,
      AcidicModel: validator.checkAcidicModel,
      AcidicObject: validator.checkAcidicObject,
      AcidicQuery: validator.checkAcidicQuery,
      AcidicMutation: validator.checkAcidicMutation,
      AcidicSubscription: validator.checkAcidicSubscription,
      AcidicEvent: validator.checkAcidicEvent,
      AcidicEnum: validator.checkAcidicEnum,
      Attribute: validator.checkAttribute,
      Expression: validator.checkExpression,
      InvocationExpr: validator.checkFunctionInvocation,
      FunctionDecl: validator.checkFunctionDecl
    };
    this.register(checks, validator);
  }
}

/**
 * Implementation of custom validations.
 */
export class AcidicValidator {
  constructor(protected readonly services: AcidicServices) {}
  private shouldCheck(node: AstNode) {
    let doc: LangiumDocument | undefined;
    let currNode: AstNode | undefined = node;
    while (currNode) {
      if (currNode.$document) {
        doc = currNode.$document;
        break;
      }
      currNode = currNode.$container;
    }

    return doc?.parseResult.lexerErrors.length === 0 && doc?.parseResult.parserErrors.length === 0;
  }

  public checkAcidicSchema(node: AcidicSchema, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new AcidicSchemaValidator(this.services.shared.workspace.LangiumDocuments).validate(
        node,
        accept
      );
  }

  public checkAcidicDataSource(node: AcidicDataSource, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicDataSourceValidator().validate(node, accept);
  }

  public checkAcidicObject(node: AcidicObject, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicObjectValidator().validate(node, accept);
  }

  public checkAcidicModel(node: AcidicModel, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicModelValidator().validate(node, accept);
  }

  public checkAcidicQuery(node: AcidicQuery, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicQueryValidator().validate(node, accept);
  }

  public checkAcidicMutation(node: AcidicMutation, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicMutationValidator().validate(node, accept);
  }

  public checkAcidicSubscription(node: AcidicSubscription, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicSubscriptionValidator().validate(node, accept);
  }

  public checkAcidicEvent(node: AcidicEvent, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicEventValidator().validate(node, accept);
  }

  public checkAcidicEnum(node: AcidicEnum, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicEnumValidator().validate(node, accept);
  }

  public checkAttribute(node: Attribute, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AttributeValidator().validate(node, accept);
  }

  public checkExpression(node: Expression, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new ExpressionValidator().validate(node, accept);
  }

  public checkFunctionInvocation(node: InvocationExpr, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new FunctionInvocationValidator().validate(node, accept);
  }

  public checkFunctionDecl(node: FunctionDecl, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new FunctionDeclValidator().validate(node, accept);
  }
}
