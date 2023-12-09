grammar Acidic

entry Model:
    imports+=ModelImport*
    (
        declarations+=AbstractDeclaration
    )*;

ModelImport:
    'import' path=STRING  ';'?;

AbstractDeclaration:
   ServiceID | DataSource | GeneratorDecl | Plugin | AcidicModel | AcidicObject | AcidicQuery | AcidicMutation | AcidicSubscription | AcidicEvent | AcidicEnum | FunctionDecl | Attribute;

// service name
ServiceID:
    TRIPLE_SLASH_COMMENT* 'service' name=RegularID;

// datasource
DataSource:
    TRIPLE_SLASH_COMMENT* 'datasource' name=RegularID '{' (fields+=DataSourceField)* '}';

DataSourceField:
    TRIPLE_SLASH_COMMENT* name=RegularID '=' value=(LiteralExpr | InvocationExpr | ArrayExpr);

// generator
GeneratorDecl:
    TRIPLE_SLASH_COMMENT* 'generator' name=RegularID '{' (fields+=GeneratorField)* '}';

GeneratorField:
    TRIPLE_SLASH_COMMENT* name=RegularID '=' value=(LiteralExpr | ArrayExpr);

// plugin
Plugin:
    TRIPLE_SLASH_COMMENT* 'plugin' name=RegularID '{' (fields+=PluginField)* '}';

PluginField:
    TRIPLE_SLASH_COMMENT* name=RegularID '=' value=(LiteralExpr | ArrayExpr | ObjectExpr);

// expression
Expression:
    LogicalExpr;

LiteralExpr:
    value=(Boolean | NUMBER | STRING);

ArrayExpr:
    '[' (items+=Expression (',' items+=Expression)*)? ']';

type ReferenceTarget = FunctionParam | AcidicObjectField | AcidicEnumField | AcidicOperation;

ThisExpr:
    value=THIS;

NullExpr:
    value=NULL;

ReferenceExpr:
    target=[ReferenceTarget:RegularID] ('(' ReferenceArgList ')')?;

fragment ReferenceArgList:
    args+=ReferenceArg (',' args+=ReferenceArg)*;

ReferenceArg:
    name=('sort') ':' value=('Asc' | 'Desc');

ObjectExpr:
    '{'
        (fields+=FieldInitializer (',' fields+=FieldInitializer)* ','?)?
    '}';

FieldInitializer:
    name=RegularID ':' value=(Expression);

InvocationExpr:
    function=[FunctionDecl] '(' ArgumentList? ')';

// binary operator precedence follow Javascript's rules:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table

MemberAccessExpr infers Expression:
    PrimaryExpr (
        {infer MemberAccessExpr.operand=current}
        ('.' member=[AcidicObjectField])
    )*;

UnaryExpr:
    operator=('!') operand=MemberAccessExpr;

CollectionPredicateExpr infers Expression:
    MemberAccessExpr (
        {infer BinaryExpr.left=current}
        operator=('?'|'!'|'^')
        '[' right=Expression ']'
    )*;

InExpr infers Expression:
    CollectionPredicateExpr (
        {infer BinaryExpr.left=current}
        operator=('in')
        right=CollectionPredicateExpr
    )*;

ComparisonExpr infers Expression:
    InExpr (
        {infer BinaryExpr.left=current}
        operator=('>'|'<'|'>='|'<=')
        right=InExpr
    )*;

EqualityExpr infers Expression:
    ComparisonExpr (
        {infer BinaryExpr.left=current}
        operator=('=='|'!=')
        right=ComparisonExpr
    )*;

LogicalExpr infers Expression:
    EqualityExpr (
        {infer BinaryExpr.left=current}
        operator=('&&'|'||')
        right=EqualityExpr
    )*;

PrimaryExpr infers Expression:
    '(' Expression ')' |
    ThisExpr |
    NullExpr |
    LiteralExpr |
    UnaryExpr |
    InvocationExpr |
    ArrayExpr|
    ReferenceExpr |
    ObjectExpr;

fragment ArgumentList:
    args+=Argument (',' args+=Argument)*;

Argument:
    (name=RegularID ':')? value=Expression;

// ---- Data Objects ----

// object
AcidicObject:
    (comments+=TRIPLE_SLASH_COMMENT)*
    (
        (
            (isAbstract?='abstract')? 'type' name=RegularID |
            (isExtend?='extend')? 'type' name=RegularID
        )
        ('extends' superTypes+=[AcidicObject] (',' superTypes+=[AcidicObject])*)?
    )
    '{' (
        fields+=AcidicObjectField
            | attributes+=AcidicObjectAttribute
        )+
    '}';

AcidicObjectField:
    (comments+=TRIPLE_SLASH_COMMENT)*
    name=RegularID type=AcidicObjectFieldType (attributes+=AcidicFieldAttribute)*;

AcidicObjectFieldType:
    (type=BuiltinType | unsupported=UnsupportedFieldType | reference=[TypeDeclaration:RegularID]) (array?='[' ']')? (optional?='?')?;

// model
AcidicModel:
    (comments+=TRIPLE_SLASH_COMMENT)*
    (
        (
            (
                (isAbstract?='abstract')? 'model' name=RegularID |
                (isExtend?='extend')? 'model' name=RegularID
            ) |
            (
                (isView?='view') name=RegularID
            )
        )
        ('extends' superTypes+=[AcidicObject] (',' superTypes+=[AcidicObject])*)?
    )
    '{' (
        fields+=AcidicObjectField
            | attributes+=AcidicObjectAttribute
        )+
    '}';

// event
AcidicEvent:
    (comments+=TRIPLE_SLASH_COMMENT)*
    (
        (
            (isAbstract?='abstract')? 'event' name=RegularID |
            (isExtend?='extend')? 'event' name=RegularID
        )
        ('extends' superTypes+=[AcidicObject] (',' superTypes+=[AcidicObject])*)?
    )
    '{' (
        fields+=AcidicObjectField
            | attributes+=AcidicObjectAttribute
        )+
    '}';

// enum
AcidicEnum:
    (comments+=TRIPLE_SLASH_COMMENT)*
    'enum' name=RegularID '{' (
           fields+=AcidicEnumField
           | attributes+=AcidicObjectAttribute
        )+
    '}';

AcidicEnumField:
    (comments+=TRIPLE_SLASH_COMMENT)*
    name=RegularID (attributes+=AcidicFieldAttribute)*;

// ---- Operations ----

AcidicQuery:
    (comments+=TRIPLE_SLASH_COMMENT)*
    (
        ((isExtend?='extend')? 'type' name=AcidicQueryName
            ('extends' superTypes+=[AcidicQuery] (',' superTypes+=[AcidicQuery])*)?)
    )
    '{' (
        fields+=AcidicOperation
            | attributes+=AcidicObjectAttribute
        )+
    '}';

AcidicQueryName returns string:
    'Query';

AcidicOperation:
    (comments+=TRIPLE_SLASH_COMMENT)*
    name=RegularID '(' (params+=AcidicOperationInputParam (',' params+=AcidicOperationInputParam)*)? ')' ':' (result=AcidicObject) (attributes+=AcidicFieldAttribute)*;

AcidicOperationInputParam:
    (comments+=TRIPLE_SLASH_COMMENT)* (defaultValue?='_')? name=RegularID ':' type=AcidicObjectFieldType ('=' defaultValue=(LiteralExpr | ArrayExpr | ObjectExpr))?;

AcidicMutation:
    (comments+=TRIPLE_SLASH_COMMENT)*
    (
        ((isExtend?='extend')? 'type' name=AcidicMutationName
            ('extends' superTypes+=[AcidicMutation] (',' superTypes+=[AcidicMutation])*)?)
    )
    '{' (
        fields+=AcidicOperation
            | attributes+=AcidicObjectAttribute
        )+
    '}';

AcidicMutationName returns string:
    'Mutation';

AcidicSubscription:
    (comments+=TRIPLE_SLASH_COMMENT)*
    (
        ((isExtend?='extend')? 'type' name=AcidicSubscriptionName
            ('extends' superTypes+=[AcidicSubscription] (',' superTypes+=[AcidicSubscription])*)?)
    )
    '{' (
        fields+=AcidicOperation
            | attributes+=AcidicObjectAttribute
        )+
    '}';

AcidicSubscriptionName returns string:
    'Subscription';

UnsupportedFieldType:
    'Unsupported' '(' (value=LiteralExpr) ')';

// function
FunctionDecl:
    TRIPLE_SLASH_COMMENT* 'function' name=RegularID '(' (params+=FunctionParam (',' params+=FunctionParam)*)? ')' ':' returnType=FunctionParamType '{' (expression=Expression)? '}' (attributes+=AcidicInternalAttribute)*;

FunctionParam:
    TRIPLE_SLASH_COMMENT* name=RegularID ':' type=FunctionParamType (optional?='?')?;

FunctionParamType:
    (type=ExpressionType | reference=[TypeDeclaration:RegularID]) (array?='[' ']')?;

QualifiedName returns string:
    // TODO: is this the right way to deal with token precedence?
    ID ('.' (ID|BuiltinType))*;

// https://github.com/langium/langium/discussions/1012
RegularID returns string:
    // include keywords that we'd like to work as ID in most places
    ID | 'model' | 'type' | 'event' | 'enum' | 'attribute' | 'service' | 'view' | 'datasource' | 'plugin' | 'abstract' | 'in' | 'sort';

// internal attribute
AcidicInternalAttributeName returns string:
    '@@@' QualifiedName;

// model-level attribute
AcidicObjectAttributeName returns string:
    '@@' QualifiedName;

// field-level attribute
AcidicFieldAttributeName returns string:
    '@' QualifiedName;

AcidicAttributeName returns string:
    AcidicObjectAttributeName | AcidicFieldAttributeName | AcidicInternalAttributeName;

// attribute
Attribute:
    TRIPLE_SLASH_COMMENT* 'attribute' name=AcidicAttributeName '(' (params+=AttributeParam (',' params+=AttributeParam)*)? ')' (attributes+=AcidicInternalAttribute)*;

AttributeParam:
    TRIPLE_SLASH_COMMENT* (defaultValue?='_')? name=RegularID ':' type=AttributeParamType;

// FieldReference refers to fields declared in the current model
// TransitiveFieldReference refers to fields declared in the model type of the current field
AttributeParamType:
    (type=(ExpressionType | 'FieldReference' | 'TransitiveFieldReference' | 'ContextType') | reference=[TypeDeclaration:RegularID]) (array?='[' ']')? (optional?='?')?;

type TypeDeclaration = AcidicModel | AcidicObject | AcidicEnum | AcidicQuery | AcidicMutation | AcidicSubscription | AcidicEvent;

AcidicFieldAttribute:
    decl=[Attribute:AcidicFieldAttributeName] ('(' AttributeArgList? ')')?;

AcidicObjectAttribute:
    TRIPLE_SLASH_COMMENT* decl=[Attribute:AcidicObjectAttributeName] ('(' AttributeArgList? ')')?;

AcidicInternalAttribute:
    decl=[Attribute:AcidicInternalAttributeName] ('(' AttributeArgList? ')')?;

fragment AttributeArgList:
    args+=AttributeArg (',' args+=AttributeArg)*;

AttributeArg:
    (name=RegularID ':')? value=Expression;

ExpressionType returns string:
    'String' | 'Int' | 'Float' | 'Boolean' | 'DateTime' | 'Time' | 'Date' | 'Null' | 'Object' | 'Any' | 'Unsupported';

BuiltinType returns string:
    'String' | 'Boolean' | 'Int' | 'BigInt' | 'Float' | 'Decimal' | 'DateTime' | 'Time' | 'Date' | 'Json' | 'Bytes';

Boolean returns boolean:
    'true' | 'false';

hidden terminal WS: /\s+/;
terminal NULL: 'null';
terminal THIS: 'this';
terminal ID: /[_a-zA-Z][\w_]*/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal NUMBER returns number: /[+-]?[0-9]+(\.[0-9]+)?/;
terminal TRIPLE_SLASH_COMMENT: /\/\/\/[^\n\r]*/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
