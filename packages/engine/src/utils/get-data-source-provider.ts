import { DataSource, Model, isDataSource } from "@acidic/language/ast";
import { getLiteral } from "@acidic/language/utils";
import { ConnectorType } from "@prisma/generator-helper";

export const getDataSource = (model: Model): DataSource | undefined => {
  return model.declarations.find((declaration): declaration is DataSource =>
    isDataSource(declaration)
  );
};

export const getDataSourceName = (model: Model): string => {
  const dataSource = getDataSource(model);

  return dataSource?.name as "db";
};

export const getDataSourceProvider = (model: Model): ConnectorType => {
  const dataSource = getDataSource(model);

  return getLiteral<string>(
    dataSource?.fields.find(field => field.name === "provider")?.value
  ) as ConnectorType;
};

export const getDataSourceUrl = (model: Model): string => {
  const dataSource = getDataSource(model);

  return getLiteral<string>(
    dataSource?.fields.find(field => field.name === "url")?.value
  )!;
};
