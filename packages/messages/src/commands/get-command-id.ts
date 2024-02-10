import type { CommandId, ExtensionCommandId } from "../types";

const extensionId = "acidicWorkspace";

export const getCommandId = (CommandId: CommandId): ExtensionCommandId => {
  return `${extensionId}.${CommandId}`;
};

export const parseCommandId = (CommandId: ExtensionCommandId): CommandId => {
  return (
    CommandId.includes(extensionId) ? CommandId.replace(`${extensionId}.`, "") : CommandId
  ) as CommandId;
};
