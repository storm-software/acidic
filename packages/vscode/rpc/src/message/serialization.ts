import { parse, stringify } from "@storm-stack/serialization";
import { getCommandId, parseCommandId } from "../commands";
import { CommandName, VsCodeRpcMessage, VsCodeRpcMessageEvent } from "../types";

export const serialize = <TData = any>(
  commandName: CommandName,
  data: TData
): VsCodeRpcMessageEvent<TData> => {
  return { type: getCommandId(commandName), data: stringify(data) };
};

export const deserialize = <TData = any>(
  event: VsCodeRpcMessageEvent<TData>
): VsCodeRpcMessage<TData> => {
  return {
    command: parseCommandId(event.type),
    data: event.data ? parse<TData>(event.data) : undefined
  };
};
