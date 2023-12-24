import { CommandName } from "./commands";

export const getCommandId = (commandName: CommandName) => {
  return `acidicWorkspace.${commandName}`;
};
