import type { TypescriptPluginOptions } from "@acidic/engine";
import { DataSourceType } from "@acidic/definition";

export const VALID_CONNECTOR_TYPES = [
  DataSourceType.SQLITE,
  DataSourceType.POSTGRES,
  DataSourceType.POSTGRESQL,
  DataSourceType.MYSQL
];

export type DrizzlePluginOptions = TypescriptPluginOptions & {
  /**
   * Should the UniqueIdGenerator from [@stormstack/core-shared-utilities](https://github.com/storm-software/stormstack/tree/main/libs/core/typescript/shared/utilities) be used to generate the default ID values for fields
   *
   * @default true
   */
  useStormIdGenerator?: boolean;

  /**
   * Should the StormDateTime class from [@stormstack/core-shared-utilities](https://github.com/storm-software/stormstack/tree/main/libs/core/typescript/shared/utilities) be used to type DateTime fields. Set to false if you want to use the Date class instead.
   *
   * @default true
   */
  useStormDateTime?: boolean;

  /**
   * Should the plugin skip filtering templates by the select database connector type (e.g. if sqlite is selected, any template with mysql, postgres, or postgresql in the name will be skipped)
   *
   * @default false
   */
  skipDBConnectorFilter?: boolean;
};
