import { CommandName, ExtensionCommandName } from "../types";

const extensionId = "acidicWorkspace";

export const getCommandId = (
  commandName: CommandName
): ExtensionCommandName => {
  return `${extensionId}.${commandName}`;
};

export const parseCommandId = (
  commandName: ExtensionCommandName
): CommandName => {
  return (
    commandName.includes(extensionId)
      ? commandName.replace(`${extensionId}.`, "")
      : commandName
  ) as CommandName;
};
