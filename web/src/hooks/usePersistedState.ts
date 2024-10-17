"use client";

import React from "react";

export function usePersistedState<TState>(key: string, defaultState: TState) {
  const [state, setState] = React.useState<TState>(defaultState);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    const storedState = localStorage.getItem(key);
    if (storedState) {
      setState(JSON.parse(storedState) as TState);
    }

    setInitialized(true);
  }, [key]);

  React.useEffect(() => {
    if (!initialized) return;

    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state, initialized]);

  return [state, setState, initialized] as const;
}
