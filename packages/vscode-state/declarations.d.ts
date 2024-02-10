interface Message {
  type: string;
  payload?: any;
}

type VSCode = {
  postMessage<T extends Message = Message>(message: T): void;
  getState(): any;
  setState(state: any): void;
};

declare global {
  interface Window {
    acquireVsCodeApi(): VSCode;
  }
}
