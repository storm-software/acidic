import {
  AstNode,
  LangiumDocument,
  ValidationAcceptor,
  ValidationChecks,
  ValidationRegistry
} from "langium";
import {
  AcidicAstType,
  AcidicEnum,
  AcidicEvent,
  AcidicModel,
  AcidicMutation,
  AcidicObject,
  AcidicQuery,
  AcidicSubscription,
  Attribute,
  DataSource,
  Expression,
  FunctionDecl,
  InvocationExpr,
  Model
} from "../__generated__/ast";
import type { AcidicServices } from "../acidic-module";
import AcidicEnumValidator from "./acidic-enum-validator";
import AcidicEventValidator from "./acidic-event-validator";
import AcidicModelValidator from "./acidic-model-validator";
import AcidicMutationValidator from "./acidic-mutation-validator";
import AcidicObjectValidator from "./acidic-object-validator";
import { default as AcidicQueryValidator } from "./acidic-query-validator";
import AcidicSubscriptionValidator from "./acidic-subscription-validator";
import AttributeValidator from "./attribute-validator";
import DataSourceValidator from "./datasource-validator";
import ExpressionValidator from "./expression-validator";
import FunctionDeclValidator from "./function-decl-validator";
import FunctionInvocationValidator from "./function-invocation-validator";
import SchemaValidator from "./schema-validator";

/**
 * Registry for validation checks.
 */
export class AcidicValidationRegistry extends ValidationRegistry {
  constructor(services: AcidicServices) {
    super(services);
    const validator = services.validation.AcidicValidator;
    const checks: ValidationChecks<AcidicAstType> = {
      Model: validator.checkModel,
      DataSource: validator.checkDataSource,
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

    return (
      doc?.parseResult.lexerErrors.length === 0 &&
      doc?.parseResult.parserErrors.length === 0
    );
  }

  checkModel(node: Model, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new SchemaValidator(
        this.services.shared.workspace.LangiumDocuments
      ).validate(node, accept);
  }

  checkDataSource(node: DataSource, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new DataSourceValidator().validate(node, accept);
  }

  checkAcidicObject(node: AcidicObject, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new AcidicObjectValidator().validate(node, accept);
  }

  checkAcidicModel(node: AcidicModel, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicModelValidator().validate(node, accept);
  }

  checkAcidicQuery(node: AcidicQuery, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicQueryValidator().validate(node, accept);
  }

  checkAcidicMutation(node: AcidicMutation, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new AcidicMutationValidator().validate(node, accept);
  }

  checkAcidicSubscription(
    node: AcidicSubscription,
    accept: ValidationAcceptor
  ): void {
    this.shouldCheck(node) &&
      new AcidicSubscriptionValidator().validate(node, accept);
  }

  checkAcidicEvent(node: AcidicEvent, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicEventValidator().validate(node, accept);
  }

  checkAcidicEnum(node: AcidicEnum, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AcidicEnumValidator().validate(node, accept);
  }

  checkAttribute(node: Attribute, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new AttributeValidator().validate(node, accept);
  }

  checkExpression(node: Expression, accept: ValidationAcceptor): void {
    this.shouldCheck(node) && new ExpressionValidator().validate(node, accept);
  }

  checkFunctionInvocation(
    node: InvocationExpr,
    accept: ValidationAcceptor
  ): void {
    this.shouldCheck(node) &&
      new FunctionInvocationValidator().validate(node, accept);
  }

  checkFunctionDecl(node: FunctionDecl, accept: ValidationAcceptor): void {
    this.shouldCheck(node) &&
      new FunctionDeclValidator().validate(node, accept);
  }
}
