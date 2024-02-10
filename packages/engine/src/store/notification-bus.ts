import type { StormTrace } from "@storm-stack/telemetry";
import type { BusDriver, CacheBusMessage } from "bentocache/types";

/**
 * A simple in-memory bus driver for easy
 * testing
 */
export class NotificationBus implements BusDriver {
  /**
   * A Map that stores the subscriptions for each channel.
   *
   * key is the channel name and the value is an array of objects
   * containing the handler function and the busId of the subscriber
   */
  static #subscriptions: Map<
    string,
    Array<{
      handler: (message: CacheBusMessage) => void;
      busId: string;
    }>
  > = new Map();

  /**
   * List of messages received by this bus
   */
  receivedMessages: CacheBusMessage[] = [];

  #id!: string;
  _logger?: StormTrace;

  setId(id: string) {
    this.#id = id;
    return this;
  }

  setLogger(logger: StormTrace) {
    this._logger = logger;
    return this;
  }

  /**
   * Subscribes to the given channel
   */
  async subscribe(channelName: string, handler: (message: CacheBusMessage) => void) {
    const handlers = NotificationBus.#subscriptions.get(channelName) || [];

    handlers.push({
      handler: (message) => {
        this.receivedMessages.push(message);
        handler(message);
      },
      busId: this.#id
    });
    NotificationBus.#subscriptions.set(channelName, handlers);
  }

  /**
   * Unsubscribes from the given channel
   */
  async unsubscribe(channelName: string) {
    const handlers = NotificationBus.#subscriptions.get(channelName) || [];

    NotificationBus.#subscriptions.set(
      channelName,
      handlers.filter((handlerInfo) => handlerInfo.busId !== this.#id)
    );
  }

  /**
   * Publishes a message to the given channel
   */
  publish(channelName: string, message: Omit<CacheBusMessage, "busId">): Promise<void> {
    const handlers = NotificationBus.#subscriptions.get(channelName);
    if (!handlers) {
      return Promise.resolve();
    }

    const fullMessage: CacheBusMessage = { ...message, busId: this.#id };
    for (const { handler, busId } of handlers) {
      if (busId === this.#id) {
        continue;
      }

      handler(fullMessage);
    }

    return Promise.resolve();
  }

  /**
   * Disconnects the bus and clears all subscriptions
   */
  disconnect() {
    return Promise.resolve(NotificationBus.#subscriptions.clear());
  }

  async onReconnect(_callback: () => void) {}
}
