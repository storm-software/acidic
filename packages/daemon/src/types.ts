import { AcidicDefinitionWrapper } from "@acidic/engine";
import { StormError } from "@storm-stack/errors";

export type MessageIdType = "active" | "error" | "loading";
export const MessageIdType = {
  ACTIVE: "active" as MessageIdType,
  ERROR: "error" as MessageIdType,
  LOADING: "loading" as MessageIdType
};

export interface BaseMessagePayload {
  path: string | "all";
}

export interface Message<
  TPayload extends BaseMessagePayload = BaseMessagePayload
> {
  messageId: MessageIdType;
  payload?: TPayload;
}

export type ActiveMessage = Message<
  { schema: AcidicDefinitionWrapper } & BaseMessagePayload
> & {
  messageId: "active";
};

export type ErrorMessage = Message<
  { error: StormError } & BaseMessagePayload
> & {
  messageId: "error";
};

export type LoadingMessage = Message<BaseMessagePayload> & {
  messageId: "loading";
};

export type MessageBusPacket = {
  id: string;
  type: "message";
  topic: true;
  data?: string;
};
