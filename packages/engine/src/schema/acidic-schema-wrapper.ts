import {
  AcidicEnum,
  AcidicEnumField,
  AcidicEvent,
  AcidicFieldAttribute,
  AcidicModel,
  AcidicMutation,
  AcidicObject,
  AcidicObjectAttribute,
  AcidicObjectField,
  AcidicOperation,
  AcidicOperationInputParam,
  AcidicQuery,
  AcidicSubscription,
  AttributeArg,
  Expression,
  Model,
  Plugin,
  PluginField,
  isAcidicEnum,
  isAcidicEnumField,
  isAcidicEvent,
  isAcidicModel,
  isAcidicObject,
  isArrayExpr,
  isInvocationExpr,
  isLiteralExpr,
  isModel,
  isReferenceExpr
} from "@acidic/language";
import {
  AcidicSchemaErrorCode,
  AttributeArgSchema,
  AttributeFieldSchema,
  AttributeSchema,
  DataSourceSchema,
  EnumObjectFieldSchema,
  EnumSchema,
  EventSchema,
  ModelSchema,
  MutationSchema,
  ObjectFieldSchema,
  ObjectRelationshipSchema,
  ObjectSchema,
  OperationSchema,
  PluginSchema,
  QuerySchema,
  ReferenceObjectFieldSchema,
  ServiceSchema,
  StringEnumFieldSchema,
  SubscriptionSchema
} from "@acidic/schema";
import { StormError } from "@storm-stack/errors";
import type { JsonValue } from "@storm-stack/serialization";
import { Serializable, StormParser } from "@storm-stack/serialization";
import {
  constantCase,
  isInt,
  isNumber,
  isSet,
  isSetString,
  isString,
  upperCaseFirst
} from "@storm-stack/utilities";
import {
  getDataSource,
  getDataSourceProvider,
  getDataSourceUrl
} from "./get-data-source-provider";
import {
  getAcidicEnums,
  getAcidicEvents,
  getAcidicModels,
  getAcidicMutations,
  getAcidicObjects,
  getAcidicPlugins,
  getAcidicQueries,
  getAcidicSubscriptions,
  getServiceId
} from "./language-utils";

/**
 * Serializes a StormDateTime into a string
 *
 * @param dateTime - The dateTime to serialize
 * @returns The serialized dateTime
 */
export function serializeAcidicSchemaWrapper(
  schemaWrapper: AcidicSchemaWrapper
): string {
  return StormParser.stringify(schemaWrapper.service);
}

/**
 * Deserializes a string into a StormDateTime
 *
 * @param schemaString - The dateTime to deserialize
 * @returns The deserialized dateTime
 */
export function deserializeAcidicSchemaWrapper(
  schemaString: JsonValue
): AcidicSchemaWrapper {
  return isSetString(schemaString)
    ? AcidicSchemaWrapper.loadSchema(StormParser.parse(schemaString))
    : AcidicSchemaWrapper.loadSchema(schemaString as unknown as ServiceSchema);
}

const stringifyObject = (record: Record<string, any>) => {
  const cache: string[] = [];
  const innerStringify = (obj: Record<string, any>) =>
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return;

        // Store value in our collection
        cache.push(value);
      }
      return value;
    });

  return innerStringify(record);
};

/*@Serializable({
  serialize: serializeAcidicSchemaWrapper,
  deserialize: deserializeAcidicSchemaWrapper
})*/

/**
 * A wrapper of the and Date class used by Storm Software to provide Date-Time values
 *
 * @decorator `@Serializable()`
 */
@Serializable()
export class AcidicSchemaWrapper {
  #schema: Model | undefined;

  #service!: ServiceSchema;
  #plugins: PluginSchema[] = [];
  #objects: ObjectSchema[] = [];
  #models: ModelSchema[] = [];
  #enums: EnumSchema[] = [];
  #queries: QuerySchema[] = [];
  #mutations: OperationSchema[] = [];
  #subscriptions: OperationSchema[] = [];
  #events: EventSchema[] = [];

  public static loadSchema = (
    param: Model | ServiceSchema
  ): AcidicSchemaWrapper => {
    return new AcidicSchemaWrapper(param);
  };

  public constructor(param: Model | ServiceSchema) {
    if (isModel(param)) {
      this.#schema = param;
      this.service = this.mapModelToSchema(param);
    } else {
      this.service = param;
    }
  }

  public get service(): ServiceSchema {
    return this.#service;
  }

  public set service(_service: ServiceSchema) {
    this.#service = _service;

    this.#plugins = this.#service.plugins;
    this.#objects = this.#service.objects;
    this.#models = this.#service.models;
    this.#enums = this.#service.enums;
    this.#queries = this.#service.queries;
    this.#mutations = this.#service.mutations;
    this.#subscriptions = this.#service.subscriptions;
    this.#events = this.#service.events;
  }

  public addPlugin = (pluginSchema: PluginSchema) => {
    if (
      !this.#plugins.some(
        existing =>
          existing.name?.toUpperCase() === pluginSchema.name?.toUpperCase()
      )
    ) {
      this.#plugins.push(pluginSchema);
    }
  };

  public addObject = (schemaObject: ObjectSchema) => {
    if (
      !this.#objects.some(
        existing =>
          existing.name?.toUpperCase() === schemaObject.name?.toUpperCase()
      )
    ) {
      this.#objects.push(schemaObject);
    }
  };

  public addModel = (schemaModel: ModelSchema) => {
    if (
      !this.#models.some(
        existing =>
          existing.ref.name?.toUpperCase() ===
          schemaModel.ref.name?.toUpperCase()
      )
    ) {
      this.#models.push(schemaModel);
    }
    this.addObject(schemaModel.ref);
  };

  public addEvent = (schemaEvent: EventSchema) => {
    if (
      !this.#events.some(
        existing =>
          existing.data.ref.name?.toUpperCase() ===
          schemaEvent.data.ref.name?.toUpperCase()
      )
    ) {
      this.#events.push(schemaEvent);
    }
    this.addObject(schemaEvent.data.ref);
  };

  public addEnum = (schemaEnum: EnumSchema) => {
    if (
      !this.#enums.some(
        existing =>
          existing.name?.toUpperCase() === schemaEnum.name?.toUpperCase()
      )
    ) {
      this.#enums.push(schemaEnum);
    }
  };

  public addQuery = (schemaQuery: QuerySchema) => {
    if (
      !this.#queries.some(
        existing =>
          existing.name?.toUpperCase() === schemaQuery.name?.toUpperCase()
      )
    ) {
      this.#queries.push(schemaQuery);
    }
  };

  public addMutation = (schemaMutation: OperationSchema) => {
    if (
      !this.#mutations.some(
        existing =>
          existing.name?.toUpperCase() === schemaMutation.name?.toUpperCase()
      )
    ) {
      this.#mutations.push(schemaMutation);
    }
  };

  public addSubscription = (schemaSubscription: OperationSchema) => {
    if (
      !this.#subscriptions.some(
        existing =>
          existing.name?.toUpperCase() ===
          schemaSubscription.name?.toUpperCase()
      )
    ) {
      this.#subscriptions.push(schemaSubscription);
    }
  };

  private mapModelToSchema = (model: Model): ServiceSchema => {
    const dataSource = getDataSource(model);

    let dataSourceSchema: DataSourceSchema | undefined;
    if (dataSource?.name) {
      dataSourceSchema = {
        kind: "data_source",
        name: dataSource?.name,
        provider: getDataSourceProvider(model),
        url: getDataSourceUrl(model)
      };
    }

    const acidicPlugins = getAcidicPlugins(model);
    if (acidicPlugins.length > 0) {
      acidicPlugins.forEach((acidicPlugin: Plugin) => {
        this.addPlugin(this.mapAcidicPluginToPluginSchema(acidicPlugin));
      });
    }

    const acidicEnums = getAcidicEnums(model);
    if (acidicEnums.length > 0) {
      acidicEnums.forEach((acidicEnum: AcidicEnum) => {
        this.addEnum(this.mapAcidicEnumToEnumSchema(acidicEnum));
      });
    }

    const acidicObjects = getAcidicObjects(model);
    if (acidicObjects.length > 0) {
      acidicObjects.forEach((acidicObject: AcidicObject) => {
        this.addObject(this.mapAcidicObjectToObjectSchema(acidicObject));
      });
    }

    const acidicModels = getAcidicModels(model);
    if (acidicModels.length > 0) {
      acidicModels.forEach((acidicModel: AcidicModel) => {
        this.addModel(this.mapAcidicModelToModelSchema(acidicModel));
      });
    }

    const acidicEvents = getAcidicEvents(model);
    if (acidicEvents.length > 0) {
      acidicEvents.forEach((acidicEvent: AcidicEvent) => {
        this.addEvent(this.mapAcidicEventToEventSchema(acidicEvent));
      });
    }

    this.#objects.forEach((objectSchema: ObjectSchema) => {
      objectSchema.relationships = this.getObjectRelationships(objectSchema);
    });

    const acidicQueries = getAcidicQueries(model);
    if (acidicQueries.length > 0) {
      acidicQueries.forEach((acidicQuery: AcidicQuery) => {
        acidicQuery.fields
          .map(field => this.mapAcidicQueryToQuerySchema(field))
          .forEach(querySchema => this.addQuery(querySchema));
      });
    }

    const acidicMutations = getAcidicMutations(model);
    if (acidicMutations.length > 0) {
      acidicMutations.forEach((acidicMutation: AcidicMutation) => {
        acidicMutation.fields
          .map(field => this.mapAcidicMutationToMutationSchema(field))
          .forEach(operationSchema => this.addMutation(operationSchema));
      });
    }

    const acidicSubscriptions = getAcidicSubscriptions(model);
    if (acidicSubscriptions.length > 0) {
      acidicSubscriptions.forEach((acidicSubscriptions: AcidicSubscription) => {
        acidicSubscriptions.fields
          .map(field => this.mapAcidicSubscriptionToSubscriptionSchema(field))
          .forEach(operationSchema => this.addSubscription(operationSchema));
      });
    }

    this.#service = {
      kind: "service",
      name: getServiceId(model),
      imports: model.imports.map(acidicImport => acidicImport.path),
      dataSource: dataSourceSchema,
      plugins: this.#plugins,
      enums: this.#enums,
      objects: this.#objects,
      models: this.#models,
      queries: this.#queries,
      mutations: this.#mutations,
      subscriptions: this.#subscriptions,
      events: this.#events
    };

    return this.#service;
  };

  private mapAcidicQueryToQuerySchema = (
    acidicOperation: AcidicOperation
  ): QuerySchema => {
    const operationSchema: QuerySchema = {
      ...this.mapAcidicOperationToOperationSchema(acidicOperation),
      kind: "query",
      isLive: false
    };

    operationSchema.isLive = operationSchema.attributes.some(
      (attr: AttributeSchema) => attr.name === "live"
    );

    return operationSchema;
  };

  private mapAcidicMutationToMutationSchema = (
    acidicOperation: AcidicOperation
  ): MutationSchema => {
    const operationSchema: MutationSchema = {
      ...this.mapAcidicOperationToOperationSchema(acidicOperation),
      kind: "mutation"
    };

    return operationSchema;
  };

  private mapAcidicSubscriptionToSubscriptionSchema = (
    acidicOperation: AcidicOperation
  ): SubscriptionSchema => {
    const operationSchema: SubscriptionSchema = {
      ...this.mapAcidicOperationToOperationSchema(acidicOperation),
      kind: "subscription"
    };

    return operationSchema;
  };

  private mapAcidicOperationToOperationSchema = (
    acidicOperation: AcidicOperation
  ): OperationSchema => {
    const operationSchema = {
      name: acidicOperation.name,
      comments: acidicOperation.comments,
      response: {},
      attributes: acidicOperation.attributes.map(
        this.mapAcidicAttributeToAttributeSchema
      )
    } as OperationSchema;
    if (acidicOperation.params && acidicOperation.params.length > 0) {
      const operationSchema = {
        name: `${acidicOperation.name}Input`,
        comments: `Input object for representing the request sent to the ${acidicOperation.name} response`,
        fields: [] as ObjectFieldSchema[],
        attributes: []
      };

      operationSchema.fields = acidicOperation.params.reduce(
        (ret: ObjectFieldSchema[], param: AcidicOperationInputParam) => {
          if (
            isAcidicObject(param.type.reference?.ref) ||
            isAcidicModel(param.type.reference?.ref) ||
            isAcidicEvent(param.type.reference?.ref)
          ) {
            const inputObject = {
              name: param.name,
              type: "Object",
              comments: param.comments,
              ref: this.mapAcidicObjectToObjectSchema(
                param.type.reference?.ref as AcidicObject
              ),
              isArray: param.type.array,
              isRequired: !param.type.optional,
              attributes: []
            } satisfies ObjectFieldSchema;

            ret.push(inputObject);
          }

          return ret;
        },
        []
      );
    }

    const urlAttribute = operationSchema.attributes.find(
      (attr: AttributeSchema) => attr.name === "url"
    );
    if (
      urlAttribute &&
      urlAttribute.args.length > 0 &&
      urlAttribute.args[0]!.fields.length > 0 &&
      urlAttribute.args[0]!.fields[0]?.value
    ) {
      operationSchema.url = String(urlAttribute.args[0]?.fields[0]?.value);
    }

    /*if (isAcidicObject(acidicOperation.returns.type.reference?.ref) ||
    isAcidicModel(acidicOperation.returns.type.reference?.ref) ||
    isAcidicEvent(acidicOperation.returns.type.reference?.ref)) {
      const response: OperationResponseSchema = {
        __type: "Object",
        name: `${acidicOperation.name}Response`,
        comments: [`Response object for ${acidicOperation.name} operation`],
        fields: [] as ObjectFieldSchema[],
        relationships: [],
        extends: [],
        isExtend: false,
        attributes: []
      } satisfies ObjectSchema;

      if (
        acidicOperation.returns.length === 1 &&
        acidicOperation.returns[0] &&

      ) {
        const inputObject = acidicOperation.params[0].type.reference?.ref;
        if (inputObject) {
          const objectSchema = this.mapAcidicObjectToObjectSchema(
            inputObject as AcidicObject
          );

          input.attributes = objectSchema.attributes;
          input.fields = objectSchema.fields;
          input.relationships = objectSchema.relationships;
          input.extends = objectSchema.extends;
          input.isExtend = objectSchema.isExtend;
        }
      }
    }*/

    return operationSchema;
  };

  private mapAcidicObjectFieldToObjectFieldSchema = (
    acidicField: AcidicObjectField
  ): ObjectFieldSchema => {
    if (isAcidicObject(acidicField.$container)) {
      const objectSchema = this.#objects.find(
        existing =>
          existing.name?.toUpperCase() ===
          acidicField.$container.name?.toUpperCase()
      );
      if (objectSchema) {
        const field = objectSchema.fields.find(
          existing =>
            existing.name?.toUpperCase() === acidicField.name?.toUpperCase()
        );
        if (field) {
          return field;
        }
      }
    }

    const schemaField = {
      name: acidicField.name,
      type:
        isAcidicObject(acidicField.type.reference?.ref) ||
        isAcidicModel(acidicField.type.reference?.ref)
          ? "Object"
          : isAcidicEnum(acidicField.type.reference?.ref)
            ? "Enum"
            : acidicField.type.type,
      comments: acidicField.comments,
      isArray: acidicField.type.array,
      isRequired: !acidicField.type.optional,
      attributes: acidicField.attributes.map(
        this.mapAcidicAttributeToAttributeSchema
      )
    } as ObjectFieldSchema;

    if (
      isAcidicObject(acidicField.type.reference?.ref) ||
      isAcidicModel(acidicField.type.reference?.ref)
    ) {
      const referenceSchemaField = schemaField as ReferenceObjectFieldSchema;
      referenceSchemaField.ref = this.mapAcidicObjectToObjectSchema(
        acidicField.type.reference?.ref as AcidicObject
      );

      // Add child object if it has not been added yet
      this.addObject(referenceSchemaField.ref);

      return referenceSchemaField;
    } else if (isAcidicEnum(acidicField.type.reference?.ref)) {
      const enumSchemaField = schemaField as EnumObjectFieldSchema;

      enumSchemaField.ref = this.mapAcidicEnumToEnumSchema(
        acidicField.type.reference?.ref!
      );

      // Add child enum if it has not been added yet
      this.addEnum(enumSchemaField.ref);
    } else if (schemaField.type === "String") {
      const includesAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "includes"
      );
      if (
        includesAttribute &&
        includesAttribute.args.length > 0 &&
        includesAttribute.args[0]!.fields.length > 0 &&
        includesAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.includes = String(
          includesAttribute.args[0]!.fields[0]!.value
        );
      }

      const startsWithAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "startsWith"
      );
      if (
        startsWithAttribute &&
        startsWithAttribute.args.length > 0 &&
        startsWithAttribute.args[0]!.fields.length > 0 &&
        startsWithAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.startsWith = String(
          startsWithAttribute.args[0]!.fields[0]!.value
        );
      }

      const endsWithAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "endsWith"
      );
      if (
        endsWithAttribute &&
        endsWithAttribute.args.length > 0 &&
        endsWithAttribute.args[0]!.fields.length > 0 &&
        endsWithAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.endsWith = String(
          endsWithAttribute.args[0]!.fields[0]!.value
        );
      }

      const regexAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "regex"
      );
      if (
        regexAttribute &&
        regexAttribute.args.length > 0 &&
        regexAttribute.args[0]!.fields.length > 0 &&
        regexAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.regex = String(regexAttribute.args[0]!.fields[0]!.value);
      }

      const lengthAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "length"
      );
      if (
        lengthAttribute &&
        lengthAttribute.args.length > 0 &&
        lengthAttribute.args[0]!.fields.length > 0 &&
        isSet(lengthAttribute.args[0]!.fields[0]!.value)
      ) {
        if (lengthAttribute.args.length === 1) {
          const length = Number(lengthAttribute.args[0]!.fields[0]!.value);
          schemaField.minLength = length;
          schemaField.maxLength = length;
        } else {
          schemaField.minLength = Number(
            lengthAttribute.args[0]!.fields[0]!.value
          );

          if (
            lengthAttribute.args.length > 1 &&
            lengthAttribute.args[1]!.fields.length > 0 &&
            isSet(lengthAttribute.args[1]!.fields[0]!.value)
          ) {
            schemaField.maxLength = Number(
              lengthAttribute.args[1]!.fields[0]!.value
            );
          }
        }
      } else {
        const minLengthAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "minLength"
        );
        if (
          minLengthAttribute &&
          minLengthAttribute.args.length > 0 &&
          minLengthAttribute.args[0]!.fields.length > 0 &&
          isSet(minLengthAttribute.args[0]!.fields[0]!.value)
        ) {
          schemaField.minLength = Number(
            minLengthAttribute.args[0]!.fields[0]!.value
          );
        }

        const maxLengthAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "maxLength"
        );
        if (
          maxLengthAttribute &&
          maxLengthAttribute.args.length > 0 &&
          maxLengthAttribute.args[0]!.fields.length > 0 &&
          isSet(maxLengthAttribute.args[0]!.fields[0]!.value)
        ) {
          schemaField.maxLength = Number(
            maxLengthAttribute.args[0]!.fields[0]!.value
          );
        }
      }

      schemaField.isEmpty = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "empty"
      );
      schemaField.isUrl = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "url"
      );
      schemaField.isEmail = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "email"
      );
      schemaField.isSemver = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "semver"
      );
      schemaField.isLatitude = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "latitude"
      );
      schemaField.isLongitude = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "longitude"
      );
      schemaField.isPostalCode = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "postalCode"
      );
      schemaField.isCountryCode = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "countryCode"
      );
      schemaField.isTimezone = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "timezone"
      );
      schemaField.isPhoneNumber = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "phoneNumber"
      );
      schemaField.isIpAddress = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "ip"
      );
      schemaField.isMacAddress = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "mac"
      );
      schemaField.isDatetime = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "datetime"
      );

      if (schemaField.isArray) {
        const hasAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "has"
        );
        if (
          hasAttribute &&
          hasAttribute.args.length > 0 &&
          hasAttribute.args[0]?.fields &&
          hasAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasAttribute.args.reduce(
            (ret: string[], arg: AttributeArgSchema) => {
              if (
                arg.fields &&
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some(
                  (item: string) => item === String(arg.fields[0]?.value)
                )
              ) {
                ret.push(String(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasAttribute.args[0].fields.length > 1) {
            schemaField.has = hasAttribute.args[0].fields.reduce(
              (ret: string[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: string) => item === String(field?.value))
                ) {
                  ret.push(String(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const hasEveryAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "hasEvery"
        );
        if (
          hasEveryAttribute &&
          hasEveryAttribute.args.length > 0 &&
          hasEveryAttribute.args[0]?.fields &&
          hasEveryAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasEveryAttribute.args.reduce(
            (ret: string[], arg: AttributeArgSchema) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some(
                  (item: string) => item === String(arg.fields[0]?.value)
                )
              ) {
                ret.push(String(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasEveryAttribute.args[0].fields.length > 1) {
            schemaField.hasEvery = hasEveryAttribute.args[0].fields.reduce(
              (ret: string[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: string) => item === String(field!.value))
                ) {
                  ret.push(String(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const hasSomeAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "hasSome"
        );
        if (
          hasSomeAttribute &&
          hasSomeAttribute.args.length > 0 &&
          hasSomeAttribute.args[0]?.fields &&
          hasSomeAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasSomeAttribute.args.reduce(
            (ret: string[], arg: AttributeArgSchema) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some(
                  (item: string) => item === String(arg.fields[0]?.value)
                )
              ) {
                ret.push(String(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasSomeAttribute.args[0].fields.length > 1) {
            schemaField.hasEvery = hasSomeAttribute.args[0].fields.reduce(
              (ret: string[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: string) => item === String(field!.value))
                ) {
                  ret.push(String(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }
      }
    } else if (
      schemaField.type === "Int" ||
      schemaField.type === "BigInt" ||
      schemaField.type === "Decimal" ||
      schemaField.type === "Float"
    ) {
      const minAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "min"
      );
      if (
        minAttribute &&
        minAttribute.args.length > 0 &&
        minAttribute.args[0]!.fields.length > 0 &&
        minAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.min = Number(minAttribute.args[0]!.fields[0]!.value);
      }

      const maxAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "max"
      );
      if (
        maxAttribute &&
        maxAttribute.args.length > 0 &&
        maxAttribute.args[0]!.fields.length > 0 &&
        maxAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.max = Number(maxAttribute.args[0]!.fields[0]!.value);
      }

      const multipleOfAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "multipleOf"
      );
      if (
        multipleOfAttribute &&
        multipleOfAttribute.args.length > 0 &&
        multipleOfAttribute.args[0]!.fields.length > 0 &&
        multipleOfAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.multipleOf = Number(
          multipleOfAttribute.args[0]!.fields[0]!.value
        );
      }

      schemaField.isPositive = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "positive"
      );
      schemaField.isNonnegative = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "nonnegative"
      );
      schemaField.isNegative = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "negative"
      );
      schemaField.isNonpositive = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "nonpositive"
      );
      schemaField.isFinite = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "finite"
      );
      schemaField.isSafe = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "safe"
      );

      const gtAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "gt"
      );
      if (
        gtAttribute &&
        gtAttribute.args.length > 0 &&
        gtAttribute.args[0]!.fields.length > 0 &&
        gtAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.gt = Number(gtAttribute.args[0]!.fields[0]!.value);
      }

      const gteAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "gte"
      );
      if (
        gteAttribute &&
        gteAttribute.args.length > 0 &&
        gteAttribute.args[0]!.fields.length > 0 &&
        gteAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.gte = Number(gteAttribute.args[0]!.fields[0]!.value);
      }

      const ltAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "lt"
      );
      if (
        ltAttribute &&
        ltAttribute.args.length > 0 &&
        ltAttribute.args[0]!.fields.length > 0 &&
        ltAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.lt = Number(ltAttribute.args[0]!.fields[0]!.value);
      }

      const lteAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "lte"
      );
      if (
        lteAttribute &&
        lteAttribute.args.length > 0 &&
        lteAttribute.args[0]!.fields.length > 0 &&
        lteAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.lte = Number(lteAttribute.args[0]!.fields[0]!.value);
      }

      const equalsAttribute = schemaField.attributes.find(
        (attr: AttributeSchema) => attr.name === "equals"
      );
      if (
        equalsAttribute &&
        equalsAttribute.args.length > 0 &&
        equalsAttribute.args[0]!.fields.length > 0 &&
        equalsAttribute.args[0]!.fields[0]!.value
      ) {
        schemaField.lte = Number(equalsAttribute.args[0]!.fields[0]!.value);
      }

      if (schemaField.isArray) {
        const hasAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "has"
        );
        if (
          hasAttribute &&
          hasAttribute.args.length > 0 &&
          hasAttribute.args[0]?.fields &&
          hasAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasAttribute.args.reduce(
            (ret: number[], arg: AttributeArgSchema) => {
              if (
                arg.fields[0]?.value &&
                !ret.some(
                  (item: number) => item === Number(arg.fields[0]?.value)
                )
              ) {
                ret.push(Number(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasAttribute.args[0].fields.length > 1) {
            schemaField.has = hasAttribute.args[0].fields.reduce(
              (ret: number[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: number) => item === Number(field!.value))
                ) {
                  ret.push(Number(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const hasEveryAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "hasEvery"
        );
        if (
          hasEveryAttribute &&
          hasEveryAttribute.args.length > 0 &&
          hasEveryAttribute.args[0]?.fields &&
          hasEveryAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasEveryAttribute.args.reduce(
            (ret: number[], arg: AttributeArgSchema) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some(
                  (item: number) => item === Number(arg.fields[0]?.value)
                )
              ) {
                ret.push(Number(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasEveryAttribute.args[0].fields.length > 1) {
            schemaField.hasEvery = hasEveryAttribute.args[0].fields.reduce(
              (ret: number[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: number) => item === Number(field!.value))
                ) {
                  ret.push(Number(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const hasSomeAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "hasSome"
        );
        if (
          hasSomeAttribute &&
          hasSomeAttribute.args.length > 0 &&
          hasSomeAttribute.args[0]?.fields &&
          hasSomeAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasSomeAttribute.args.reduce(
            (ret: number[], arg: AttributeArgSchema) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some(
                  (item: number) => item === Number(arg.fields[0]?.value)
                )
              ) {
                ret.push(Number(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasSomeAttribute.args[0].fields.length > 1) {
            schemaField.hasEvery = hasSomeAttribute.args[0].fields.reduce(
              (ret: number[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: number) => item === Number(field!.value))
                ) {
                  ret.push(Number(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }
      }
    } else if (schemaField.type === "Boolean") {
      if (schemaField.isArray) {
        const hasAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "has"
        );
        if (
          hasAttribute &&
          hasAttribute.args.length > 0 &&
          hasAttribute.args[0]?.fields &&
          hasAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasAttribute.args.reduce(
            (ret: boolean[], arg: AttributeArgSchema) => {
              if (
                arg.fields[0]?.value &&
                !ret.some(
                  (item: boolean) => item === Boolean(arg.fields[0]?.value)
                )
              ) {
                ret.push(Boolean(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasAttribute.args[0].fields.length > 1) {
            schemaField.has = hasAttribute.args[0].fields.reduce(
              (ret: boolean[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: boolean) => item === Boolean(field!.value))
                ) {
                  ret.push(Boolean(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const hasEveryAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "hasEvery"
        );
        if (
          hasEveryAttribute &&
          hasEveryAttribute.args.length > 0 &&
          hasEveryAttribute.args[0]?.fields &&
          hasEveryAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasEveryAttribute.args.reduce(
            (ret: boolean[], arg: AttributeArgSchema) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some(
                  (item: boolean) => item === Boolean(arg.fields[0]?.value)
                )
              ) {
                ret.push(Boolean(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasEveryAttribute.args[0].fields.length > 1) {
            schemaField.hasEvery = hasEveryAttribute.args[0].fields.reduce(
              (ret: boolean[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: boolean) => item === Boolean(field!.value))
                ) {
                  ret.push(Boolean(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const hasSomeAttribute = schemaField.attributes.find(
          (attr: AttributeSchema) => attr.name === "hasSome"
        );
        if (
          hasSomeAttribute &&
          hasSomeAttribute.args.length > 0 &&
          hasSomeAttribute.args[0]?.fields &&
          hasSomeAttribute.args[0].fields.length > 0
        ) {
          schemaField.has = hasSomeAttribute.args.reduce(
            (ret: boolean[], arg: AttributeArgSchema) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some(
                  (item: boolean) => item === Boolean(arg.fields[0]?.value)
                )
              ) {
                ret.push(Boolean(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasSomeAttribute.args[0].fields.length > 1) {
            schemaField.hasEvery = hasSomeAttribute.args[0].fields.reduce(
              (ret: boolean[], field: AttributeFieldSchema) => {
                if (
                  !ret.some((item: boolean) => item === Boolean(field!.value))
                ) {
                  ret.push(Boolean(field!.value));
                }

                return ret;
              },
              []
            );
          }
        }
      }
    } else if (
      schemaField.type === "DateTime" ||
      schemaField.type === "Date" ||
      schemaField.type === "Time"
    ) {
      schemaField.isNow = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "now"
      );

      schemaField.isUpdatedAt = schemaField.attributes.some(
        (attr: AttributeSchema) => attr.name === "updatedAt"
      );
    }

    const defaultAttribute = schemaField.attributes.find(
      (attr: AttributeSchema) => attr.name === "default"
    );
    if (
      defaultAttribute &&
      defaultAttribute.args.length > 0 &&
      defaultAttribute.args[0]!.fields.length > 0
    ) {
      if (
        schemaField.type === "Object" ||
        schemaField.type === "Bytes" ||
        schemaField.type === "Json"
      ) {
        throw new StormError(AcidicSchemaErrorCode.invalid_attr_arg, {
          message: `Invalid default value for field ${schemaField.name}. Default values are not supported for ${schemaField.type} type fields.`
        });
      }

      if (
        schemaField.type === "DateTime" ||
        schemaField.type === "Date" ||
        schemaField.type === "Time"
      ) {
        if (defaultAttribute.args[0]!.fields[0]!.value === "now") {
          schemaField.isNow = true;
        }
      } else if (
        schemaField.type === "String" &&
        (defaultAttribute.args[0]!.fields[0]!.value === "uuid" ||
          defaultAttribute.args[0]!.fields[0]!.value === "cuid" ||
          defaultAttribute.args[0]!.fields[0]!.value === "snowflake")
      ) {
        if (defaultAttribute.args[0]!.fields[0]!.value === "uuid") {
          schemaField.isUuid = true;
        } else if (defaultAttribute.args[0]!.fields[0]!.value === "cuid") {
          schemaField.isCuid = true;
        } else if (defaultAttribute.args[0]!.fields[0]!.value === "snowflake") {
          schemaField.isSnowflake = true;
        }
      } else {
        schemaField.defaultValue = defaultAttribute.args[0]!.fields[0]!.value;
      }
    }

    return schemaField;
  };

  private getObjectRelationships = (
    objectSchema: ObjectSchema
  ): ObjectRelationshipSchema[] => {
    const relationshipField = objectSchema.fields.find(field =>
      field.attributes.some(attr => attr.name === "relationship")
    );
    if (relationshipField) {
      if (relationshipField.type === "Object") {
        const relationshipAttributes = relationshipField.attributes.filter(
          attr => attr.name === "relationship"
        );
        if (relationshipAttributes && relationshipAttributes.length > 0) {
          return relationshipAttributes.reduce(
            (
              ret: ObjectRelationshipSchema[],
              relationshipAttribute: AttributeSchema
            ) => {
              if (relationshipAttribute.args.length > 0) {
                const fieldsArg = relationshipAttribute.args.find(
                  arg => arg.name === "fields"
                );
                const referencesArg = relationshipAttribute.args.find(
                  arg => arg.name === "references"
                );
                if (
                  fieldsArg?.fields &&
                  Array.isArray(fieldsArg.fields) &&
                  fieldsArg.fields.length &&
                  referencesArg?.fields &&
                  Array.isArray(referencesArg.fields) &&
                  referencesArg.fields.length &&
                  fieldsArg.fields.length === referencesArg.fields.length
                ) {
                  const fieldNames = fieldsArg.fields.map(field => field.value);
                  const referenceNames = referencesArg.fields.map(
                    field => field.value
                  );
                  if (
                    fieldNames.every(isString) &&
                    referenceNames.every(isString)
                  ) {
                    const relationshipObject = this.#objects.find(
                      obj => obj.name === relationshipField.name
                    );
                    if (relationshipObject) {
                      const schemaFields = relationshipObject.fields.filter(
                        field =>
                          fieldNames.some(fieldName => fieldName === field.name)
                      );
                      if (schemaFields.length !== fieldNames.length) {
                        throw new StormError(
                          AcidicSchemaErrorCode.invalid_relationship,
                          {
                            message: `Could not find some of the fields in the relationship on object ${objectSchema.name}`
                          }
                        );
                      }
                      const referenceSchemaFields =
                        relationshipObject.fields.filter(field =>
                          referenceNames.some(
                            referenceName => referenceName === field.name
                          )
                        );
                      if (
                        referenceSchemaFields.length !== referenceNames.length
                      ) {
                        throw new StormError(
                          AcidicSchemaErrorCode.invalid_relationship,
                          {
                            message: `Could not find some of the reference fields in the relationship on object ${objectSchema.name}`
                          }
                        );
                      }

                      const relationship: ObjectRelationshipSchema = {
                        kind: "relationship",
                        name: `${upperCaseFirst(
                          objectSchema.name
                        )}To${upperCaseFirst(relationshipObject.name)}`,
                        fields: schemaFields,
                        ref: relationshipObject,
                        references: referenceSchemaFields
                      };

                      ret.push(relationship);
                    }
                  }
                }
              }

              return ret;
            },
            []
          );
        }
      }
    }

    return [];
  };

  private mapAcidicModelToModelSchema = (
    acidicModel: AcidicModel
  ): ModelSchema => {
    const objectSchema = this.mapAcidicObjectToObjectSchema(
      acidicModel as unknown as AcidicObject
    );

    let tableName = objectSchema.name;
    const tableAttribute = objectSchema.attributes.find(
      (attr: AttributeSchema) => attr.name === "table"
    );
    if (
      tableAttribute &&
      tableAttribute.args.length > 0 &&
      tableAttribute.args[0]?.fields &&
      tableAttribute.args[0].fields.length > 0
    ) {
      tableName = String(tableAttribute.args[0].fields[0]!.value);
    }

    return {
      kind: "model",
      name: objectSchema.name,
      tableName,
      ref: objectSchema
    };
  };

  private mapAcidicEventToEventSchema = (
    acidicEvent: AcidicEvent
  ): EventSchema => {
    const objectSchema = this.mapAcidicObjectToObjectSchema(
      acidicEvent as unknown as AcidicObject
    );

    let topic = objectSchema.name;
    const topicAttribute = objectSchema.attributes.find(
      (attr: AttributeSchema) => attr.name === "topic"
    );
    if (
      topicAttribute &&
      topicAttribute.args.length > 0 &&
      topicAttribute.args[0]?.fields &&
      topicAttribute.args[0].fields.length > 0
    ) {
      topic = String(topicAttribute.args[0].fields[0]!.value);
    }

    return {
      name: objectSchema.name,
      kind: "event",
      topic,
      data: {
        ref: objectSchema,
        isArray: false
      }
    };
  };

  private mapAcidicObjectToObjectSchema = (
    acidicObject: AcidicObject
  ): ObjectSchema => {
    let objectSchema: ObjectSchema | undefined = this.#objects.find(
      existing =>
        existing.name?.toUpperCase() === acidicObject.name?.toUpperCase()
    );
    if (objectSchema) {
      return objectSchema;
    }

    objectSchema = {
      kind: "object",
      name: acidicObject.name,
      comments: acidicObject.comments,
      fields: acidicObject.fields
        .filter(
          field =>
            !field.attributes.some(
              fieldAttribute =>
                fieldAttribute.decl?.ref?.name
                  ?.replaceAll("@", "")
                  ?.toLowerCase() === "relation"
            )
        )
        .map(this.mapAcidicObjectFieldToObjectFieldSchema),
      relationships: [],
      extends: [],
      isExtend: acidicObject.isExtend,
      attributes: acidicObject.attributes.map(
        this.mapAcidicAttributeToAttributeSchema
      )
    };
    this.addObject(objectSchema);

    return objectSchema;
  };

  private mapAcidicPluginToPluginSchema = (
    acidicPlugin: Plugin
  ): PluginSchema => {
    let pluginSchema: PluginSchema | undefined = this.#plugins.find(
      existing =>
        existing.name?.toUpperCase() === acidicPlugin.name?.toUpperCase()
    );
    if (pluginSchema) {
      return pluginSchema;
    }

    const options = acidicPlugin.fields.reduce(
      (ret: Record<string, any>, field: PluginField) => {
        if (isLiteralExpr(field.value)) {
          ret[field.name] = field.value.value;
        }

        return ret;
      },
      {}
    );

    pluginSchema = {
      kind: "plugin",
      name: acidicPlugin.name,
      options,
      provider: options.provider,
      output: options.output,
      dependencyOf: null,
      dependencies: []
    };
    this.addPlugin(pluginSchema);

    return pluginSchema;
  };

  private mapAcidicEnumToEnumSchema = (acidicEnum: AcidicEnum): EnumSchema => {
    let enumSchema: EnumSchema | undefined = this.#enums.find(
      existing =>
        existing.name?.toUpperCase() === acidicEnum.name?.toUpperCase()
    );
    if (enumSchema) {
      return enumSchema;
    }

    enumSchema = {
      kind: "enum",
      name: acidicEnum.name,
      comments: acidicEnum.comments,
      fields: acidicEnum.fields.map(this.mapAcidicEnumFieldToEnumFieldSchema),
      attributes: acidicEnum.attributes.map(
        this.mapAcidicAttributeToAttributeSchema
      )
    };
    this.addEnum(enumSchema);

    return enumSchema;
  };

  private mapAcidicEnumFieldToEnumFieldSchema = (
    acidicEnumField: AcidicEnumField
  ): StringEnumFieldSchema => {
    return {
      name: acidicEnumField.name,
      type: "String",
      value: constantCase(acidicEnumField.name)!
    };
  };

  private mapAcidicAttributeToAttributeSchema = (
    acidicAttribute: AcidicObjectAttribute | AcidicFieldAttribute
  ): AttributeSchema => {
    const attributeSchema: AttributeSchema = {
      name: acidicAttribute.decl.ref?.name?.replaceAll("@", "")!,
      args: acidicAttribute.args.map((arg: AttributeArg) => ({
        name: arg.name,
        fields: isArrayExpr(arg.value)
          ? arg.value.items.map(
              this.mapAcidicAttributeFieldToAttributeFieldSchema
            )
          : [this.mapAcidicAttributeFieldToAttributeFieldSchema(arg.value)]
      }))
    };

    return attributeSchema;
  };

  private mapAcidicAttributeFieldToAttributeFieldSchema = (
    acidicAttributeField: Expression
  ): AttributeFieldSchema => {
    if (isLiteralExpr(acidicAttributeField)) {
      return {
        type: isString(acidicAttributeField.value)
          ? "String"
          : isNumber(acidicAttributeField.value)
            ? isInt(acidicAttributeField.value)
              ? "Int"
              : "Decimal"
            : "Boolean",
        value: acidicAttributeField.value
      } as AttributeFieldSchema;
    } else if (isReferenceExpr(acidicAttributeField)) {
      if (
        (!acidicAttributeField.target.ref ||
          !isAcidicEnumField(acidicAttributeField.target.ref)) &&
        (!acidicAttributeField.target.ref ||
          !acidicAttributeField.target.ref.name ||
          !acidicAttributeField.target.ref.$containerProperty)
      ) {
        throw new StormError(AcidicSchemaErrorCode.invalid_attr_arg, {
          message: `Unable to map reference to enum attribute field: \n${stringifyObject(
            acidicAttributeField
          )}`
        });
      }

      if (isAcidicEnumField(acidicAttributeField.target.ref)) {
        const ref = this.mapAcidicEnumToEnumSchema(
          acidicAttributeField.target.ref.$container as AcidicEnum
        );
        const value = ref.fields.find(
          field => field.name === acidicAttributeField.target.ref?.name
        );

        return {
          type: "Enum",
          name: acidicAttributeField.target.ref.name,
          ref,
          value: value!
        };
      } else {
        return {
          type: "Field",
          name: (acidicAttributeField.$container.$container as AttributeArg)
            ?.name,
          value: acidicAttributeField.target.ref.name
        };
      }
    } else if (isInvocationExpr(acidicAttributeField)) {
      if (!acidicAttributeField.function.$refText) {
        throw new StormError(AcidicSchemaErrorCode.invalid_attr_arg, {
          message: `Unable to map attribute field: \n${stringifyObject(
            acidicAttributeField
          )}`
        });
      }

      return {
        type: "String",
        name: acidicAttributeField.function.$refText,
        value: acidicAttributeField.function.$refText
      };
    }

    throw new StormError(AcidicSchemaErrorCode.invalid_attr_arg, {
      message: `Could not determine attribute field type: \n${stringifyObject(
        acidicAttributeField
      )}`
    });
  };
}
