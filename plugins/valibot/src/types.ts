import type {
   TypescriptPluginOptions
} from "@acidic/engine";


export type ValibotPluginOptions = TypescriptPluginOptions & {
  /**
   * Should the UniqueIdGenerator from [@storm-stack/unique-identifier](https://github.com/storm-software/storm-stack/tree/main/packages/unique-identifier) be used to generate the default ID values for fields
   *
   * @default false
   */
  useUniqueIdGenerator?: boolean;

  /**
   * Should the DateTime class from [@storm-stack/date-time](https://github.com/storm-software/storm-stack/tree/main/packages/date-time) be used to type DateTime fields. Set to false if you want to use the Date class instead.
   *
   * @default false
   */
  useDateTime?: boolean;
};
