/**
 * Defines a CancellationToken. This interface is not
 * intended to be implemented. A CancellationToken must
 * be created via a CancellationTokenSource.
 */
export interface CancellationToken {
  /**
   * Is `true` when the token has been cancelled, `false` otherwise.
   */
  readonly isCancellationRequested: boolean;

  /**
   * An {@link Event event} which fires upon cancellation.
   */
  readonly onCancellationRequested: Event<any>;
}

/**
 * Represents a typed event.
 */
export interface Event<T> {
  /**
   *
   * @param listener The listener function will be called when the event happens.
   * @param thisArgs The 'this' which will be used when calling the event listener.
   * @param disposables An array to which a {{IDisposable}} will be added.
   * @return
   */
  (
    listener: (e: T) => any,
    thisArgs?: any,
    disposables?: Disposable[]
  ): Disposable;
}

export interface Disposable {
  /**
   * Dispose this object.
   */
  dispose(): void;
}

export namespace Disposable {
  export function create(func: () => void): Disposable {
    return {
      dispose: func
    };
  }
}

export namespace Event {
  const _disposable = { dispose() {} };
  export const None: Event<any> = function () {
    return _disposable;
  };
}

export namespace CancellationToken {
  export const None: CancellationToken = Object.freeze({
    isCancellationRequested: false,
    onCancellationRequested: Event.None
  });

  export const Cancelled: CancellationToken = Object.freeze({
    isCancellationRequested: true,
    onCancellationRequested: Event.None
  });

  export function is(value: any): value is CancellationToken {
    const candidate = value as CancellationToken;
    return (
      candidate &&
      (candidate === CancellationToken.None ||
        candidate === CancellationToken.Cancelled ||
        (typeof candidate.isCancellationRequested === "boolean" &&
          !!candidate.onCancellationRequested))
    );
  }
}
