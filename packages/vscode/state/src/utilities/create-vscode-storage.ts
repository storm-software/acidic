import {
  AsyncStringStorage,
  SyncStringStorage
} from "jotai/vanilla/utils/atomWithStorage";

const vsCode = (global as any)?.Window?.acquireVsCodeApi();

export const createVsCodeStorage = ():
  | AsyncStringStorage
  | SyncStringStorage => {
  const setItem = (key: string, newValue: string | null) => {
    const previousState = vsCode.getState();
    const state = previousState ? { ...previousState } : {};

    vsCode.setState({ ...state, [key]: newValue });
  };
  const getItem = (key: string) => {
    const previousState = vsCode.getState();

    return previousState ? previousState[key] : null;
  };
  const removeItem = (key: string) => {
    setItem(key, null);
  };

  return {
    setItem,
    getItem,
    removeItem
  };
};
