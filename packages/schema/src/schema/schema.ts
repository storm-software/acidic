import * as v from "valibot";

export enum NodeKind {
  OBJECT = "object",
  EVENT = "event",
  PLUGIN = "plugin",
  MODEL = "model",
  ENUM = "enum",
  DATA_SOURCE = "data_source",
  QUERY = "query",
  MUTATION = "mutation",
  SUBSCRIPTION = "subscription",
  SERVICE = "service"
}

export enum FieldType {
  STRING = "string",
  BOOLEAN = "boolean",
  FLOAT = "float",
  DECIMAL = "decimal",
  INTEGER = "integer",
  BIGINT = "bigint",
  DATE_TIME = "date_time",
  DATE = "date",
  TIME = "time",
  JSON = "json",
  REFERENCE = "reference",
  BYTES = "bytes",
  NULL = "null",
  ANY = "any"
}

export const Schema = v.object({
  name: v.string([v.toTrimmed()]),
  comments: v.optional(v.array(v.string([v.toTrimmed()])), [])
});

export const NodeSchema = v.intersect([
  Schema,
  v.object({
    kind: v.enum_(NodeKind)
  })
]);

export const FieldSchema = v.intersect([
  Schema,
  v.object({
    type: v.enum_(FieldType)
  })
]);

/*export const FieldReferenceSchema = v.intersect([
  FieldSchema,
  v.object({
    name: v.string([v.toTrimmed()]),
    type: v.literal(ReferenceType.FIELD)
  })
]);*/

/**
 * Attribute Schema
 */

export const AttributeArgFieldSchema = v.union([
  v.object({
    name: v.string([v.toTrimmed()]),
    type: v.literal(FieldType.STRING),
    value: v.string([v.toTrimmed()])
  }),
  v.object({
    name: v.string([v.toTrimmed()]),
    type: v.union([v.literal(FieldType.DECIMAL), v.literal(FieldType.FLOAT)]),
    value: v.number()
  }),
  v.object({
    name: v.string([v.toTrimmed()]),
    type: v.literal(FieldType.INTEGER),
    value: v.number([v.integer()])
  }),
  v.object({
    name: v.string([v.toTrimmed()]),
    type: v.literal(FieldType.BIGINT),
    value: v.bigint()
  }),
  v.object({
    name: v.string([v.toTrimmed()]),
    type: v.literal(FieldType.BOOLEAN),
    value: v.boolean()
  }),
  v.object({
    name: v.string([v.toTrimmed()]),
    type: v.literal(FieldType.REFERENCE),
    ref: NodeSchema,
    value: v.union([NodeSchema, FieldSchema])
  })
]);

export const AttributeArgSchema = v.object({
  name: v.string([v.toTrimmed()]),
  fields: v.optional(v.array(AttributeArgFieldSchema), [])
});

export const AttributeSchema = v.object({
  name: v.string([v.toTrimmed()]),
  args: v.optional(v.array(AttributeArgSchema), [])
});

/**
 * Enum Schemas
 */

export const EnumFieldSchema = v.union([
  v.intersect([
    FieldSchema,
    v.object({
      type: v.literal(FieldType.STRING),
      value: v.string([v.toTrimmed()])
    })
  ]),
  v.intersect([
    FieldSchema,
    v.object({
      type: v.literal(FieldType.INTEGER),
      value: v.number([v.integer()])
    })
  ])
]);

export const EnumSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.literal(NodeKind.ENUM),
    fields: v.optional(v.array(EnumFieldSchema), []),
    attributes: v.optional(v.array(AttributeSchema), [])
  })
]);

/**
 * Object Schemas
 */

export const BaseObjectFieldSchema = v.intersect([
  FieldSchema,
  v.object({
    defaultValue: v.optional(v.any()),
    isRequired: v.optional(v.boolean(), false),
    isArray: v.optional(v.boolean(), false),
    attributes: v.optional(v.array(AttributeSchema), [])
  })
]);

export const StringObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.STRING),
    defaultValue: v.optional(
      v.union([v.string([v.toTrimmed()]), v.array(v.string([v.toTrimmed()]))])
    ),
    includes: v.optional(v.string([v.toTrimmed()])),
    startsWith: v.optional(v.string([v.toTrimmed()])),
    endsWith: v.optional(v.string([v.toTrimmed()])),
    regex: v.optional(v.string([v.toTrimmed()])),
    minLength: v.optional(v.number([v.integer()])),
    maxLength: v.optional(v.number([v.integer()])),
    isEmpty: v.boolean(),
    isUrl: v.boolean(),
    isEmail: v.boolean(),
    isSemver: v.boolean(),
    isLatitude: v.boolean(),
    isLongitude: v.boolean(),
    isPostalCode: v.boolean(),
    isCountryCode: v.boolean(),
    isTimezone: v.boolean(),
    isPhoneNumber: v.boolean(),
    isIpAddress: v.boolean(),
    isMacAddress: v.boolean(),
    isDatetime: v.boolean(),
    isUuid: v.boolean(),
    isCuid: v.boolean(),
    isSnowflake: v.boolean(),
    isJwt: v.boolean(),
    isHexColor: v.boolean(),
    has: v.optional(v.array(v.string([v.toTrimmed()]))),
    hasEvery: v.optional(v.array(v.string([v.toTrimmed()]))),
    excluding: v.optional(v.array(v.string([v.toTrimmed()])))
  })
]);

export const NumberObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.union([
      v.literal(FieldType.DECIMAL),
      v.literal(FieldType.FLOAT),
      v.literal(FieldType.INTEGER),
      v.literal(FieldType.BIGINT)
    ]),
    defaultValue: v.optional(v.union([v.number(), v.array(v.number())])),
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    multipleOf: v.optional(v.number([v.integer()])),
    isPositive: v.boolean(),
    isNonnegative: v.boolean(),
    isNegative: v.boolean(),
    isNonpositive: v.boolean(),
    isFinite: v.boolean(),
    isSafe: v.boolean(),
    equals: v.optional(v.number()),
    gt: v.optional(v.number()),
    gte: v.optional(v.number()),
    lt: v.optional(v.number()),
    lte: v.optional(v.number()),
    has: v.optional(v.array(v.number())),
    hasEvery: v.optional(v.array(v.number())),
    excluding: v.optional(v.array(v.number()))
  })
]);

export const DecimalObjectFieldSchema = v.intersect([
  NumberObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.DECIMAL)
  })
]);

export const FloatObjectFieldSchema = v.intersect([
  NumberObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.FLOAT)
  })
]);

export const IntegerObjectFieldSchema = v.intersect([
  NumberObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.INTEGER),
    defaultValue: v.optional(
      v.union([v.number([v.integer()]), v.array(v.number([v.integer()]))])
    ),
    min: v.optional(v.number([v.integer()])),
    max: v.optional(v.number([v.integer()])),
    equals: v.optional(v.number([v.integer()])),
    gt: v.optional(v.number([v.integer()])),
    gte: v.optional(v.number([v.integer()])),
    lt: v.optional(v.number([v.integer()])),
    lte: v.optional(v.number([v.integer()])),
    has: v.optional(v.array(v.number([v.integer()]))),
    hasEvery: v.optional(v.array(v.number([v.integer()]))),
    excluding: v.optional(v.array(v.number([v.integer()])))
  })
]);

export const BigIntObjectFieldSchema = v.intersect([
  NumberObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.BIGINT),
    defaultValue: v.optional(v.union([v.bigint(), v.array(v.bigint())])),
    min: v.optional(v.bigint()),
    max: v.optional(v.bigint()),
    equals: v.optional(v.bigint()),
    gt: v.optional(v.bigint()),
    gte: v.optional(v.bigint()),
    lt: v.optional(v.bigint()),
    lte: v.optional(v.bigint()),
    has: v.optional(v.array(v.bigint())),
    hasEvery: v.optional(v.array(v.bigint())),
    excluding: v.optional(v.array(v.bigint()))
  })
]);

export const BooleanObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.BOOLEAN),
    defaultValue: v.optional(v.union([v.boolean(), v.array(v.boolean())])),
    has: v.optional(v.array(v.boolean())),
    hasEvery: v.optional(v.array(v.boolean())),
    excluding: v.optional(v.array(v.boolean()))
  })
]);

export const DateTimeObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.DATE_TIME),
    isNow: v.optional(v.boolean(), false),
    isPast: v.optional(v.boolean(), false),
    isFuture: v.optional(v.boolean(), false),
    isUpdatedAt: v.optional(v.boolean(), false),
    has: v.optional(v.array(v.date())),
    hasEvery: v.optional(v.array(v.date())),
    excluding: v.optional(v.array(v.date()))
  })
]);

export const DateObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.DATE)
  })
]);

export const TimeObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.TIME)
  })
]);

export const JsonObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.JSON)
  })
]);

export const BytesObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.BYTES)
  })
]);

export const ReferenceObjectFieldSchema = v.intersect([
  BaseObjectFieldSchema,
  v.object({
    type: v.literal(FieldType.REFERENCE),
    ref: NodeSchema,
    defaultValue: v.optional(v.union([NodeSchema, FieldSchema]))
  })
]);

export const ObjectFieldSchema = v.union([
  StringObjectFieldSchema,
  NumberObjectFieldSchema,
  IntegerObjectFieldSchema,
  BigIntObjectFieldSchema,
  BooleanObjectFieldSchema,
  DateTimeObjectFieldSchema,
  DateObjectFieldSchema,
  TimeObjectFieldSchema,
  JsonObjectFieldSchema,
  BytesObjectFieldSchema,
  ReferenceObjectFieldSchema
]);

export const RelationshipSchema = v.object({
  fields: v.array(FieldSchema),
  ref: NodeSchema,
  references: v.array(FieldSchema)
});

export const ObjectSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.literal(NodeKind.OBJECT),
    fields: v.array(BaseObjectFieldSchema),
    extends: v.optional(v.array(NodeSchema), []),
    isExtending: v.optional(v.boolean(), false),
    relationships: v.optional(v.array(RelationshipSchema), []),
    attributes: v.optional(v.array(AttributeSchema), [])
  })
]);

/**
 * Model Schemas
 */

export const ModelSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.literal(NodeKind.MODEL),
    tableName: v.string([v.toTrimmed()]),
    data: ObjectSchema,
    attributes: v.optional(v.array(AttributeSchema), [])
  })
]);

/**
 * Event Schemas
 */

export const EventSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.literal(NodeKind.EVENT),
    topic: v.string([v.toTrimmed()]),
    data: ObjectSchema,
    attributes: v.optional(v.array(AttributeSchema), [])
  })
]);

/**
 * Operation Schemas
 */

export const OperationSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.union([
      v.literal(NodeKind.QUERY),
      v.literal(NodeKind.MUTATION),
      v.literal(NodeKind.SUBSCRIPTION)
    ]),
    request: v.optional(ObjectSchema),
    response: v.object({
      ref: ObjectSchema,
      isArray: v.optional(v.boolean(), false)
    }),
    url: v.optional(v.string([v.toTrimmed()])),
    emits: v.optional(v.array(EventSchema), []),
    attributes: v.optional(v.array(AttributeSchema), [])
  })
]);

export const QuerySchema = v.intersect([
  OperationSchema,
  v.object({
    kind: v.literal(NodeKind.QUERY),
    isLive: v.optional(v.boolean(), false)
  })
]);

export const MutationSchema = v.intersect([
  OperationSchema,
  v.object({
    kind: v.literal(NodeKind.MUTATION)
  })
]);

export const SubscriptionSchema = v.intersect([
  OperationSchema,
  v.object({
    kind: v.literal(NodeKind.SUBSCRIPTION)
  })
]);

/**
 * Data Source Schema
 */

export enum DataSourceType {
  MYSQL = "mysql",
  MONGO_DB = "mongodb",
  SQLITE = "sqlite",
  POSTGRESQL = "postgresql",
  POSTGRES = "postgres",
  SQL_SERVER = "sqlserver",
  COCKROACH_DB = "cockroachdb",
  JDBC_SQL_SERVER = "jdbc:sqlserver"
}

export const DataSourceSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.literal(NodeKind.DATA_SOURCE),
    provider: v.enum_(DataSourceType),
    url: v.string([v.url(), v.toTrimmed()]),
    directUrl: v.optional(v.string([v.url(), v.toTrimmed()])),
    proxyUrl: v.optional(v.string([v.url(), v.toTrimmed()]))
  })
]);

/**
 * Plugin Schema
 */

export const PluginSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.literal(NodeKind.PLUGIN),
    provider: v.string([v.toTrimmed()]),
    dependencies: v.optional(v.array(v.string([v.toTrimmed()])), []),
    output: v.optional(v.string([v.toTrimmed()])),
    options: v.record(v.string([v.toTrimmed()]), v.any())
  })
]);

/**
 * Service Schema
 */

export const ServiceSchema = v.intersect([
  NodeSchema,
  v.object({
    kind: v.literal(NodeKind.SERVICE),
    imports: v.optional(v.array(v.string([v.toTrimmed()])), []),
    dataSource: DataSourceSchema,
    plugins: v.optional(v.array(PluginSchema), []),
    enums: v.optional(v.array(EnumSchema), []),
    objects: v.optional(v.array(ObjectSchema), []),
    models: v.optional(v.array(ModelSchema), []),
    events: v.optional(v.array(EventSchema), []),
    queries: v.optional(v.array(QuerySchema), []),
    mutations: v.optional(v.array(MutationSchema), []),
    subscriptions: v.optional(v.array(SubscriptionSchema), [])
  })
]);
