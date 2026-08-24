"use client";

import { useEffect } from "react";

const DEFAULT_DELAY_MS = 2000;

/**
 * Navigates to `to` after `delayMs`, once `active` becomes true. The timer is
 * cleared on unmount (or if `active` flips back to false before it fires),
 * so it can never fire against an unmounted component or navigate somewhere
 * the user didn't ask for.
 */
export function useDelayedRedirect(
  navigate: (opts: { to: string }) => void,
  active: boolean,
  to = "/",
  delayMs = DEFAULT_DELAY_MS,
) {
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => navigate({ to }), delayMs);
    return () => clearTimeout(timer);
  }, [active, navigate, to, delayMs]);
}
