"use client";

import { useEffect, useState } from "react";

// Loads data in the browser so the login cookie is sent. Pass a load function wrapped in useCallback.
export function useLoad<T>(load: () => Promise<T>) {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let off = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    load()
      .then((data) => !off && setState({ data, error: null, loading: false }))
      .catch((e) => !off && setState({ data: null, error: e instanceof Error ? e.message : "Could not load data.", loading: false }));
    return () => {
      off = true;
    };
  }, [load]);

  return state;
}
