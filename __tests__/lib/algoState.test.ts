import { describe, it, expect } from "vitest";
import { deriveAlgoDisplayState } from "@/lib/algoState";

describe("deriveAlgoDisplayState", () => {
  it("derives barsSeen, warmupComplete, lastSignalAt from state", () => {
    const result = deriveAlgoDisplayState({
      bars_seen: 42,
      warmup_complete: true,
      last_signal_at: "2026-05-19T04:00:00Z",
    });
    expect(result.barsSeen).toBe(42);
    expect(result.warmupComplete).toBe(true);
    expect(result.lastSignalAt).toBe("2026-05-19T04:00:00Z");
  });

  it("filters hidden bookkeeping keys out of stateEntries", () => {
    const result = deriveAlgoDisplayState({
      bars_seen: 10,
      warmup_complete: false,
      last_signal_at: "2026-05-19T04:00:00Z",
      ema_fast: 12,
      ema_slow: 26,
    });
    expect(result.stateEntries).toEqual([
      ["ema_fast", 12],
      ["ema_slow", 26],
    ]);
  });

  it("defaults sensibly when state is undefined", () => {
    const result = deriveAlgoDisplayState(undefined);
    expect(result.barsSeen).toBe(0);
    expect(result.warmupComplete).toBe(false);
    expect(result.lastSignalAt).toBeUndefined();
    expect(result.stateEntries).toEqual([]);
  });

  it("defaults sensibly when state is an empty object", () => {
    const result = deriveAlgoDisplayState({});
    expect(result.barsSeen).toBe(0);
    expect(result.warmupComplete).toBe(false);
    expect(result.stateEntries).toEqual([]);
  });
});
