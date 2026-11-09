"use client";

import { useEffect, useState } from "react";

// True when `pending` has been true for longer than `ms`. Use it to show a
// "Waking up the server, this can take a moment..." hint (Render free tier sleeps).
export function useSlowHint(pending: boolean, ms = 5000) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!pending) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), ms);
    return () => clearTimeout(t);
  }, [pending, ms]);
  return slow;
}
