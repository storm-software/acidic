import { createStormError } from "@storm-stack/errors";
import {
  type AcidicContext,
  type TemplateDetails,
  type TypescriptGenerator,
  AcidicErrorCode
} from "@acidic/engine";
import { type DrizzlePluginOptions, VALID_CONNECTOR_TYPES } from "./types";
import { DataSourceType, type NodeDefinition } from "@acidic/definition";

export const filterDrizzleTemplates = (
  context: AcidicContext,
  _: NodeDefinition | null,
  options: DrizzlePluginOptions,
  __: TypescriptGenerator<DrizzlePluginOptions>,
  templates: TemplateDetails[]
): TemplateDetails[] => {
  const dataSourceProvider = context.definition.service.dataSource.provider;
  if (!(VALID_CONNECTOR_TYPES as string[]).includes(dataSourceProvider?.toLowerCase())) {
    throw createStormError({
      code: AcidicErrorCode.invalid_schema,
      message: `Invalid connector type: ${dataSourceProvider}. Valid connector types are: ${VALID_CONNECTOR_TYPES.join(
        ", "
      )}`
    });
  }

  if (options.skipDBConnectorFilter) {
    return templates;
  }

  context.logger.info(`Filtering template for ${dataSourceProvider} connector type`);

  switch (dataSourceProvider) {
    case DataSourceType.SQLITE:
      return templates.filter(
        (template) =>
          !template.name.toUpperCase().includes(DataSourceType.POSTGRES.toUpperCase()) &&
          !template.name.toUpperCase().includes(DataSourceType.POSTGRESQL.toUpperCase()) &&
          !template.name.toUpperCase().includes(DataSourceType.MYSQL.toUpperCase())
      );

    case DataSourceType.MYSQL:
      return templates.filter(
        (template) =>
          !template.name.toUpperCase().includes(DataSourceType.POSTGRES.toUpperCase()) &&
          !template.name.toUpperCase().includes(DataSourceType.POSTGRESQL.toUpperCase()) &&
          !template.name.toUpperCase().includes(DataSourceType.SQLITE.toUpperCase())
      );

    case DataSourceType.POSTGRES:
    case DataSourceType.POSTGRESQL:
      return templates.filter(
        (template) =>
          !template.name.toUpperCase().includes(DataSourceType.SQLITE.toUpperCase()) &&
          !template.name.toUpperCase().includes(DataSourceType.MYSQL.toUpperCase())
      );

    default:
      return templates;
  }
};
