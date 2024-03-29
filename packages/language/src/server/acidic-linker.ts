import {
  type AcidicEnum,
  AcidicEnumField,
  AcidicEvent,
  AcidicModel,
  AcidicMutation,
  AcidicObject,
  AcidicObjectField,
  type AcidicObjectFieldType,
  AcidicQuery,
  AcidicSubscription,
  ArrayExpr,
  AttributeArg,
  type AttributeParam,
  BinaryExpr,
  type Expression,
  type FunctionDecl,
  type FunctionParam,
  type FunctionParamType,
  InvocationExpr,
  LiteralExpr,
  MemberAccessExpr,
  NullExpr,
  ObjectExpr,
  ReferenceExpr,
  type ReferenceTarget,
  ThisExpr,
  UnaryExpr,
  isAcidicEnum,
  isAcidicEvent,
  isAcidicModel,
  isAcidicMutation,
  isAcidicObject,
  isAcidicObjectField,
  isAcidicObjectFieldType,
  isAcidicQuery,
  isAcidicSubscription,
  isArrayExpr,
  isReferenceExpr
} from "../language";
import {
  getContainingSchema,
  isFromStdlib,
  mapBuiltinTypeToExpressionType,
  getAllDeclarationsFromImports
} from "../utilities";
import type { ResolvedShape } from "../ast";
import {
  type AstNode,
  type AstNodeDescription,
  type AstNodeDescriptionProvider,
  DefaultLinker,
  DocumentState,
  type LangiumDocument,
  type LangiumServices,
  type LinkingError,
  type Reference,
  interruptAndCheck,
  isReference,
  streamContents
} from "langium";
import { CancellationToken } from "vscode-jsonrpc";

interface DefaultReference extends Reference {
  _ref?: AstNode | LinkingError;
  _nodeDescription?: AstNodeDescription;
}

type ScopeProvider = (name: string) => ReferenceTarget | undefined;

/**
 * Langium linker implementation which links references and resolves expression types
 */
export class AcidicLinker extends DefaultLinker {
  private readonly descriptions: AstNodeDescriptionProvider;

  constructor(services: LangiumServices) {
    super(services);
    this.descriptions = services.workspace.AstNodeDescriptionProvider;
  }

  override async link(
    document: LangiumDocument,
    cancelToken = CancellationToken.None
  ): Promise<void> {
    if (
      document.parseResult.lexerErrors?.length > 0 ||
      document.parseResult.parserErrors?.length > 0
    ) {
      return;
    }

    for (const node of streamContents(document.parseResult.value)) {
      await interruptAndCheck(cancelToken);
      this.resolve(node, document);
    }
    document.state = DocumentState.Linked;
  }

  private linkReference(
    container: AstNode,
    property: string,
    document: LangiumDocument,
    extraScopes: ScopeProvider[]
  ) {
    if (!this.resolveFromScopeProviders(container, property, document, extraScopes)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reference: Reference<AstNode> = (container as any)[property];
      this.doLink({ reference, container, property }, document);
    }
  }

  private resolveFromScopeProviders(
    node: AstNode,
    property: string,
    document: LangiumDocument,
    providers: ScopeProvider[]
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reference: DefaultReference = (node as any)[property];
    for (const provider of providers) {
      const target = provider(reference.$refText);
      if (target) {
        reference._ref = target;
        reference._nodeDescription = this.descriptions.createDescription(
          target,
          target.name,
          document
        );
        return target;
      }
    }
    return null;
  }

  private resolve(node: AstNode, document: LangiumDocument, extraScopes: ScopeProvider[] = []) {
    switch (node.$type) {
      case LiteralExpr:
        this.resolveLiteral(node as LiteralExpr);
        break;

      case InvocationExpr:
        this.resolveInvocation(node as InvocationExpr, document, extraScopes);
        break;

      case ArrayExpr:
        this.resolveArray(node as ArrayExpr, document, extraScopes);
        break;

      case ReferenceExpr:
        this.resolveReference(node as ReferenceExpr, document, extraScopes);
        break;

      case MemberAccessExpr:
        this.resolveMemberAccess(node as MemberAccessExpr, document, extraScopes);
        break;

      case UnaryExpr:
        this.resolveUnary(node as UnaryExpr, document, extraScopes);
        break;

      case BinaryExpr:
        this.resolveBinary(node as BinaryExpr, document, extraScopes);
        break;

      case ObjectExpr:
        this.resolveAcidicObjectExpr(node as ObjectExpr, document, extraScopes);
        break;

      case ThisExpr:
        this.resolveThis(node as ThisExpr, document, extraScopes);
        break;

      case NullExpr:
        this.resolveNull(node as NullExpr, document, extraScopes);
        break;

      case AttributeArg:
        this.resolveAttributeArg(node as AttributeArg, document, extraScopes);
        break;

      case AcidicObjectField:
        this.resolveAcidicObjectField(node as AcidicObjectField, document, extraScopes);
        break;

      case AcidicObject:
        this.resolveAcidicObject(node as AcidicObject, document, extraScopes);
        break;

      case AcidicModel:
        this.resolveAcidicModel(node as AcidicModel, document, extraScopes);
        break;

      case AcidicQuery:
        this.resolveAcidicQuery(node as AcidicQuery, document, extraScopes);
        break;

      case AcidicMutation:
        this.resolveAcidicMutation(node as AcidicMutation, document, extraScopes);
        break;

      case AcidicSubscription:
        this.resolveAcidicSubscription(node as AcidicSubscription, document, extraScopes);
        break;

      case AcidicEvent:
        this.resolveAcidicEvent(node as AcidicEvent, document, extraScopes);
        break;

      default:
        this.resolveDefault(node, document, extraScopes);
        break;
    }
  }

  private resolveBinary(
    node: BinaryExpr,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    switch (node.operator) {
      // case '+':
      // case '-':
      // case '*':
      // case '/':
      //     this.resolve(node.left, document, extraScopes);
      //     this.resolve(node.right, document, extraScopes);
      //     this.resolveToBuiltinTypeOrDecl(node, 'Int');
      //     break;

      case ">":
      case ">=":
      case "<":
      case "<=":
      case "==":
      case "!=":
      case "&&":
      case "||":
      case "in":
        this.resolve(node.left, document, extraScopes);
        this.resolve(node.right, document, extraScopes);
        this.resolveToBuiltinTypeOrDecl(node, "Boolean");
        break;

      case "?":
      case "!":
      case "^":
        this.resolveCollectionPredicate(node, document, extraScopes);
        break;

      default:
        throw Error(`Unsupported binary operator: ${node.operator}`);
    }
  }

  private resolveUnary(
    node: UnaryExpr,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    this.resolve(node.operand, document, extraScopes);
    switch (node.operator) {
      case "!":
        this.resolveToBuiltinTypeOrDecl(node, "Boolean");
        break;
      default:
        throw Error(`Unsupported unary operator: ${node.operator}`);
    }
  }

  private resolveAcidicObjectExpr(
    node: ObjectExpr,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    node.fields.forEach((field) => this.resolve(field.value, document, extraScopes));
    this.resolveToBuiltinTypeOrDecl(node, "Object");
  }

  private resolveReference(
    node: ReferenceExpr,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    this.linkReference(node, "target", document, extraScopes);
    node.args.forEach((arg) => this.resolve(arg, document, extraScopes));

    if (node.target.ref) {
      // resolve type
      if (node.target.ref.$type === AcidicEnumField) {
        this.resolveToBuiltinTypeOrDecl(node, node.target.ref.$container);
      } else if ((node.target.ref as AcidicObjectField | FunctionParam)?.type) {
        this.resolveToDeclaredType(
          node,
          (node.target.ref as AcidicObjectField | FunctionParam).type
        );
      }
    }
  }

  private resolveArray(
    node: ArrayExpr,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    node.items.forEach((item) => this.resolve(item, document, extraScopes));

    if (node.items.length > 0) {
      const itemType = node.items[0]?.$resolvedType;
      if (itemType?.decl) {
        this.resolveToBuiltinTypeOrDecl(node, itemType.decl, true);
      }
    } else {
      this.resolveToBuiltinTypeOrDecl(node, "Any", true);
    }
  }

  private resolveInvocation(
    node: InvocationExpr,
    document: LangiumDocument,
    extraScopes: ScopeProvider[]
  ) {
    this.linkReference(node, "function", document, extraScopes);
    node.args.forEach((arg) => this.resolve(arg, document, extraScopes));
    if (node.function.ref) {
      const funcDecl = node.function.ref as FunctionDecl;
      if (funcDecl.name === "auth" && isFromStdlib(funcDecl)) {
        // auth() function is resolved to User model in the current document
        const acidicObject = getContainingSchema(node);

        if (acidicObject) {
          const userAcidicObject = getAllDeclarationsFromImports(
            this.langiumDocuments(),
            acidicObject
          ).find((doc: any) => isAcidicObject(doc) && doc.name === "User");
          if (userAcidicObject) {
            node.$resolvedType = { decl: userAcidicObject, nullable: true };
          }
        }
      } else if (funcDecl.name === "future" && isFromStdlib(funcDecl)) {
        // future() function is resolved to current model
        node.$resolvedType = { decl: this.getContainingAcidicObject(node) };
      } else {
        this.resolveToDeclaredType(node, funcDecl.returnType);
      }
    }
  }

  private getContainingAcidicObject(node: Expression): AcidicObject | undefined {
    let curr: AstNode | undefined = node.$container;
    while (curr) {
      if (isAcidicObject(curr)) {
        return curr;
      }
      curr = curr.$container;
    }
    return undefined;
  }

  private resolveLiteral(node: LiteralExpr) {
    const type =
      typeof node.value === "string"
        ? "String"
        : typeof node.value === "boolean"
          ? "Boolean"
          : typeof node.value === "number"
            ? "Int"
            : undefined;

    if (type) {
      this.resolveToBuiltinTypeOrDecl(node, type);
    }
  }

  private resolveMemberAccess(
    node: MemberAccessExpr,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    this.resolve(node.operand, document, _extraScopes);
    const operandResolved = node.operand.$resolvedType;

    if (operandResolved && !operandResolved.array && isAcidicObject(operandResolved.decl)) {
      let objectDecl: AcidicObject = operandResolved.decl as AcidicObject;
      if (!objectDecl) {
        objectDecl = operandResolved.decl as AcidicObject;
      }

      const provider = (name: string) => objectDecl.fields.find((f) => f.name === name);
      _extraScopes = [provider, ..._extraScopes];
    } else if (operandResolved && !operandResolved.array && isAcidicModel(operandResolved.decl)) {
      let modelDecl: AcidicModel = operandResolved.decl as AcidicModel;
      if (!modelDecl) {
        modelDecl = operandResolved.decl as AcidicModel;
      }

      const provider = (name: string) => modelDecl.fields.find((f) => f.name === name);
      _extraScopes = [provider, ..._extraScopes];
    } else if (operandResolved && !operandResolved.array && isAcidicQuery(operandResolved.decl)) {
      const queryDecl = operandResolved.decl as AcidicQuery;
      const provider = (name: string) => queryDecl.fields.find((f) => f.name === name);
      _extraScopes = [provider, ..._extraScopes];
    } else if (
      operandResolved &&
      !operandResolved.array &&
      isAcidicMutation(operandResolved.decl)
    ) {
      const mutationDecl = operandResolved.decl as AcidicMutation;
      const provider = (name: string) => mutationDecl.fields.find((f) => f.name === name);
      _extraScopes = [provider, ..._extraScopes];
    } else if (
      operandResolved &&
      !operandResolved.array &&
      isAcidicSubscription(operandResolved.decl)
    ) {
      const subscriptionDecl = operandResolved.decl as AcidicSubscription;
      const provider = (name: string) => subscriptionDecl.fields.find((f) => f.name === name);
      _extraScopes = [provider, ..._extraScopes];
    } else if (operandResolved && !operandResolved.array && isAcidicEvent(operandResolved.decl)) {
      const eventDecl = operandResolved.decl as AcidicEvent;
      const provider = (name: string) => eventDecl.fields.find((f) => f.name === name);
      _extraScopes = [provider, ..._extraScopes];
    }

    this.linkReference(node, "member", document, _extraScopes);
    if (node.member.ref) {
      this.resolveToDeclaredType(node, node.member.ref.type);
    }
  }

  private resolveCollectionPredicate(
    node: BinaryExpr,
    document: LangiumDocument,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    this.resolve(node.left, document, _extraScopes);

    const resolvedType = node.left.$resolvedType;
    if (
      resolvedType &&
      (isAcidicObject(resolvedType.decl) ||
        isAcidicModel(resolvedType.decl) ||
        isAcidicQuery(resolvedType.decl) ||
        isAcidicMutation(resolvedType.decl) ||
        isAcidicSubscription(resolvedType.decl) ||
        isAcidicEvent(resolvedType.decl)) &&
      resolvedType.array
    ) {
      const dataTypeDecl = resolvedType.decl;
      const provider = (name: string) => dataTypeDecl.$resolvedFields.find((f) => f.name === name);
      _extraScopes = [provider, ..._extraScopes];
      this.resolve(node.right, document, _extraScopes);
      this.resolveToBuiltinTypeOrDecl(node, "Boolean");
    } else {
      // error is reported in validation pass
    }
  }

  private resolveThis(
    node: ThisExpr,
    _document: LangiumDocument<AstNode>,
    _extraScopes: ScopeProvider[]
  ) {
    let decl: AstNode | undefined = node.$container;

    while (
      decl &&
      !(
        isAcidicObject(decl) ||
        isAcidicModel(decl) ||
        isAcidicQuery(decl) ||
        isAcidicMutation(decl) ||
        isAcidicSubscription(decl) ||
        isAcidicEvent(decl)
      )
    ) {
      decl = decl.$container;
    }

    if (decl) {
      this.resolveToBuiltinTypeOrDecl(node, decl as ResolvedShape);
    }
  }

  private resolveNull(
    node: NullExpr,
    _document: LangiumDocument<AstNode>,
    _extraScopes: ScopeProvider[]
  ) {
    // TODO: how to really resolve null?
    this.resolveToBuiltinTypeOrDecl(node, "Null");
  }

  private resolveAttributeArg(
    node: AttributeArg,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    const attrParam = this.findAttrParamForArg(node);
    const attrAppliedOn = node.$container.$container;

    if (attrParam?.type.type === "TransitiveFieldReference" && isAcidicObjectField(attrAppliedOn)) {
      // "TransitiveFieldReference" is resolved in the context of the containing model of the field
      // where the attribute is applied
      //
      // E.g.:
      //
      // model A {
      //   myId @id String
      // }
      //
      // model B {
      //   id @id String
      //   a A @relation(fields: [id], references: [myId])
      // }
      //
      // In model B, the attribute argument "myId" is resolved to the field "myId" in model A

      const transitiveAcidicModel = attrAppliedOn.type.reference?.ref as AcidicModel;
      if (transitiveAcidicModel) {
        // resolve references in the context of the transitive data model
        const scopeProvider = (name: string) =>
          transitiveAcidicModel.$resolvedFields.find((f) => f.name === name);
        if (isArrayExpr(node.value)) {
          node.value.items.forEach((item) => {
            if (isReferenceExpr(item)) {
              const resolved = this.resolveFromScopeProviders(item, "target", document, [
                scopeProvider
              ]);
              if (resolved) {
                this.resolveToDeclaredType(item, (resolved as AcidicObjectField).type);
              } else {
                // need to clear linked reference, because it's resolved in default scope by default
                const ref = item.target as DefaultReference;
                ref._ref = this.createLinkingError({
                  reference: ref,
                  container: item,
                  property: "target"
                });
              }
            }
          });
          if (node.value.items[0]?.$resolvedType?.decl) {
            this.resolveToBuiltinTypeOrDecl(
              node.value,
              node.value.items[0].$resolvedType.decl,
              true
            );
          }
        } else if (isReferenceExpr(node.value)) {
          const resolved = this.resolveFromScopeProviders(node.value, "target", document, [
            scopeProvider
          ]);
          if (resolved) {
            this.resolveToDeclaredType(node.value, (resolved as AcidicObjectField).type);
          } else {
            // need to clear linked reference, because it's resolved in default scope by default
            const ref = node.value.target as DefaultReference;
            ref._ref = this.createLinkingError({
              reference: ref,
              container: node.value,
              property: "target"
            });
          }
        }
      }
    } /*else if (
      attrParam?.type.type === "TransitiveFieldReference" &&
      isOperation(attrAppliedOn)
    ) {
      // "TransitiveFieldReference" is resolved in the context of the containing Type of the field
      // where the attribute is applied
      //
      // E.g.:
      //
      // Type A {
      //   myId @id String
      // }
      //
      // Type B {
      //   id @id String
      //   a A @relation(fields: [id], references: [myId])
      // }
      //
      // In Type B, the attribute argument "myId" is resolved to the field "myId" in Type A

      const transtiveOperationGroup = attrAppliedOn.type.reference
        ?.ref as OperationGroup;
      if (transtiveOperationGroup) {
        // resolve references in the context of the transitive data Type
        const scopeProvider = (name: string) =>
          transtiveOperationGroup.$resolvedFields.find(f => f.name === name);
        if (isArrayExpr(node.value)) {
          node.value.items.forEach(item => {
            if (isReferenceExpr(item)) {
              const resolved = this.resolveFromScopeProviders(
                item,
                "target",
                document,
                [scopeProvider]
              );
              if (resolved) {
                this.resolveToDeclaredType(item, (resolved as Operation).type);
              } else {
                // need to clear linked reference, because it's resolved in default scope by default
                const ref = item.target as DefaultReference;
                ref._ref = this.createLinkingError({
                  reference: ref,
                  container: item,
                  property: "target"
                });
              }
            }
          });
          if (node.value.items[0]?.$resolvedType?.decl) {
            this.resolveToBuiltinTypeOrDecl(
              node.value,
              node.value.items[0].$resolvedType.decl,
              true
            );
          }
        } else if (isReferenceExpr(node.value)) {
          const resolved = this.resolveFromScopeProviders(
            node.value,
            "target",
            document,
            [scopeProvider]
          );
          if (resolved) {
            this.resolveToDeclaredType(
              node.value,
              (resolved as Operation).type
            );
          } else {
            // need to clear linked reference, because it's resolved in default scope by default
            const ref = node.value.target as DefaultReference;
            ref._ref = this.createLinkingError({
              reference: ref,
              container: node.value,
              property: "target"
            });
          }
        }
      }
    }*/ else {
      this.resolve(node.value, document, extraScopes);
    }
    node.$resolvedType = node.value.$resolvedType;
  }

  private findAttrParamForArg(arg: AttributeArg): AttributeParam | undefined {
    const attr = arg.$container.decl.ref;
    if (!attr) {
      return undefined;
    }
    if (arg.name) {
      return attr.params?.find((p) => p.name === arg.name);
    }
    const index = arg.$container.args.findIndex((a) => a === arg);
    return attr.params[index];
  }

  private resolveAcidicObject(
    node: AcidicObject,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    if (node.superTypes.length > 0) {
      const providers = node.superTypes.map(
        (superType) => (name: string) => superType.ref?.fields.find((f) => f.name === name)
      );
      _extraScopes = [...providers, ..._extraScopes];
    }

    return this.resolveDefault(node, document, _extraScopes);
  }

  private resolveAcidicModel(
    node: AcidicModel,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    if (node.superTypes.length > 0) {
      const providers = node.superTypes.map(
        (superType) => (name: string) => superType.ref?.fields.find((f) => f.name === name)
      );
      _extraScopes = [...providers, ..._extraScopes];
    }

    return this.resolveDefault(node, document, _extraScopes);
  }

  private resolveAcidicObjectField(
    node: AcidicObjectField,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    // Field declaration may contain enum references, and enum fields are pushed to the global
    // scope, so if there're enums with fields with the same name, an arbitrary one will be
    // used as resolution target. The correct behavior is to resolve to the enum that's used
    // as the declaration type of the field:
    //
    // enum FirstAcidicEnum {
    //     E1
    //     E2
    // }

    // enum SecondAcidicEnum  {
    //     E1
    //     E3
    //     E4
    // }

    // model M {
    //     id Int @id
    //     first  SecondAcidicEnum @default(E1) <- should resolve to SecondAcidicEnum
    //     second FirstAcidicEnum @default(E1) <- should resolve to FirstAcidicEnum
    // }
    //

    const _extraScopes = extraScopes;

    // make sure type is resolved first
    this.resolve(node.type, document, _extraScopes);

    let scopes = _extraScopes;

    // if the field has enum declaration type, resolve the rest with that enum's fields on top of the scopes
    if (node.type.reference?.ref && isAcidicEnum(node.type.reference.ref)) {
      const contextAcidicEnum = node.type.reference.ref as AcidicEnum;
      const enumScope: ScopeProvider = (name) =>
        contextAcidicEnum.fields.find((f) => f.name === name);
      scopes = [enumScope, ...scopes];
    }

    this.resolveDefault(node, document, scopes);
  }

  private resolveAcidicQuery(
    node: AcidicQuery,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    if (node.superTypes.length > 0) {
      const providers = node.superTypes.map(
        (superType) => (name: string) => superType.ref?.fields.find((f) => f.name === name)
      );
      _extraScopes = [...providers, ..._extraScopes];
    }

    return this.resolveDefault(node, document, _extraScopes);
  }

  private resolveAcidicMutation(
    node: AcidicMutation,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    if (node.superTypes.length > 0) {
      const providers = node.superTypes.map(
        (superType) => (name: string) => superType.ref?.fields.find((f) => f.name === name)
      );
      _extraScopes = [...providers, ..._extraScopes];
    }

    return this.resolveDefault(node, document, _extraScopes);
  }

  private resolveAcidicSubscription(
    node: AcidicSubscription,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    if (node.superTypes.length > 0) {
      const providers = node.superTypes.map(
        (superType) => (name: string) => superType.ref?.fields.find((f) => f.name === name)
      );
      _extraScopes = [...providers, ..._extraScopes];
    }

    return this.resolveDefault(node, document, _extraScopes);
  }

  private resolveAcidicEvent(
    node: AcidicEvent,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    let _extraScopes = extraScopes;
    if (node.superTypes.length > 0) {
      const providers = node.superTypes.map(
        (superType) => (name: string) => superType.ref?.fields.find((f) => f.name === name)
      );
      _extraScopes = [...providers, ..._extraScopes];
    }

    return this.resolveDefault(node, document, _extraScopes);
  }

  /*private resolveOperation(
    node: Operation,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    // Field declaration may contain enum references, and enum fields are pushed to the global
    // scope, so if there're enums with fields with the same name, an arbitrary one will be
    // used as resolution target. The correct behavior is to resolve to the enum that's used
    // as the declaration type of the field:
    //
    // enum FirstAcidicEnum {
    //     E1
    //     E2
    // }

    // enum SecondAcidicEnum  {
    //     E1
    //     E3
    //     E4
    // }

    // Type M {
    //     id Int @id
    //     first  SecondAcidicEnum @default(E1) <- should resolve to SecondAcidicEnum
    //     second FirstAcidicEnum @default(E1) <- should resolve to FirstAcidicEnum
    // }
    //

    // make sure type is resolved first
    this.resolve(node.type, document, extraScopes);

    let scopes = extraScopes;

    // if the field has enum declaration type, resolve the rest with that enum's fields on top of the scopes
    if (node.type.reference?.ref && isAcidicEnum(node.type.reference.ref)) {
      const contextAcidicEnum = node.type.reference.ref as AcidicEnum;
      const enumScope: ScopeProvider = name =>
        contextAcidicEnum.fields.find(f => f.name === name);
      scopes = [enumScope, ...scopes];
    }

    this.resolveDefault(node, document, scopes);
  }*/

  private resolveDefault(
    node: AstNode,
    document: LangiumDocument<AstNode>,
    extraScopes: ScopeProvider[]
  ) {
    const _extraScopes = extraScopes;
    for (const [property, value] of Object.entries(node)) {
      if (!property.startsWith("$")) {
        if (isReference(value)) {
          this.linkReference(node, property, document, _extraScopes);
        }
      }
    }
    for (const child of streamContents(node)) {
      this.resolve(child, document, _extraScopes);
    }
  }

  private resolveToDeclaredType(node: AstNode, type: FunctionParamType | AcidicObjectFieldType) {
    let nullable = false;
    if (isAcidicObjectFieldType(type)) {
      nullable = type.optional;

      // referencing a field of 'Unsupported' type
      if (type.unsupported) {
        node.$resolvedType = {
          decl: "Unsupported",
          array: type.array,
          nullable
        };
        return;
      }
    } /*else if (isOperationType(type)) {
      nullable = type.optional;

      // referencing a field of 'Unsupported' type
      if (type.unsupported) {
        node.$resolvedType = {
          decl: "Unsupported",
          array: type.array,
          nullable
        };
        return;
      }
    }*/

    if (type.type) {
      const mappedType = mapBuiltinTypeToExpressionType(type.type);
      node.$resolvedType = {
        decl: mappedType,
        array: type.array,
        nullable: nullable
      };
    } else if (type.reference) {
      node.$resolvedType = {
        decl: type.reference.ref,
        array: type.array,
        nullable: nullable
      };
    }
  }

  private resolveToBuiltinTypeOrDecl(
    node: AstNode,
    type: ResolvedShape,
    array = false,
    nullable = false
  ) {
    node.$resolvedType = { decl: type, array, nullable };
  }
}
