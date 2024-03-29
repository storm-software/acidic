## API Report File for "@acidic/plugin-valibot"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { AstNode } from 'langium';
import { CompilerOptions } from 'ts-morph';
import { ESLint } from 'eslint';
import * as Handlebars_2 from 'handlebars';
import type { HelperOptions } from 'handlebars/runtime';
import type { MaybePromise } from '@storm-stack/utilities';
import type { PluginInstance } from '@storm-stack/plugin-system';
import prettier from 'prettier';
import { Project } from 'ts-morph';
import type { Reference } from 'langium';
import { RequiredOptions } from 'prettier';
import { SourceFile } from 'ts-morph';
import type { StormConfig } from '@storm-software/config';
import type { StormTrace } from '@storm-stack/telemetry';
import typia from 'typia';

// @public (undocumented)
export const generator: TemplateGenerator<ValibotPluginOptions>;

// @public (undocumented)
const name_2 = "Valibot Schema Generator";
export { name_2 as name }

// @public (undocumented)
const process_2: AcidicPluginProcessor<ValibotPluginOptions, TemplateGenerator<ValibotPluginOptions>>;
export { process_2 as process }

// @public (undocumented)
export type ValibotPluginOptions = TypescriptPluginOptions & {
    useUniqueIdGenerator?: boolean;
    useDateTime?: boolean;
};

// (No @packageDocumentation comment for this package)

```
