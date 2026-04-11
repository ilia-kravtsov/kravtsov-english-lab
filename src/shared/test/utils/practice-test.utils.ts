import { afterEach, beforeEach, vi } from 'vitest';

type StoreWithStop = {
  getState: () => {
    stop: () => void;
  };
};

export function setupPracticeStoreTest(store: StoreWithStop) {
  beforeEach(() => {
    store.getState().stop();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    store.getState().stop();
  });
}