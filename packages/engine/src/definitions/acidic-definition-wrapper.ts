import {
  type AcidicEnum,
  type AcidicEnumField,
  type AcidicEvent,
  type AcidicFieldAttribute,
  type AcidicModel,
  type AcidicObject,
  type AcidicObjectAttribute,
  type AcidicObjectField,
  type AcidicOperation,
  type AcidicPlugin,
  type AcidicPluginField,
  type AcidicSchema,
  type AttributeArg,
  type Expression,
  isAcidicEnum,
  isAcidicEnumField,
  isAcidicModel,
  isAcidicMutation,
  isAcidicObject,
  isAcidicQuery,
  isAcidicSchema,
  isArrayExpr,
  isInvocationExpr,
  isLiteralExpr,
  isReferenceExpr
} from "@acidic/language";
import {
  AcidicDefinitionErrorCode,
  type AttributeArgDefinition,
  type AttributeArgFieldDefinition,
  type AttributeDefinition,
  type BooleanObjectFieldDefinition,
  type DataSourceDefinition,
  type DateTimeObjectFieldDefinition,
  type EnumDefinition,
  type EnumFieldDefinition,
  type EventDefinition,
  FieldType,
  type ModelDefinition,
  type MutationDefinition,
  NodeKind,
  type NumberObjectFieldDefinition,
  type ObjectDefinition,
  type ObjectFieldDefinition,
  type OperationDefinition,
  type PluginDefinition,
  type QueryDefinition,
  type ReferenceAttributeArgFieldDefinition,
  type ReferenceObjectFieldDefinition,
  type RelationshipDefinition,
  type ServiceDefinition,
  type StringObjectFieldDefinition,
  type SubscriptionDefinition,
  assertDataSource,
  assertEnum,
  assertEvent,
  assertModel,
  assertMutation,
  assertObject,
  assertPlugin,
  assertQuery,
  assertService,
  assertSubscription
} from "@acidic/definition";
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
  pascalCase
} from "@storm-stack/utilities";
import {
  getDataSource,
  getDataSourceDirectUrl,
  getDataSourceProvider,
  getDataSourceProxyUrl,
  getDataSourceUrl
} from "../utils/get-data-source-provider";
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
} from "../utils/language-utils";

/**
 * Serializes a StormDateTime into a string
 *
 * @param dateTime - The dateTime to serialize
 * @returns The serialized dateTime
 */
export function serializeAcidicDefinitionWrapper(schemaWrapper: AcidicDefinitionWrapper): string {
  return StormParser.stringify(schemaWrapper.service);
}

/**
 * Deserializes a string into a StormDateTime
 *
 * @param schemaString - The dateTime to deserialize
 * @returns The deserialized dateTime
 */
export function deserializeAcidicDefinitionWrapper(
  schemaString: JsonValue
): AcidicDefinitionWrapper {
  return isSetString(schemaString)
    ? AcidicDefinitionWrapper.loadDefinition(StormParser.parse(schemaString))
    : AcidicDefinitionWrapper.loadDefinition(schemaString as unknown as ServiceDefinition);
}

const stringifyObject = (record: Record<string, any>) => {
  const cache: string[] = [];
  const innerStringify = (obj: Record<string, any>) =>
    JSON.stringify(obj, (_, value) => {
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

/**
 * A wrapper of the and Date class used by Storm Software to provide Date-Time values
 *
 * @decorator `@Serializable()`
 */
@Serializable()
export class AcidicDefinitionWrapper {
  private _schema: AcidicSchema | undefined;

  private _service!: ServiceDefinition;
  private _plugins: PluginDefinition[] = [];
  private _objects: ObjectDefinition[] = [];
  private _models: ModelDefinition[] = [];
  private _enums: EnumDefinition[] = [];
  private _queries: QueryDefinition[] = [];
  private _mutations: MutationDefinition[] = [];
  private _subscriptions: SubscriptionDefinition[] = [];
  private _events: EventDefinition[] = [];

  public static loadDefinition = (
    param: AcidicSchema | ServiceDefinition
  ): AcidicDefinitionWrapper => {
    return new AcidicDefinitionWrapper(param);
  };

  public constructor(param: AcidicSchema | ServiceDefinition) {
    if (isAcidicSchema(param)) {
      this._schema = param;
      this.service = this._mapAcidicSchemaToDefinition(param);
    } else {
      this.service = param;
    }
  }

  public get service(): ServiceDefinition {
    return this._service;
  }

  public set service(_service: ServiceDefinition) {
    this._service = _service;

    this._plugins = this._service.plugins;
    this._objects = this._service.objects;
    this._models = this._service.models;
    this._enums = this._service.enums;
    this._queries = this._service.queries;
    this._mutations = this._service.mutations;
    this._subscriptions = this._service.subscriptions;
    this._events = this._service.events;
  }

  public addPlugin = (pluginDefinition: PluginDefinition) => {
    if (
      !this._plugins.some(
        (existing) => existing.name?.toUpperCase() === pluginDefinition.name?.toUpperCase()
      )
    ) {
      this._plugins.push(assertPlugin(pluginDefinition));
    }
  };

  public addObject = (schemaObject: ObjectDefinition) => {
    if (
      !this._objects.some(
        (existing) => existing.name?.toUpperCase() === schemaObject.name?.toUpperCase()
      )
    ) {
      this._objects.push(assertObject(schemaObject));
    }
  };

  public addModel = (schemaModel: ModelDefinition) => {
    if (
      !this._models.some(
        (existing) => existing.data.name?.toUpperCase() === schemaModel.data.name?.toUpperCase()
      )
    ) {
      this._models.push(assertModel(schemaModel));
    }
    this.addObject(schemaModel.data);
  };

  public addEvent = (schemaEvent: EventDefinition) => {
    if (
      !this._events.some(
        (existing) => existing.data.name?.toUpperCase() === schemaEvent.data.name?.toUpperCase()
      )
    ) {
      this._events.push(assertEvent(schemaEvent));
    }
    this.addObject(schemaEvent.data as ObjectDefinition);
  };

  public addEnum = (schemaEnum: EnumDefinition) => {
    if (
      !this._enums.some(
        (existing) => existing.name?.toUpperCase() === schemaEnum.name?.toUpperCase()
      )
    ) {
      this._enums.push(assertEnum(schemaEnum));
    }
  };

  public addQuery = (schemaQuery: QueryDefinition) => {
    if (
      !this._queries.some(
        (existing) => existing.name?.toUpperCase() === schemaQuery.name?.toUpperCase()
      )
    ) {
      this._queries.push(assertQuery(schemaQuery));
    }
  };

  public addMutation = (schemaMutation: MutationDefinition) => {
    if (
      !this._mutations.some(
        (existing) => existing.name?.toUpperCase() === schemaMutation.name?.toUpperCase()
      )
    ) {
      this._mutations.push(assertMutation(schemaMutation));
    }
  };

  public addSubscription = (schemaSubscription: SubscriptionDefinition) => {
    if (
      !this._subscriptions.some(
        (existing) => existing.name?.toUpperCase() === schemaSubscription.name?.toUpperCase()
      )
    ) {
      this._subscriptions.push(assertSubscription(schemaSubscription));
    }
  };

  private _mapAcidicSchemaToDefinition = (schema: AcidicSchema): ServiceDefinition => {
    const dataSource = getDataSource(schema);

    let dataSourceDefinition: DataSourceDefinition | undefined;
    if (dataSource?.name) {
      dataSourceDefinition = assertDataSource({
        kind: NodeKind.DATA_SOURCE,
        name: dataSource?.name,
        comments: dataSource?.comments ?? [],
        provider: getDataSourceProvider(schema),
        url: getDataSourceUrl(schema),
        directUrl: getDataSourceDirectUrl(schema),
        proxyUrl: getDataSourceProxyUrl(schema),
        attributes: []
      });
    }

    const acidicPlugins = getAcidicPlugins(schema);
    if (acidicPlugins.length > 0) {
      for (const acidicPlugin of acidicPlugins) {
        this.addPlugin(this._mapPlugin(acidicPlugin));
      }
    }

    const acidicEnums = getAcidicEnums(schema);
    if (acidicEnums.length > 0) {
      for (const acidicEnum of acidicEnums) {
        this.addEnum(this._mapEnum(acidicEnum));
      }
    }

    const acidicObjects = getAcidicObjects(schema);
    if (acidicObjects.length > 0) {
      for (const acidicObject of acidicObjects) {
        this.addObject(this._mapObject(acidicObject));
      }
    }

    const acidicModels = getAcidicModels(schema);
    if (acidicModels.length > 0) {
      for (const acidicModel of acidicModels) {
        this.addModel(this._mapModel(acidicModel));
      }
    }

    const acidicEvents = getAcidicEvents(schema);
    if (acidicEvents.length > 0) {
      for (const acidicEvent of acidicEvents) {
        this.addEvent(this._mapEvent(acidicEvent));
      }
    }

    for (const objectDefinition of this._objects) {
      objectDefinition.relationships = this._getRelationships(objectDefinition);
    }

    const acidicQueries = getAcidicQueries(schema);
    if (acidicQueries.length > 0) {
      for (const acidicQuery of acidicQueries) {
        for (const field of acidicQuery.fields) {
          this.addQuery(this._mapQuery(field));
        }
      }
    }

    const acidicMutations = getAcidicMutations(schema);
    if (acidicMutations.length > 0) {
      for (const acidicMutation of acidicMutations) {
        for (const field of acidicMutation.fields) {
          this.addMutation(this._mapMutation(field));
        }
      }
    }

    const acidicSubscriptions = getAcidicSubscriptions(schema);
    if (acidicSubscriptions.length > 0) {
      for (const acidicSubscription of acidicSubscriptions) {
        for (const field of acidicSubscription.fields) {
          this.addSubscription(this._mapSubscription(field));
        }
      }
    }

    this._service = assertService({
      kind: NodeKind.SERVICE,
      name: getServiceId(schema),
      comments: [],
      imports: schema.imports.map((acidicImport) => acidicImport.path),
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      dataSource: dataSourceDefinition!,
      plugins: this._plugins,
      enums: this._enums,
      objects: this._objects,
      models: this._models,
      queries: this._queries,
      mutations: this._mutations,
      subscriptions: this._subscriptions,
      events: this._events,
      attributes: []
    });

    return this._service;
  };

  private _mapQuery = (acidicOperation: AcidicOperation): QueryDefinition => {
    const query: QueryDefinition = {
      ...this._mapOperation(acidicOperation),
      kind: NodeKind.QUERY,
      isLive: false
    };

    query.isLive = !!query.attributes?.some((attr: AttributeDefinition) => attr.name === "live");

    return query;
  };

  private _mapMutation = (acidicOperation: AcidicOperation): MutationDefinition => {
    const mutation: MutationDefinition = {
      ...this._mapOperation(acidicOperation),
      kind: NodeKind.MUTATION
    };

    return mutation;
  };

  private _mapSubscription = (acidicOperation: AcidicOperation): SubscriptionDefinition => {
    const subscription: SubscriptionDefinition = {
      ...this._mapOperation(acidicOperation),
      kind: NodeKind.SUBSCRIPTION
    };

    return subscription;
  };

  private _mapOperation = (acidicOperation: AcidicOperation): OperationDefinition => {
    const operationInput: OperationDefinition = {
      name: acidicOperation.name,
      comments: acidicOperation.comments,
      kind: isAcidicQuery(acidicOperation.$container)
        ? NodeKind.QUERY
        : isAcidicMutation(acidicOperation.$container)
          ? NodeKind.MUTATION
          : NodeKind.SUBSCRIPTION,
      url: "",
      emits: [],
      response: {
        isArray: false,
        ref: this._mapObject(acidicOperation.result)
      },
      request: {
        kind: NodeKind.OBJECT,
        name: `${acidicOperation.name}Input`,
        comments: [
          `Object definition for representing the request sent to the ${acidicOperation.name} operation`
        ],
        fields: acidicOperation.params.map((param) =>
          this._mapObjectField(param as unknown as AcidicObjectField)
        ),
        attributes: acidicOperation.attributes.map(this._mapAttribute),
        extends: [],
        isExtending: false,
        relationships: []
      },
      attributes: acidicOperation.attributes.map(this._mapAttribute)
    } satisfies OperationDefinition;

    operationInput.response.ref?.comments?.push(
      `Object definition for representing the response sent to during the ${acidicOperation.name} operation`
    );

    if (operationInput.request?.fields) {
      operationInput.request.fields = operationInput.request.fields.map((field) => {
        const param = acidicOperation.params.find((p) => p.name === field.name);
        if (param) {
          field.defaultValue = param.defaultValue;
        }

        if (!field.comments?.length) {
          field.comments?.push(
            `The \`${field.name}\` parameter of the \`${field.name}\` server ${operationInput.kind} operation`
          );
        }

        return field;
      });
    }

    if (operationInput.attributes) {
      const urlAttribute = operationInput.attributes.find(
        (attr: AttributeDefinition) => attr.name === "url"
      );
      if (
        urlAttribute?.args &&
        urlAttribute.args.length > 0 &&
        urlAttribute.args[0]?.fields &&
        urlAttribute.args[0]?.fields.length > 0 &&
        urlAttribute.args[0]?.fields[0]?.value
      ) {
        operationInput.url = String(urlAttribute.args[0]?.fields[0]?.value);
      }
    }

    return operationInput;
  };

  private _mapObjectField = (acidicField: AcidicObjectField): ObjectFieldDefinition => {
    if (isAcidicObject(acidicField.$container)) {
      const objectDefinition = this._objects.find(
        (existing) => existing.name?.toUpperCase() === acidicField.$container.name?.toUpperCase()
      );
      if (objectDefinition) {
        const field = objectDefinition.fields.find(
          (existing) => existing.name?.toUpperCase() === acidicField.name?.toUpperCase()
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
        isAcidicModel(acidicField.type.reference?.ref) ||
        isAcidicEnum(acidicField.type.reference?.ref)
          ? FieldType.REFERENCE
          : acidicField.type.type?.toLowerCase() === "int"
            ? FieldType.INTEGER
            : (acidicField.type.type?.toLowerCase() as FieldType),
      comments: acidicField.comments ?? [],
      isArray: acidicField.type.array,
      isRequired: !acidicField.type.optional,
      attributes: acidicField.attributes?.map(this._mapAttribute) ?? []
    } satisfies ObjectFieldDefinition;

    if (
      isAcidicObject(acidicField.type.reference?.ref) ||
      isAcidicModel(acidicField.type.reference?.ref)
    ) {
      const referenceField: ReferenceObjectFieldDefinition =
        schemaField as ReferenceObjectFieldDefinition;
      referenceField.ref = this._mapObject(acidicField.type.reference?.ref as AcidicObject);

      // Add child object if it has not been added yet
      this.addObject(referenceField.ref as ObjectDefinition);

      return referenceField;
    }
    if (isAcidicEnum(acidicField.type.reference?.ref)) {
      const enumDefinitionField: ReferenceObjectFieldDefinition =
        schemaField as ReferenceObjectFieldDefinition;

      if (acidicField.type.reference?.ref) {
        enumDefinitionField.ref = this._mapEnum(acidicField.type.reference?.ref);
      }

      // Add child enum if it has not been added yet
      this.addEnum(enumDefinitionField.ref as EnumDefinition);
    } else if (schemaField.type === FieldType.STRING) {
      const stringField: StringObjectFieldDefinition = schemaField as StringObjectFieldDefinition;

      const includesAttribute = stringField.attributes?.find(
        (attr: AttributeDefinition) => attr.name === "includes"
      );
      if (
        includesAttribute?.args &&
        includesAttribute.args.length > 0 &&
        includesAttribute.args[0]?.fields &&
        includesAttribute.args[0]?.fields.length > 0 &&
        includesAttribute.args[0]?.fields[0]?.value
      ) {
        stringField.includes = String(includesAttribute.args[0]?.fields[0]?.value);
      }

      const startsWithAttribute = stringField.attributes?.find(
        (attr: AttributeDefinition) => attr.name === "startsWith"
      );
      if (
        startsWithAttribute?.args &&
        startsWithAttribute.args.length > 0 &&
        startsWithAttribute.args[0]?.fields &&
        startsWithAttribute.args[0]?.fields.length > 0 &&
        startsWithAttribute.args[0]?.fields[0]?.name
      ) {
        stringField.startsWith = String(startsWithAttribute.args[0]?.fields[0]?.name);
      }

      const endsWithAttribute = stringField.attributes?.find(
        (attr: AttributeDefinition) => attr.name === "endsWith"
      );
      if (
        endsWithAttribute?.args &&
        endsWithAttribute.args.length > 0 &&
        endsWithAttribute.args[0]?.fields &&
        endsWithAttribute.args[0]?.fields.length > 0 &&
        endsWithAttribute.args[0]?.fields[0]?.name
      ) {
        stringField.endsWith = String(endsWithAttribute.args[0]?.fields[0]?.name);
      }

      const regexAttribute = stringField.attributes?.find(
        (attr: AttributeDefinition) => attr.name === "regex"
      );
      if (
        regexAttribute?.args &&
        regexAttribute.args.length > 0 &&
        regexAttribute.args[0]?.fields &&
        regexAttribute.args[0]?.fields.length > 0 &&
        regexAttribute.args[0]?.fields[0]?.name
      ) {
        stringField.regex = String(regexAttribute.args[0]?.fields[0]?.name);
      }

      const lengthAttribute = stringField.attributes?.find(
        (attr: AttributeDefinition) => attr.name === "length"
      );
      if (
        lengthAttribute?.args &&
        lengthAttribute.args.length > 0 &&
        lengthAttribute.args[0]?.fields &&
        lengthAttribute.args[0]?.fields.length > 0 &&
        isSet(lengthAttribute.args[0]?.fields[0]?.value)
      ) {
        if (lengthAttribute.args.length === 1) {
          const length = Number(lengthAttribute.args[0]?.fields[0]?.value);
          stringField.minLength = length;
          stringField.maxLength = length;
        } else {
          stringField.minLength = Number(lengthAttribute.args[0]?.fields[0]?.value);

          if (
            lengthAttribute.args.length > 1 &&
            lengthAttribute.args[1]?.fields &&
            lengthAttribute.args[1]?.fields.length > 0 &&
            isSet(lengthAttribute.args[1]?.fields[0]?.value)
          ) {
            stringField.maxLength = Number(lengthAttribute.args[1]?.fields[0]?.value);
          }
        }
      } else {
        const minLengthAttribute = stringField.attributes?.find(
          (attr: AttributeDefinition) => attr.name === "minLength"
        );
        if (
          minLengthAttribute?.args &&
          minLengthAttribute.args.length > 0 &&
          minLengthAttribute.args[0]?.fields &&
          minLengthAttribute.args[0]?.fields.length > 0 &&
          isSet(minLengthAttribute.args[0]?.fields[0]?.value)
        ) {
          stringField.minLength = Number(minLengthAttribute.args[0]?.fields[0]?.value);
        }

        const maxLengthAttribute = stringField.attributes?.find(
          (attr: AttributeDefinition) => attr.name === "maxLength"
        );
        if (
          maxLengthAttribute?.args &&
          maxLengthAttribute.args.length > 0 &&
          maxLengthAttribute.args[0]?.fields &&
          maxLengthAttribute.args[0]?.fields.length > 0 &&
          isSet(maxLengthAttribute.args[0]?.fields[0]?.value)
        ) {
          stringField.maxLength = Number(maxLengthAttribute.args[0]?.fields[0]?.value);
        }
      }

      stringField.isEmpty = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "empty"
      );
      stringField.isUrl = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "url"
      );
      stringField.isEmail = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "email"
      );
      stringField.isSemver = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "semver"
      );
      stringField.isLatitude = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "latitude"
      );
      stringField.isLongitude = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "longitude"
      );
      stringField.isPostalCode = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "postalCode"
      );
      stringField.isCountryCode = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "countryCode"
      );
      stringField.isTimezone = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "timezone"
      );
      stringField.isPhoneNumber = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "phoneNumber"
      );
      stringField.isIpAddress = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "ip"
      );
      stringField.isMacAddress = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "mac"
      );
      stringField.isDatetime = stringField.attributes?.some(
        (attr: AttributeDefinition) => attr.name === "datetime"
      );

      if (stringField.isArray) {
        const hasAttribute = stringField.attributes?.find(
          (attr: AttributeDefinition) => attr.name === "has"
        );
        if (
          hasAttribute?.args &&
          hasAttribute.args.length > 0 &&
          hasAttribute.args[0]?.fields &&
          hasAttribute.args[0].fields.length > 0
        ) {
          stringField.has = hasAttribute.args.reduce(
            (ret: string[], arg: AttributeArgDefinition) => {
              if (
                arg.fields &&
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some((item: string) => item === String(arg.fields[0]?.value))
              ) {
                ret.push(String(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasAttribute.args[0].fields.length > 1) {
            stringField.has = hasAttribute.args[0].fields.reduce(
              (ret: string[], field: AttributeArgFieldDefinition) => {
                if (!ret.some((item: string) => item === String(field?.value))) {
                  ret.push(String(field?.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const hasEveryAttribute = stringField.attributes?.find(
          (attr: AttributeDefinition) => attr.name === "hasEvery"
        );
        if (
          hasEveryAttribute?.args &&
          hasEveryAttribute.args.length > 0 &&
          hasEveryAttribute.args[0]?.fields &&
          hasEveryAttribute.args[0].fields.length > 0
        ) {
          stringField.has = hasEveryAttribute.args.reduce(
            (ret: string[], arg: AttributeArgDefinition) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some((item: string) => item === String(arg.fields[0]?.value))
              ) {
                ret.push(String(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (hasEveryAttribute.args[0].fields.length > 1) {
            stringField.hasEvery = hasEveryAttribute.args[0].fields.reduce(
              (ret: string[], field: AttributeArgFieldDefinition) => {
                if (!ret.some((item: string) => item === String(field?.value))) {
                  ret.push(String(field?.value));
                }

                return ret;
              },
              []
            );
          }
        }

        const excludingAttribute = stringField.attributes?.find(
          (attr: AttributeDefinition) => attr.name === "exclude"
        );
        if (
          excludingAttribute?.args &&
          excludingAttribute.args.length > 0 &&
          excludingAttribute.args[0]?.fields &&
          excludingAttribute.args[0].fields.length > 0
        ) {
          stringField.excluding = excludingAttribute.args.reduce(
            (ret: string[], arg: AttributeArgDefinition) => {
              if (
                arg.fields.length > 0 &&
                arg.fields[0]?.value &&
                !ret.some((item: string) => item === String(arg.fields[0]?.value))
              ) {
                ret.push(String(arg.fields[0]?.value));
              }

              return ret;
            },
            []
          );

          if (excludingAttribute.args[0].fields.length > 1) {
            stringField.hasEvery = excludingAttribute.args[0].fields.reduce(
              (ret: string[], field: AttributeArgFieldDefinition) => {
                if (!ret.some((item: string) => item === String(field?.value))) {
                  ret.push(String(field?.value));
                }

                return ret;
              },
              []
            );
          }
        }
      }
    } else if (
      schemaField.type === FieldType.INTEGER ||
      schemaField.type === FieldType.BIGINT ||
      schemaField.type === FieldType.DECIMAL ||
      schemaField.type === FieldType.FLOAT
    ) {
      const numberField: NumberObjectFieldDefinition = schemaField as NumberObjectFieldDefinition;

      if (numberField.attributes) {
        const minAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "min"
        );
        if (
          minAttribute?.args &&
          minAttribute.args.length > 0 &&
          minAttribute.args[0]?.fields &&
          minAttribute.args[0]?.fields.length > 0 &&
          minAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.min = Number(minAttribute.args[0]?.fields[0]?.value);
        }

        const maxAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "max"
        );
        if (
          maxAttribute?.args &&
          maxAttribute.args.length > 0 &&
          maxAttribute.args[0]?.fields &&
          maxAttribute.args[0]?.fields.length > 0 &&
          maxAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.max = Number(maxAttribute.args[0]?.fields[0]?.value);
        }

        const multipleOfAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "multipleOf"
        );
        if (
          multipleOfAttribute?.args &&
          multipleOfAttribute.args.length > 0 &&
          multipleOfAttribute.args[0]?.fields &&
          multipleOfAttribute.args[0]?.fields.length > 0 &&
          multipleOfAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.multipleOf = Number(multipleOfAttribute.args[0]?.fields[0]?.value);
        }

        numberField.isPositive = numberField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "positive"
        );
        numberField.isNonnegative = numberField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "nonnegative"
        );
        numberField.isNegative = numberField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "negative"
        );
        numberField.isNonpositive = numberField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "nonpositive"
        );
        numberField.isFinite = numberField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "finite"
        );
        numberField.isSafe = numberField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "safe"
        );

        const gtAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "gt"
        );
        if (
          gtAttribute?.args &&
          gtAttribute.args.length > 0 &&
          gtAttribute.args[0]?.fields &&
          gtAttribute.args[0]?.fields.length > 0 &&
          gtAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.gt = Number(gtAttribute.args[0]?.fields[0]?.value);
        }

        const gteAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "gte"
        );
        if (
          gteAttribute?.args &&
          gteAttribute.args.length > 0 &&
          gteAttribute.args[0]?.fields &&
          gteAttribute.args[0]?.fields.length > 0 &&
          gteAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.gte = Number(gteAttribute.args[0]?.fields[0]?.value);
        }

        const ltAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "lt"
        );
        if (
          ltAttribute?.args &&
          ltAttribute.args.length > 0 &&
          ltAttribute.args[0]?.fields &&
          ltAttribute.args[0]?.fields.length > 0 &&
          ltAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.lt = Number(ltAttribute.args[0]?.fields[0]?.value);
        }

        const lteAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "lte"
        );
        if (
          lteAttribute?.args &&
          lteAttribute.args.length > 0 &&
          lteAttribute.args[0]?.fields &&
          lteAttribute.args[0]?.fields.length > 0 &&
          lteAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.lte = Number(lteAttribute.args[0]?.fields[0]?.value);
        }

        const equalsAttribute = numberField.attributes.find(
          (attr: AttributeDefinition) => attr.name === "equals"
        );
        if (
          equalsAttribute?.args &&
          equalsAttribute.args.length > 0 &&
          equalsAttribute.args[0]?.fields &&
          equalsAttribute.args[0]?.fields.length > 0 &&
          equalsAttribute.args[0]?.fields[0]?.value
        ) {
          numberField.lte = Number(equalsAttribute.args[0]?.fields[0]?.value);
        }

        if (numberField.isArray) {
          const hasAttribute = numberField.attributes.find(
            (attr: AttributeDefinition) => attr.name === "has"
          );
          if (
            hasAttribute?.args &&
            hasAttribute.args.length > 0 &&
            hasAttribute.args[0]?.fields &&
            hasAttribute.args[0].fields.length > 0
          ) {
            numberField.has = hasAttribute.args.reduce(
              (ret: number[], arg: AttributeArgDefinition) => {
                if (
                  arg.fields[0]?.value &&
                  !ret.some((item: number) => item === Number(arg.fields[0]?.value))
                ) {
                  ret.push(Number(arg.fields[0]?.value));
                }

                return ret;
              },
              []
            );

            if (hasAttribute.args[0].fields.length > 1) {
              numberField.has = hasAttribute.args[0].fields.reduce(
                (ret: number[], field: AttributeArgFieldDefinition) => {
                  if (!ret.some((item: number) => item === Number(field?.value))) {
                    ret.push(Number(field?.value));
                  }

                  return ret;
                },
                []
              );
            }
          }

          const hasEveryAttribute = numberField.attributes.find(
            (attr: AttributeDefinition) => attr.name === "hasEvery"
          );
          if (
            hasEveryAttribute?.args &&
            hasEveryAttribute.args.length > 0 &&
            hasEveryAttribute.args[0]?.fields &&
            hasEveryAttribute.args[0].fields.length > 0
          ) {
            numberField.has = hasEveryAttribute.args.reduce(
              (ret: number[], arg: AttributeArgDefinition) => {
                if (
                  arg.fields.length > 0 &&
                  arg.fields[0]?.value &&
                  !ret.some((item: number) => item === Number(arg.fields[0]?.value))
                ) {
                  ret.push(Number(arg.fields[0]?.value));
                }

                return ret;
              },
              []
            );

            if (hasEveryAttribute.args[0].fields.length > 1) {
              numberField.hasEvery = hasEveryAttribute.args[0].fields.reduce(
                (ret: number[], field: AttributeArgFieldDefinition) => {
                  if (!ret.some((item: number) => item === Number(field?.value))) {
                    ret.push(Number(field?.value));
                  }

                  return ret;
                },
                []
              );
            }
          }

          const excludingAttribute = numberField.attributes.find(
            (attr: AttributeDefinition) => attr.name === "exclude"
          );
          if (
            excludingAttribute?.args &&
            excludingAttribute.args.length > 0 &&
            excludingAttribute.args[0]?.fields &&
            excludingAttribute.args[0].fields.length > 0
          ) {
            numberField.excluding = excludingAttribute.args.reduce(
              (ret: number[], arg: AttributeArgDefinition) => {
                if (
                  arg.fields.length > 0 &&
                  arg.fields[0]?.value &&
                  !ret.some((item: number) => item === Number(arg.fields[0]?.value))
                ) {
                  ret.push(Number(arg.fields[0]?.value));
                }

                return ret;
              },
              []
            );

            if (excludingAttribute.args[0].fields.length > 1) {
              numberField.hasEvery = excludingAttribute.args[0].fields.reduce(
                (ret: number[], field: AttributeArgFieldDefinition) => {
                  if (!ret.some((item: number) => item === Number(field?.value))) {
                    ret.push(Number(field?.value));
                  }

                  return ret;
                },
                []
              );
            }
          }
        }
      }
    } else if (schemaField.type === FieldType.BOOLEAN) {
      const booleanField: BooleanObjectFieldDefinition =
        schemaField as BooleanObjectFieldDefinition;

      if (booleanField.attributes) {
        if (booleanField.isArray) {
          const hasAttribute = booleanField.attributes.find(
            (attr: AttributeDefinition) => attr.name === "has"
          );
          if (
            hasAttribute?.args &&
            hasAttribute.args.length > 0 &&
            hasAttribute.args[0]?.fields &&
            hasAttribute.args[0].fields.length > 0
          ) {
            booleanField.has = hasAttribute.args.reduce(
              (ret: boolean[], arg: AttributeArgDefinition) => {
                if (
                  arg.fields[0]?.value &&
                  !ret.some((item: boolean) => item === Boolean(arg.fields[0]?.value))
                ) {
                  ret.push(Boolean(arg.fields[0]?.value));
                }

                return ret;
              },
              []
            );

            if (hasAttribute.args[0].fields.length > 1) {
              booleanField.has = hasAttribute.args[0].fields.reduce(
                (ret: boolean[], field: AttributeArgFieldDefinition) => {
                  if (!ret.some((item: boolean) => item === Boolean(field?.value))) {
                    ret.push(Boolean(field?.value));
                  }

                  return ret;
                },
                []
              );
            }
          }

          const hasEveryAttribute = booleanField.attributes.find(
            (attr: AttributeDefinition) => attr.name === "hasEvery"
          );
          if (
            hasEveryAttribute?.args &&
            hasEveryAttribute.args.length > 0 &&
            hasEveryAttribute.args[0]?.fields &&
            hasEveryAttribute.args[0].fields.length > 0
          ) {
            booleanField.has = hasEveryAttribute.args.reduce(
              (ret: boolean[], arg: AttributeArgDefinition) => {
                if (
                  arg.fields.length > 0 &&
                  arg.fields[0]?.value &&
                  !ret.some((item: boolean) => item === Boolean(arg.fields[0]?.value))
                ) {
                  ret.push(Boolean(arg.fields[0]?.value));
                }

                return ret;
              },
              []
            );

            if (hasEveryAttribute.args[0].fields.length > 1) {
              booleanField.hasEvery = hasEveryAttribute.args[0].fields.reduce(
                (ret: boolean[], field: AttributeArgFieldDefinition) => {
                  if (!ret.some((item: boolean) => item === Boolean(field?.value))) {
                    ret.push(Boolean(field?.value));
                  }

                  return ret;
                },
                []
              );
            }
          }

          const excludingAttribute = booleanField.attributes.find(
            (attr: AttributeDefinition) => attr.name === "exclude"
          );
          if (
            excludingAttribute?.args &&
            excludingAttribute.args.length > 0 &&
            excludingAttribute.args[0]?.fields &&
            excludingAttribute.args[0].fields.length > 0
          ) {
            booleanField.excluding = excludingAttribute.args.reduce(
              (ret: boolean[], arg: AttributeArgDefinition) => {
                if (
                  arg.fields.length > 0 &&
                  arg.fields[0]?.value &&
                  !ret.some((item: boolean) => item === Boolean(arg.fields[0]?.value))
                ) {
                  ret.push(Boolean(arg.fields[0]?.value));
                }

                return ret;
              },
              []
            );

            if (excludingAttribute.args[0].fields.length > 1) {
              booleanField.hasEvery = excludingAttribute.args[0].fields.reduce(
                (ret: boolean[], field: AttributeArgFieldDefinition) => {
                  if (!ret.some((item: boolean) => item === Boolean(field?.value))) {
                    ret.push(Boolean(field?.value));
                  }

                  return ret;
                },
                []
              );
            }
          }
        }
      }
    } else if (
      schemaField.type === FieldType.DATE_TIME ||
      schemaField.type === FieldType.DATE ||
      schemaField.type === FieldType.TIME
    ) {
      const dateTimeField: DateTimeObjectFieldDefinition =
        schemaField as DateTimeObjectFieldDefinition;

      if (dateTimeField.attributes) {
        dateTimeField.isNow = dateTimeField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "now"
        );

        dateTimeField.isPast = dateTimeField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "past"
        );

        dateTimeField.isFuture = dateTimeField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "future"
        );

        dateTimeField.isUpdatedAt = dateTimeField.attributes.some(
          (attr: AttributeDefinition) => attr.name === "updatedAt"
        );
      }
    }

    const defaultAttribute = schemaField.attributes.find(
      (attr: AttributeDefinition) => attr.name === "default"
    );
    if (
      defaultAttribute?.args &&
      defaultAttribute.args.length > 0 &&
      defaultAttribute.args[0]?.fields &&
      defaultAttribute.args[0]?.fields.length > 0
    ) {
      if (schemaField.type === FieldType.BYTES || schemaField.type === FieldType.JSON) {
        throw new StormError(AcidicDefinitionErrorCode.invalid_attr_arg, {
          message: `Invalid default value for field ${schemaField.name}. Default values are not supported for ${schemaField.type} type fields.`
        });
      }

      if (
        schemaField.type === FieldType.DATE_TIME ||
        schemaField.type === FieldType.DATE ||
        schemaField.type === FieldType.TIME
      ) {
        const dateTimeField: DateTimeObjectFieldDefinition =
          schemaField as DateTimeObjectFieldDefinition;

        if (defaultAttribute.args[0]?.fields[0]?.value === "now") {
          dateTimeField.isNow = true;
        }
      } else if (
        schemaField.type === FieldType.STRING &&
        (defaultAttribute.args[0]?.fields[0]?.value === "uuid" ||
          defaultAttribute.args[0]?.fields[0]?.value === "cuid" ||
          defaultAttribute.args[0]?.fields[0]?.value === "snowflake")
      ) {
        const stringField: StringObjectFieldDefinition = schemaField as StringObjectFieldDefinition;

        if (defaultAttribute.args[0]?.fields[0]?.value === "uuid") {
          stringField.isUuid = true;
        } else if (defaultAttribute.args[0]?.fields[0]?.value === "cuid") {
          stringField.isCuid = true;
        } else if (defaultAttribute.args[0]?.fields[0]?.value === "snowflake") {
          stringField.isSnowflake = true;
        }
      } else if (
        schemaField.type === FieldType.STRING ||
        schemaField.type === FieldType.FLOAT ||
        schemaField.type === FieldType.DECIMAL ||
        schemaField.type === FieldType.INTEGER ||
        schemaField.type === FieldType.BIGINT ||
        schemaField.type === FieldType.BOOLEAN ||
        schemaField.type === FieldType.REFERENCE
      ) {
        (
          schemaField as
            | StringObjectFieldDefinition
            | BooleanObjectFieldDefinition
            | NumberObjectFieldDefinition
            | ReferenceObjectFieldDefinition
        ).defaultValue = defaultAttribute.args[0]?.fields[0]?.value as any;
      }
    }

    return schemaField as ObjectFieldDefinition;
  };

  private _getRelationships = (objectDefinition: ObjectDefinition): RelationshipDefinition[] => {
    const relationshipField = objectDefinition.fields.find((field) =>
      field.attributes.some((attr) => attr.name === "relationship")
    );
    if (relationshipField) {
      if (relationshipField.type === FieldType.REFERENCE) {
        const relationshipAttributes = relationshipField.attributes.filter(
          (attr) => attr.name === "relationship"
        );
        if (relationshipAttributes && relationshipAttributes.length > 0) {
          return relationshipAttributes.reduce(
            (ret: RelationshipDefinition[], relationshipAttribute: AttributeDefinition) => {
              if (relationshipAttribute.args.length > 0) {
                const fieldsArg = relationshipAttribute.args.find((arg) => arg.name === "fields");
                const referencesArg = relationshipAttribute.args.find(
                  (arg) => arg.name === "references"
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
                  const fieldNames = fieldsArg.fields.map((field) => field.name);
                  const referenceNames = referencesArg.fields.map((field) => field.name);
                  if (fieldNames.every(isString) && referenceNames.every(isString)) {
                    const relationshipObject: ObjectDefinition | undefined = this._objects.find(
                      (obj) => obj.name === relationshipField.name
                    );
                    if (relationshipObject) {
                      const schemaFields = relationshipObject.fields.filter((field) =>
                        fieldNames.some((fieldName) => fieldName === field.name)
                      );
                      if (schemaFields.length !== fieldNames.length) {
                        throw new StormError(AcidicDefinitionErrorCode.invalid_relationship, {
                          message: `Could not find some of the fields in the relationship on object ${objectDefinition.name}`
                        });
                      }
                      const referenceDefinitionFields = relationshipObject.fields.filter((field) =>
                        referenceNames.some((referenceName) => referenceName === field.name)
                      );
                      if (referenceDefinitionFields.length !== referenceNames.length) {
                        throw new StormError(AcidicDefinitionErrorCode.invalid_relationship, {
                          message: `Could not find some of the reference fields in the relationship on object ${objectDefinition.name}`
                        });
                      }

                      ret.push({
                        name: `${objectDefinition.name}To${relationshipObject.name}`,
                        comments: [],
                        fields: schemaFields,
                        ref: relationshipObject,
                        references: referenceDefinitionFields
                      });
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

  private _mapModel = (acidicModel: AcidicModel): ModelDefinition => {
    const objectInput: ObjectDefinition = this._mapObject(acidicModel as unknown as AcidicObject);

    const attributes = acidicModel.attributes.map(this._mapAttribute);

    let tableName = objectInput.name;
    if (attributes) {
      const tableAttribute = attributes.find((attr: AttributeDefinition) => attr.name === "table");
      if (
        tableAttribute?.args &&
        tableAttribute.args.length > 0 &&
        tableAttribute.args[0]?.fields &&
        tableAttribute.args[0].fields.length > 0
      ) {
        tableName = String(tableAttribute.args[0].fields[0]?.value);
      }
    }

    return {
      kind: NodeKind.MODEL,
      name: objectInput.name,
      comments: acidicModel.comments,
      tableName,
      data: objectInput,
      attributes
    };
  };

  private _mapEvent = (acidicEvent: AcidicEvent): EventDefinition => {
    const objectInput = this._mapObject(acidicEvent as unknown as AcidicObject);

    const attributes = acidicEvent.attributes.map(this._mapAttribute);

    let topic = objectInput.name;
    if (attributes) {
      const topicAttribute = attributes.find((attr: AttributeDefinition) => attr.name === "topic");
      if (
        topicAttribute?.args &&
        topicAttribute.args.length > 0 &&
        topicAttribute.args[0]?.fields &&
        topicAttribute.args[0].fields.length > 0
      ) {
        topic = String(topicAttribute.args[0].fields[0]?.value);
      }
    }

    return {
      name: objectInput.name,
      comments: objectInput.comments,
      kind: NodeKind.EVENT,
      topic,
      data: objectInput,
      attributes
    };
  };

  private _mapObject = (acidicObject: AcidicObject): ObjectDefinition => {
    let objectInput: ObjectDefinition | undefined = this._objects.find(
      (existing) => existing.name?.toUpperCase() === acidicObject.name?.toUpperCase()
    );
    if (objectInput) {
      return objectInput;
    }

    objectInput = {
      kind: NodeKind.OBJECT,
      name: acidicObject.name,
      comments: acidicObject.comments,
      fields: acidicObject.fields
        .filter(
          (field) =>
            !field.attributes.some(
              (fieldAttribute) =>
                fieldAttribute.decl?.ref?.name?.replaceAll("@", "")?.toLowerCase() === "relation"
            )
        )
        .map(this._mapObjectField),
      relationships: [],
      extends: [],
      isExtending: acidicObject.isExtending,
      attributes: acidicObject.attributes
        .filter((attribute) => attribute.decl.ref?.name?.replaceAll("@", "") !== "unique")
        .map(this._mapAttribute)
    };

    // const name = acidicAttribute.decl.ref?.name?.replaceAll("@", "") as string;

    this.addObject(objectInput as ObjectDefinition);

    return objectInput as ObjectDefinition;
  };

  private _mapPlugin = (acidicPlugin: AcidicPlugin): PluginDefinition => {
    let pluginInput: PluginDefinition | undefined = this._plugins.find(
      (existing) => existing.name?.toUpperCase() === acidicPlugin.name?.toUpperCase()
    );
    if (pluginInput) {
      return pluginInput;
    }

    const options = acidicPlugin.fields.reduce(
      (ret: Record<string, any>, field: AcidicPluginField) => {
        if (isLiteralExpr(field.value)) {
          ret[field.name] = field.value.value;
        }

        return ret;
      },
      {}
    );

    pluginInput = {
      kind: NodeKind.PLUGIN,
      name: acidicPlugin.name,
      comments: acidicPlugin.comments,
      provider: options.provider,
      output: options.output,
      options,
      dependencies: [] as string[],
      attributes: []
    };
    this.addPlugin(pluginInput as PluginDefinition);

    return pluginInput;
  };

  private _mapEnum = (acidicEnum: AcidicEnum): EnumDefinition => {
    let enumInput: EnumDefinition | undefined = this._enums.find(
      (existing) => existing.name?.toUpperCase() === acidicEnum.name?.toUpperCase()
    );
    if (enumInput) {
      return enumInput;
    }

    enumInput = {
      kind: NodeKind.ENUM,
      name: acidicEnum.name,
      comments: acidicEnum.comments,
      fields: acidicEnum.fields.map(this._mapEnumField)
    };
    this.addEnum(enumInput);

    return enumInput;
  };

  private _mapEnumField = (acidicEnumField: AcidicEnumField): EnumFieldDefinition => {
    return {
      name: constantCase(acidicEnumField.name) as string,
      comments: [],
      type: FieldType.STRING,
      value: acidicEnumField.name
    };
  };

  private _mapAttribute = (
    acidicAttribute: AcidicObjectAttribute | AcidicFieldAttribute
  ): AttributeDefinition => {
    const name = acidicAttribute.decl.ref?.name?.replaceAll("@", "") as string;
    const attributeDefinition: AttributeDefinition = {
      name,
      comments: [],
      args: acidicAttribute.args.map((arg: AttributeArg, i: number) => ({
        name: arg.name ? arg.name : `${pascalCase(name)}Arg${i}`,
        comments: [],
        fields: isArrayExpr(arg.value)
          ? arg.value.items.map(this._mapAttributeField)
          : [this._mapAttributeField(arg.value)]
      }))
    };

    return attributeDefinition;
  };

  private _mapAttributeField = (acidicAttributeField: Expression): AttributeArgFieldDefinition => {
    if (isLiteralExpr(acidicAttributeField)) {
      return {
        comments: [],
        type: isString(acidicAttributeField.value)
          ? FieldType.STRING
          : isNumber(acidicAttributeField.value)
            ? isInt(acidicAttributeField.value)
              ? FieldType.INTEGER
              : FieldType.DECIMAL
            : FieldType.BOOLEAN,
        value: acidicAttributeField.value
      } as AttributeArgFieldDefinition;
    }

    if (isReferenceExpr(acidicAttributeField)) {
      if (
        (!acidicAttributeField.target.ref || !isAcidicEnumField(acidicAttributeField.target.ref)) &&
        (!acidicAttributeField.target.ref ||
          !acidicAttributeField.target.ref.name ||
          !acidicAttributeField.target.ref.$containerProperty)
      ) {
        throw new StormError(AcidicDefinitionErrorCode.invalid_attr_arg, {
          message: `Unable to map reference to enum attribute field: \n${stringifyObject(
            acidicAttributeField
          )}`
        });
      }

      if (isAcidicEnumField(acidicAttributeField.target.ref)) {
        const ref: EnumDefinition = this._mapEnum(
          acidicAttributeField.target.ref.$container as AcidicEnum
        );
        const value = ref.fields?.find(
          (field) => field.name === acidicAttributeField.target.ref?.name
        ) as EnumFieldDefinition;

        return {
          type: FieldType.REFERENCE,
          comments: [],
          name: acidicAttributeField.target.ref.name,
          ref,
          value
        } as ReferenceAttributeArgFieldDefinition;
      }

      return {
        type: FieldType.REFERENCE,
        comments: [],
        name: (acidicAttributeField.$container.$container as AttributeArg)?.name as string,
        ref: this._mapObject(acidicAttributeField.target.ref.$container as AcidicObject),
        value: this._mapObjectField(acidicAttributeField.target.ref as AcidicObjectField)
      } as ReferenceAttributeArgFieldDefinition;
    }

    if (isInvocationExpr(acidicAttributeField)) {
      if (!acidicAttributeField.function.$refText) {
        throw new StormError(AcidicDefinitionErrorCode.invalid_attr_arg, {
          message: `Unable to map attribute field: \n${stringifyObject(acidicAttributeField)}`
        });
      }

      return {
        type: FieldType.STRING,
        comments: [],
        name: acidicAttributeField.function.$refText,
        value: acidicAttributeField.function.$refText
      };
    }

    throw new StormError(AcidicDefinitionErrorCode.invalid_attr_arg, {
      message: `Could not determine attribute field type: \n${stringifyObject(
        acidicAttributeField
      )}`
    });
  };
}
