"use client";

import Cookies from "js-cookie";
import React from "react";

type StorageBackend = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const localStorageBackend: StorageBackend = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
};

const cookieStorageBackend: StorageBackend = {
  getItem: (key) => Cookies.get(key) ?? null,
  setItem: (key, value) =>
    Cookies.set(key, value, { path: "/", expires: 365 * 10 }),
};

type StorageType = "localStorage" | "cookies";

type PersistedStateOptions = {
  storage?: StorageType;
  format?: "json" | "string";
};

const storage = {
  localStorage: localStorageBackend,
  cookies: cookieStorageBackend,
} as const;

/**
 * A custom React hook that manages persisted state across page reloads using either localStorage or cookies.
 *
 * @template TState - The type of the state to be persisted
 * @param {string} key - The unique key under which the state will be stored
 * @param {TState} defaultState - The initial state value if no persisted state exists
 * @param {PersistedStateOptions} [options] - Configuration options for the persisted state
 *
 * @returns {readonly [TState, React.Dispatch<React.SetStateAction<TState>>, boolean]} A tuple containing:
 * - The current state value
 * - A function to update the state
 * - A boolean indicating whether the initial state has been loaded from storage
 *
 * @example
 * ```tsx
 * const [value, setValue, isInitialized] = usePersistedState('my-key', 'default value');
 * ```
 *
 * @example
 * ```tsx
 * const [language, setLanguage] = usePersistedState('language', 'en', {
 *  storage: 'cookies',
 *  format: 'string',
 * });
 */
export const usePersistedState = <TState>(
  key: string,
  defaultState: TState,
  options: PersistedStateOptions = {}
) => {
  const { storage: storageType = "localStorage", format = "json" } = options;
  const storageBackend = storage[storageType];

  const [state, setState] = React.useState<TState>(defaultState);
  const [initialized, setInitialized] = React.useState(false);

  const serialize = React.useCallback(
    (value: TState) => {
      if (format === "json") {
        return JSON.stringify(value);
      }
      return String(value);
    },
    [format]
  );

  const deserialize = React.useCallback(
    (value: string | null) => {
      if (value === null) {
        return defaultState;
      }
      if (format === "json") {
        return JSON.parse(value) as TState;
      }
      return value;
    },
    [defaultState, format]
  );

  React.useEffect(() => {
    const storedState = storageBackend.getItem(key);
    if (storedState) {
      setState(deserialize(storedState) as TState);
    }
    setInitialized(true);
  }, [key, storageBackend, deserialize]);

  React.useEffect(() => {
    if (!initialized) return;
    storageBackend.setItem(key, serialize(state));
  }, [key, state, initialized, storageBackend, serialize]);

  return [state, setState, initialized] as const;
};
