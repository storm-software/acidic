## API Report File for "@acidic/messages"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { tags } from 'typia';
import typia from 'typia';

// @public (undocumented)
const assertOnActiveServiceCommand: (input: any) => OnActiveServiceCommand;
export { assertOnActiveServiceCommand }
export { assertOnActiveServiceCommand as assertOnActiveServiceCommand_alias_1 }
export { assertOnActiveServiceCommand as assertOnActiveServiceCommand_alias_2 }

// @public (undocumented)
const assertOnActiveServiceCommand_2: (input: unknown) => OnActiveServiceCommand;
export { assertOnActiveServiceCommand_2 as assertOnActiveServiceCommand_alias_3 }
export { assertOnActiveServiceCommand_2 as assertOnActiveServiceCommand_alias_4 }

// @public (undocumented)
const assertOnErrorServiceCommand: (input: any) => OnErrorServiceCommand;
export { assertOnErrorServiceCommand }
export { assertOnErrorServiceCommand as assertOnErrorServiceCommand_alias_1 }
export { assertOnErrorServiceCommand as assertOnErrorServiceCommand_alias_2 }

// @public (undocumented)
const assertOnErrorServiceCommand_2: (input: unknown) => OnErrorServiceCommand;
export { assertOnErrorServiceCommand_2 as assertOnErrorServiceCommand_alias_3 }
export { assertOnErrorServiceCommand_2 as assertOnErrorServiceCommand_alias_4 }

// @public (undocumented)
const assertOnLoadingServiceCommand: (input: any) => OnLoadingServiceCommand;
export { assertOnLoadingServiceCommand }
export { assertOnLoadingServiceCommand as assertOnLoadingServiceCommand_alias_1 }
export { assertOnLoadingServiceCommand as assertOnLoadingServiceCommand_alias_2 }

// @public (undocumented)
const assertOnLoadingServiceCommand_2: (input: unknown) => OnLoadingServiceCommand;
export { assertOnLoadingServiceCommand_2 as assertOnLoadingServiceCommand_alias_3 }
export { assertOnLoadingServiceCommand_2 as assertOnLoadingServiceCommand_alias_4 }

// @public (undocumented)
const assertOnRefreshServiceCommand: (input: any) => OnRefreshServiceCommand;
export { assertOnRefreshServiceCommand }
export { assertOnRefreshServiceCommand as assertOnRefreshServiceCommand_alias_1 }
export { assertOnRefreshServiceCommand as assertOnRefreshServiceCommand_alias_2 }

// @public (undocumented)
const assertOnRefreshServiceCommand_2: (input: unknown) => OnRefreshServiceCommand;
export { assertOnRefreshServiceCommand_2 as assertOnRefreshServiceCommand_alias_3 }
export { assertOnRefreshServiceCommand_2 as assertOnRefreshServiceCommand_alias_4 }

// @public (undocumented)
const assertOnRefreshWorkspaceCommand: (input: any) => OnRefreshWorkspaceCommand;
export { assertOnRefreshWorkspaceCommand }
export { assertOnRefreshWorkspaceCommand as assertOnRefreshWorkspaceCommand_alias_1 }
export { assertOnRefreshWorkspaceCommand as assertOnRefreshWorkspaceCommand_alias_2 }

// @public (undocumented)
const assertOnRefreshWorkspaceCommand_2: (input: unknown) => OnRefreshWorkspaceCommand;
export { assertOnRefreshWorkspaceCommand_2 as assertOnRefreshWorkspaceCommand_alias_3 }
export { assertOnRefreshWorkspaceCommand_2 as assertOnRefreshWorkspaceCommand_alias_4 }

// @public (undocumented)
const assertOnSelectWorkspaceManuallyCommand: (input: any) => OnSelectWorkspaceManuallyCommand;
export { assertOnSelectWorkspaceManuallyCommand }
export { assertOnSelectWorkspaceManuallyCommand as assertOnSelectWorkspaceManuallyCommand_alias_1 }
export { assertOnSelectWorkspaceManuallyCommand as assertOnSelectWorkspaceManuallyCommand_alias_2 }

// @public (undocumented)
const assertOnSelectWorkspaceManuallyCommand_2: (input: unknown) => OnSelectWorkspaceManuallyCommand;
export { assertOnSelectWorkspaceManuallyCommand_2 as assertOnSelectWorkspaceManuallyCommand_alias_3 }
export { assertOnSelectWorkspaceManuallyCommand_2 as assertOnSelectWorkspaceManuallyCommand_alias_4 }

// @public (undocumented)
const assertOnWorkspaceReadyCommand: (input: any) => OnWorkspaceReadyCommand;
export { assertOnWorkspaceReadyCommand }
export { assertOnWorkspaceReadyCommand as assertOnWorkspaceReadyCommand_alias_1 }
export { assertOnWorkspaceReadyCommand as assertOnWorkspaceReadyCommand_alias_2 }

// @public (undocumented)
const assertOnWorkspaceReadyCommand_2: (input: unknown) => OnWorkspaceReadyCommand;
export { assertOnWorkspaceReadyCommand_2 as assertOnWorkspaceReadyCommand_alias_3 }
export { assertOnWorkspaceReadyCommand_2 as assertOnWorkspaceReadyCommand_alias_4 }

// @public (undocumented)
interface BaseCommand {
    // (undocumented)
    command: ExtensionCommandId;
    // (undocumented)
    correlationId: string & tags.Format<"uuid">;
    // (undocumented)
    data?: any;
    // (undocumented)
    sourceId: CommandSourceId;
    // (undocumented)
    timestamp: number & tags.Type<"uint32">;
}
export { BaseCommand }
export { BaseCommand as BaseCommand_alias_1 }

// @public (undocumented)
type CommandId = "onStartupFinished" | "onOpenServiceGraph" | "onWorkspaceReady" | "onLoadingService" | "onErrorService" | "onActiveService" | "onSetSettings" | "onRefreshWorkspace" | "onRefreshService" | "onSelectWorkspaceManually";

// @public (undocumented)
const CommandId: {
    ON_STARTUP_FINISHED: CommandId;
    ON_OPEN_SERVICE_GRAPH: CommandId;
    ON_WORKSPACE_READY: CommandId;
    ON_LOADING_SERVICE: CommandId;
    ON_ERROR_SERVICE: CommandId;
    ON_ACTIVE_SERVICE: CommandId;
    ON_SET_SETTINGS: CommandId;
    ON_REFRESH_WORKSPACE: CommandId;
    ON_REFRESH_SERVICE: CommandId;
    ON_SELECT_WORKSPACE_MANUALLY: CommandId;
};
export { CommandId }
export { CommandId as CommandId_alias_1 }

// @public (undocumented)
type CommandSourceId = "engine" | "client";

// @public (undocumented)
const CommandSourceId: {
    ENGINE: CommandSourceId;
    CLIENT: CommandSourceId;
};
export { CommandSourceId }
export { CommandSourceId as CommandSourceId_alias_1 }

// @public (undocumented)
type ExtensionCommandId<TCommandId extends CommandId = CommandId> = `acidicWorkspace.${TCommandId}`;
export { ExtensionCommandId }
export { ExtensionCommandId as ExtensionCommandId_alias_1 }

// @public (undocumented)
const getCommandId: (CommandId: CommandId) => ExtensionCommandId;
export { getCommandId }
export { getCommandId as getCommandId_alias_1 }
export { getCommandId as getCommandId_alias_2 }

// @public (undocumented)
interface OnActiveServiceCommand extends SetServiceCommand {
    // (undocumented)
    command: ExtensionCommandId<"onActiveService">;
    // (undocumented)
    data: {
        status: "active";
        path: string;
        definition: string;
        error: null;
    };
}
export { OnActiveServiceCommand }
export { OnActiveServiceCommand as OnActiveServiceCommand_alias_1 }

// @public (undocumented)
interface OnErrorServiceCommand extends SetServiceCommand {
    // (undocumented)
    command: ExtensionCommandId<"onErrorService">;
    // (undocumented)
    data: {
        status: "error";
        path: string;
        definition: null;
        error: string;
    };
}
export { OnErrorServiceCommand }
export { OnErrorServiceCommand as OnErrorServiceCommand_alias_1 }

// @public (undocumented)
interface OnLoadingServiceCommand extends SetServiceCommand {
    // (undocumented)
    command: ExtensionCommandId<"onLoadingService">;
    // (undocumented)
    data: {
        status: "loading";
        path: string;
        definition: null;
        error: null;
    };
}
export { OnLoadingServiceCommand }
export { OnLoadingServiceCommand as OnLoadingServiceCommand_alias_1 }

// @public (undocumented)
interface OnRefreshServiceCommand extends BaseCommand {
    // (undocumented)
    command: ExtensionCommandId<"onRefreshService">;
    // (undocumented)
    data: {
        path: string;
    };
}
export { OnRefreshServiceCommand }
export { OnRefreshServiceCommand as OnRefreshServiceCommand_alias_1 }

// @public (undocumented)
interface OnRefreshWorkspaceCommand extends BaseCommand {
    // (undocumented)
    command: ExtensionCommandId<"onRefreshWorkspace">;
}
export { OnRefreshWorkspaceCommand }
export { OnRefreshWorkspaceCommand as OnRefreshWorkspaceCommand_alias_1 }

// @public (undocumented)
interface OnSelectWorkspaceManuallyCommand extends BaseCommand {
    // (undocumented)
    command: ExtensionCommandId<"onSelectWorkspaceManually">;
    // (undocumented)
    data: {
        workspaceRoot: string;
    };
}
export { OnSelectWorkspaceManuallyCommand }
export { OnSelectWorkspaceManuallyCommand as OnSelectWorkspaceManuallyCommand_alias_1 }

// @public (undocumented)
interface OnWorkspaceReadyCommand extends BaseCommand {
    // (undocumented)
    command: ExtensionCommandId<"onWorkspaceReady">;
    // (undocumented)
    data: {
        workspaceRoot: string;
    };
}
export { OnWorkspaceReadyCommand }
export { OnWorkspaceReadyCommand as OnWorkspaceReadyCommand_alias_1 }

// @public (undocumented)
const parseCommandId: (CommandId: ExtensionCommandId) => CommandId;
export { parseCommandId }
export { parseCommandId as parseCommandId_alias_1 }
export { parseCommandId as parseCommandId_alias_2 }

// @public (undocumented)
const parseOnActiveServiceCommand: (input: string) => typia.Primitive<OnActiveServiceCommand>;
export { parseOnActiveServiceCommand }
export { parseOnActiveServiceCommand as parseOnActiveServiceCommand_alias_1 }
export { parseOnActiveServiceCommand as parseOnActiveServiceCommand_alias_2 }

// @public (undocumented)
const parseOnActiveServiceCommand_2: (input: string) => OnActiveServiceCommand;
export { parseOnActiveServiceCommand_2 as parseOnActiveServiceCommand_alias_3 }
export { parseOnActiveServiceCommand_2 as parseOnActiveServiceCommand_alias_4 }

// @public (undocumented)
const parseOnErrorServiceCommand: (input: string) => typia.Primitive<OnErrorServiceCommand>;
export { parseOnErrorServiceCommand }
export { parseOnErrorServiceCommand as parseOnErrorServiceCommand_alias_1 }
export { parseOnErrorServiceCommand as parseOnErrorServiceCommand_alias_2 }

// @public (undocumented)
const parseOnErrorServiceCommand_2: (input: string) => OnErrorServiceCommand;
export { parseOnErrorServiceCommand_2 as parseOnErrorServiceCommand_alias_3 }
export { parseOnErrorServiceCommand_2 as parseOnErrorServiceCommand_alias_4 }

// @public (undocumented)
const parseOnLoadingServiceCommand: (input: string) => typia.Primitive<OnLoadingServiceCommand>;
export { parseOnLoadingServiceCommand }
export { parseOnLoadingServiceCommand as parseOnLoadingServiceCommand_alias_1 }
export { parseOnLoadingServiceCommand as parseOnLoadingServiceCommand_alias_2 }

// @public (undocumented)
const parseOnLoadingServiceCommand_2: (input: string) => OnLoadingServiceCommand;
export { parseOnLoadingServiceCommand_2 as parseOnLoadingServiceCommand_alias_3 }
export { parseOnLoadingServiceCommand_2 as parseOnLoadingServiceCommand_alias_4 }

// @public (undocumented)
const parseOnRefreshServiceCommand: (input: string) => typia.Primitive<OnRefreshServiceCommand>;
export { parseOnRefreshServiceCommand }
export { parseOnRefreshServiceCommand as parseOnRefreshServiceCommand_alias_1 }
export { parseOnRefreshServiceCommand as parseOnRefreshServiceCommand_alias_2 }

// @public (undocumented)
const parseOnRefreshServiceCommand_2: (input: string) => OnRefreshServiceCommand;
export { parseOnRefreshServiceCommand_2 as parseOnRefreshServiceCommand_alias_3 }
export { parseOnRefreshServiceCommand_2 as parseOnRefreshServiceCommand_alias_4 }

// @public (undocumented)
const parseOnRefreshWorkspaceCommand: (input: string) => typia.Primitive<OnRefreshWorkspaceCommand>;
export { parseOnRefreshWorkspaceCommand }
export { parseOnRefreshWorkspaceCommand as parseOnRefreshWorkspaceCommand_alias_1 }
export { parseOnRefreshWorkspaceCommand as parseOnRefreshWorkspaceCommand_alias_2 }

// @public (undocumented)
const parseOnRefreshWorkspaceCommand_2: (input: string) => OnRefreshWorkspaceCommand;
export { parseOnRefreshWorkspaceCommand_2 as parseOnRefreshWorkspaceCommand_alias_3 }
export { parseOnRefreshWorkspaceCommand_2 as parseOnRefreshWorkspaceCommand_alias_4 }

// @public (undocumented)
const parseOnSelectWorkspaceManuallyCommand: (input: string) => typia.Primitive<OnSelectWorkspaceManuallyCommand>;
export { parseOnSelectWorkspaceManuallyCommand }
export { parseOnSelectWorkspaceManuallyCommand as parseOnSelectWorkspaceManuallyCommand_alias_1 }
export { parseOnSelectWorkspaceManuallyCommand as parseOnSelectWorkspaceManuallyCommand_alias_2 }

// @public (undocumented)
const parseOnSelectWorkspaceManuallyCommand_2: (input: string) => OnSelectWorkspaceManuallyCommand;
export { parseOnSelectWorkspaceManuallyCommand_2 as parseOnSelectWorkspaceManuallyCommand_alias_3 }
export { parseOnSelectWorkspaceManuallyCommand_2 as parseOnSelectWorkspaceManuallyCommand_alias_4 }

// @public (undocumented)
const parseOnWorkspaceReadyCommand: (input: string) => typia.Primitive<OnWorkspaceReadyCommand>;
export { parseOnWorkspaceReadyCommand }
export { parseOnWorkspaceReadyCommand as parseOnWorkspaceReadyCommand_alias_1 }
export { parseOnWorkspaceReadyCommand as parseOnWorkspaceReadyCommand_alias_2 }

// @public (undocumented)
const parseOnWorkspaceReadyCommand_2: (input: string) => OnWorkspaceReadyCommand;
export { parseOnWorkspaceReadyCommand_2 as parseOnWorkspaceReadyCommand_alias_3 }
export { parseOnWorkspaceReadyCommand_2 as parseOnWorkspaceReadyCommand_alias_4 }

// @public (undocumented)
type ServiceSchemaStatus = "active" | "error" | "loading";

// @public (undocumented)
const ServiceSchemaStatus: {
    ACTIVE: ServiceSchemaStatus;
    ERROR: ServiceSchemaStatus;
    LOADING: ServiceSchemaStatus;
};
export { ServiceSchemaStatus }
export { ServiceSchemaStatus as ServiceSchemaStatus_alias_1 }

// @public (undocumented)
interface SetServiceCommand extends BaseCommand {
    // (undocumented)
    data: {
        status: ServiceSchemaStatus;
        path: string;
        definition: string | null;
        error: string | null;
    };
}
export { SetServiceCommand }
export { SetServiceCommand as SetServiceCommand_alias_1 }

// @public (undocumented)
const stringifyOnActiveServiceCommand: (input: OnActiveServiceCommand) => string;
export { stringifyOnActiveServiceCommand }
export { stringifyOnActiveServiceCommand as stringifyOnActiveServiceCommand_alias_1 }
export { stringifyOnActiveServiceCommand as stringifyOnActiveServiceCommand_alias_2 }

// @public (undocumented)
const stringifyOnActiveServiceCommand_2: (input: OnActiveServiceCommand) => string;
export { stringifyOnActiveServiceCommand_2 as stringifyOnActiveServiceCommand_alias_3 }
export { stringifyOnActiveServiceCommand_2 as stringifyOnActiveServiceCommand_alias_4 }

// @public (undocumented)
const stringifyOnErrorServiceCommand: (input: OnErrorServiceCommand) => string;
export { stringifyOnErrorServiceCommand }
export { stringifyOnErrorServiceCommand as stringifyOnErrorServiceCommand_alias_1 }
export { stringifyOnErrorServiceCommand as stringifyOnErrorServiceCommand_alias_2 }

// @public (undocumented)
const stringifyOnErrorServiceCommand_2: (input: OnErrorServiceCommand) => string;
export { stringifyOnErrorServiceCommand_2 as stringifyOnErrorServiceCommand_alias_3 }
export { stringifyOnErrorServiceCommand_2 as stringifyOnErrorServiceCommand_alias_4 }

// @public (undocumented)
const stringifyOnLoadingServiceCommand: (input: OnLoadingServiceCommand) => string;
export { stringifyOnLoadingServiceCommand }
export { stringifyOnLoadingServiceCommand as stringifyOnLoadingServiceCommand_alias_1 }
export { stringifyOnLoadingServiceCommand as stringifyOnLoadingServiceCommand_alias_2 }

// @public (undocumented)
const stringifyOnLoadingServiceCommand_2: (input: OnLoadingServiceCommand) => string;
export { stringifyOnLoadingServiceCommand_2 as stringifyOnLoadingServiceCommand_alias_3 }
export { stringifyOnLoadingServiceCommand_2 as stringifyOnLoadingServiceCommand_alias_4 }

// @public (undocumented)
const stringifyOnRefreshServiceCommand: (input: OnRefreshServiceCommand) => string;
export { stringifyOnRefreshServiceCommand }
export { stringifyOnRefreshServiceCommand as stringifyOnRefreshServiceCommand_alias_1 }
export { stringifyOnRefreshServiceCommand as stringifyOnRefreshServiceCommand_alias_2 }

// @public (undocumented)
const stringifyOnRefreshServiceCommand_2: (input: OnRefreshServiceCommand) => string;
export { stringifyOnRefreshServiceCommand_2 as stringifyOnRefreshServiceCommand_alias_3 }
export { stringifyOnRefreshServiceCommand_2 as stringifyOnRefreshServiceCommand_alias_4 }

// @public (undocumented)
const stringifyOnRefreshWorkspaceCommand: (input: OnRefreshWorkspaceCommand) => string;
export { stringifyOnRefreshWorkspaceCommand }
export { stringifyOnRefreshWorkspaceCommand as stringifyOnRefreshWorkspaceCommand_alias_1 }
export { stringifyOnRefreshWorkspaceCommand as stringifyOnRefreshWorkspaceCommand_alias_2 }

// @public (undocumented)
const stringifyOnRefreshWorkspaceCommand_2: (input: OnRefreshWorkspaceCommand) => string;
export { stringifyOnRefreshWorkspaceCommand_2 as stringifyOnRefreshWorkspaceCommand_alias_3 }
export { stringifyOnRefreshWorkspaceCommand_2 as stringifyOnRefreshWorkspaceCommand_alias_4 }

// @public (undocumented)
const stringifyOnSelectWorkspaceManuallyCommand: (input: OnSelectWorkspaceManuallyCommand) => string;
export { stringifyOnSelectWorkspaceManuallyCommand }
export { stringifyOnSelectWorkspaceManuallyCommand as stringifyOnSelectWorkspaceManuallyCommand_alias_1 }
export { stringifyOnSelectWorkspaceManuallyCommand as stringifyOnSelectWorkspaceManuallyCommand_alias_2 }

// @public (undocumented)
const stringifyOnSelectWorkspaceManuallyCommand_2: (input: OnSelectWorkspaceManuallyCommand) => string;
export { stringifyOnSelectWorkspaceManuallyCommand_2 as stringifyOnSelectWorkspaceManuallyCommand_alias_3 }
export { stringifyOnSelectWorkspaceManuallyCommand_2 as stringifyOnSelectWorkspaceManuallyCommand_alias_4 }

// @public (undocumented)
const stringifyOnWorkspaceReadyCommand: (input: OnWorkspaceReadyCommand) => string;
export { stringifyOnWorkspaceReadyCommand }
export { stringifyOnWorkspaceReadyCommand as stringifyOnWorkspaceReadyCommand_alias_1 }
export { stringifyOnWorkspaceReadyCommand as stringifyOnWorkspaceReadyCommand_alias_2 }

// @public (undocumented)
const stringifyOnWorkspaceReadyCommand_2: (input: OnWorkspaceReadyCommand) => string;
export { stringifyOnWorkspaceReadyCommand_2 as stringifyOnWorkspaceReadyCommand_alias_3 }
export { stringifyOnWorkspaceReadyCommand_2 as stringifyOnWorkspaceReadyCommand_alias_4 }

// (No @packageDocumentation comment for this package)

```
