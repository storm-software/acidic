/**
 * Generator Write function options
 */
export type GeneratorOptions = {
  /**
   * The display name of the file being written. This will be added in the file's header
   */
  headerName?: string;

  /**
   * The header string to add to the file. If set to `true` the default header will be used. If set to `false` no header will be added.
   *
   * @default true
   */
  header?: string | boolean;

  /**
   * The footer string to add to the file. If set to `false` no header will be added.
   *
   * @default false
   */
  footer?: string | boolean;
} & Record<string, any>;

/**
 * Plugin configuration option value type
 */
export type BaseOptionValue = null | string | number | boolean;

/**
 * Plugin configuration option value type
 */
export type OptionValue =
  | BaseOptionValue
  | BaseOptionValue[]
  | Record<string, BaseOptionValue | BaseOptionValue[]>;

/**
 * Plugin configuration options
 */
export type AcidicPluginOptions = {
  /**
   * The name of the provider
   */
  provider: string;

  /**
   * The output directory
   */
  output?: string;
} & GeneratorOptions &
  Record<string, OptionValue>;
