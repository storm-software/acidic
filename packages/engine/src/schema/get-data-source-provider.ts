import {
  AcidicDataSource,
  AcidicSchema,
  getLiteral,
  isAcidicDataSource
} from "@acidic/language";
import { DataSourceType } from "@acidic/schema";

export const getDataSource = (
  schema: AcidicSchema
): AcidicDataSource | undefined => {
  return schema.declarations.find(
    (declaration): declaration is AcidicDataSource =>
      isAcidicDataSource(declaration)
  );
};

export const getDataSourceName = (schema: AcidicSchema): string => {
  const dataSource = getDataSource(schema);

  return dataSource?.name as "db";
};

export const getDataSourceProvider = (schema: AcidicSchema): DataSourceType => {
  const dataSource = getDataSource(schema);

  return getLiteral<string>(
    dataSource?.fields.find(field => field.name === "provider")?.value
  ) as DataSourceType;
};

export const getDataSourceUrl = (schema: AcidicSchema): string => {
  const dataSource = getDataSource(schema);

  return getLiteral<string>(
    dataSource?.fields.find(field => field.name === "url")?.value
  )!;
};
