import typia from "typia";
import type {
  OnWorkspaceReadyCommand,
  OnSelectWorkspaceManuallyCommand,
  OnLoadingServiceCommand,
  OnErrorServiceCommand,
  OnActiveServiceCommand,
  OnRefreshWorkspaceCommand,
  OnRefreshServiceCommand
} from "../types";

export const assertOnWorkspaceReadyCommand = typia.createAssert<OnWorkspaceReadyCommand>();
export const stringifyOnWorkspaceReadyCommand =
  typia.json.createStringify<OnWorkspaceReadyCommand>();
export const parseOnWorkspaceReadyCommand = typia.json.createAssertParse<OnWorkspaceReadyCommand>();

export const assertOnSelectWorkspaceManuallyCommand =
  typia.createAssert<OnSelectWorkspaceManuallyCommand>();
export const stringifyOnSelectWorkspaceManuallyCommand =
  typia.json.createStringify<OnSelectWorkspaceManuallyCommand>();
export const parseOnSelectWorkspaceManuallyCommand =
  typia.json.createAssertParse<OnSelectWorkspaceManuallyCommand>();

export const assertOnLoadingServiceCommand = typia.createAssert<OnLoadingServiceCommand>();
export const stringifyOnLoadingServiceCommand =
  typia.json.createStringify<OnLoadingServiceCommand>();
export const parseOnLoadingServiceCommand = typia.json.createAssertParse<OnLoadingServiceCommand>();

export const assertOnErrorServiceCommand = typia.createAssert<OnErrorServiceCommand>();
export const stringifyOnErrorServiceCommand = typia.json.createStringify<OnErrorServiceCommand>();
export const parseOnErrorServiceCommand = typia.json.createAssertParse<OnErrorServiceCommand>();

export const assertOnActiveServiceCommand = typia.createAssert<OnActiveServiceCommand>();
export const stringifyOnActiveServiceCommand = typia.json.createStringify<OnActiveServiceCommand>();
export const parseOnActiveServiceCommand = typia.json.createAssertParse<OnActiveServiceCommand>();

export const assertOnRefreshWorkspaceCommand = typia.createAssert<OnRefreshWorkspaceCommand>();
export const stringifyOnRefreshWorkspaceCommand =
  typia.json.createStringify<OnRefreshWorkspaceCommand>();
export const parseOnRefreshWorkspaceCommand =
  typia.json.createAssertParse<OnRefreshWorkspaceCommand>();

export const assertOnRefreshServiceCommand = typia.createAssert<OnRefreshServiceCommand>();
export const stringifyOnRefreshServiceCommand =
  typia.json.createStringify<OnRefreshServiceCommand>();
export const parseOnRefreshServiceCommand = typia.json.createAssertParse<OnRefreshServiceCommand>();
