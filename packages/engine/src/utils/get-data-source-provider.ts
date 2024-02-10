import {
  type AcidicDataSource,
  type AcidicSchema,
  getLiteral,
  isAcidicDataSource
} from "@acidic/language";
import type { DataSourceType } from "@acidic/definition";

export const getDataSource = (schema: AcidicSchema): AcidicDataSource | undefined => {
  return schema.declarations.find((declaration): declaration is AcidicDataSource =>
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
    dataSource?.fields.find((field) => field.name === "provider")?.value
  ) as DataSourceType;
};

export const getDataSourceUrl = (schema: AcidicSchema): string => {
  const dataSource = getDataSource(schema);

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return getLiteral<string>(dataSource?.fields.find((field) => field.name === "url")?.value)!;
};

export const getDataSourceDirectUrl = (schema: AcidicSchema): string => {
  const dataSource = getDataSource(schema);

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return getLiteral<string>(dataSource?.fields.find((field) => field.name === "directUrl")?.value)!;
};

export const getDataSourceProxyUrl = (schema: AcidicSchema): string => {
  const dataSource = getDataSource(schema);

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return getLiteral<string>(dataSource?.fields.find((field) => field.name === "proxyUrl")?.value)!;
};
