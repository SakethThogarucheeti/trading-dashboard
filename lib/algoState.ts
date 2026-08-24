const HIDDEN_STATE_KEYS = new Set(["bars_seen", "warmup_complete", "last_signal_at"]);

export interface AlgoDisplayState {
  barsSeen: number;
  warmupComplete: boolean;
  lastSignalAt: string | undefined;
  stateEntries: [string, unknown][];
}

/** Derive display-worthy values from an algo's raw `state` dict, hiding internal bookkeeping keys. */
export function deriveAlgoDisplayState(state: Record<string, unknown> | undefined): AlgoDisplayState {
  return {
    barsSeen: Number(state?.bars_seen ?? 0),
    warmupComplete: Boolean(state?.warmup_complete),
    lastSignalAt: state?.last_signal_at as string | undefined,
    stateEntries: Object.entries(state ?? {}).filter(([k]) => !HIDDEN_STATE_KEYS.has(k)),
  };
}
