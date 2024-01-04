import { CommandName, VsCodeRpcMessage, VsCodeRpcMessageEvent } from "../types";
import { deserialize, serialize } from "./serialization";

export const withMessageHandler =
  <TData = any>(handler: (message: VsCodeRpcMessage<TData>) => void) =>
  (event: VsCodeRpcMessageEvent<TData>) => {
    handler(deserialize(event));
  };

export const withSendMessage =
  <TData = any>(sendMessage: (event: VsCodeRpcMessageEvent<TData>) => void) =>
  (commandName: CommandName, data: any) => {
    sendMessage(serialize(commandName, data));
  };
