import { StormError } from "@storm-stack/errors";
import { StormLog } from "@storm-stack/logging";
import { StormParser } from "@storm-stack/serialization";
import { AcidicDaemonErrorCode } from "../errors";
import {
  ActiveMessage,
  ErrorMessage,
  Message,
  MessageBusPacket,
  MessageIdType
} from "../types";

export const messageBusDecorator =
  (logger: StormLog, getMessageFn: (message: Message) => PromiseLike<any>) =>
  (packet: MessageBusPacket) => {
    logger.log(packet);

    if (packet.data) {
      const data = StormParser.parse<Message>(packet.data);
      if (data?.messageId && data?.payload?.path) {
        let { messageId, payload } = data;

        let error: StormError | undefined;
        if (!payload?.path) {
          messageId = MessageIdType.ERROR;
          error = new StormError(AcidicDaemonErrorCode.invalid_bus_payload, {
            message:
              "No schema was provided in the payload of the active message"
          });
        } else if (
          messageId === MessageIdType.ACTIVE &&
          !(payload as ActiveMessage["payload"])?.schema
        ) {
          messageId = MessageIdType.ERROR;
          error = new StormError(AcidicDaemonErrorCode.invalid_bus_payload, {
            message:
              "No schema was provided in the payload of the active message"
          });
        }

        return getMessageFn({
          messageId,
          payload: error
            ? ({
                ...payload,
                error
              } as ErrorMessage["payload"])
            : payload
        });
      }
    }

    return Promise.resolve();
  };
