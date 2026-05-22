import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDecisionStream } from "@/hooks/useDecisionStream";

// Minimal EventSource mock
class MockEventSource {
  url: string;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;
  static instances: MockEventSource[] = [];

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  close = vi.fn();

  emit(data: string) {
    this.onmessage?.({ data } as MessageEvent);
  }

  open() {
    this.onopen?.();
  }

  error() {
    this.onerror?.();
  }
}

beforeEach(() => {
  MockEventSource.instances = [];
  vi.stubGlobal("EventSource", MockEventSource);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useDecisionStream", () => {
  it("creates EventSource with correct URL when no params", () => {
    renderHook(() => useDecisionStream("", ""));
    expect(MockEventSource.instances).toHaveLength(1);
    expect(MockEventSource.instances[0].url).toBe("/api/decisions/stream");
  });

  it("appends session_id to URL", () => {
    renderHook(() => useDecisionStream("bt-001"));
    expect(MockEventSource.instances[0].url).toBe("/api/decisions/stream?session_id=bt-001");
  });

  it("appends algo_name to URL", () => {
    renderHook(() => useDecisionStream("", "ema_crossover"));
    expect(MockEventSource.instances[0].url).toBe("/api/decisions/stream?algo_name=ema_crossover");
  });

  it("appends both session_id and algo_name to URL", () => {
    renderHook(() => useDecisionStream("bt-001", "ema_crossover"));
    const url = MockEventSource.instances[0].url;
    expect(url).toContain("session_id=bt-001");
    expect(url).toContain("algo_name=ema_crossover");
  });

  it("starts with connecting status", () => {
    const { result } = renderHook(() => useDecisionStream("", ""));
    expect(result.current.status).toBe("connecting");
  });

  it("transitions to live on onopen", () => {
    const { result } = renderHook(() => useDecisionStream("", ""));
    act(() => {
      MockEventSource.instances[0].open();
    });
    expect(result.current.status).toBe("live");
  });

  it("transitions to reconnecting on onerror", () => {
    const { result } = renderHook(() => useDecisionStream("", ""));
    act(() => {
      MockEventSource.instances[0].error();
    });
    expect(result.current.status).toBe("reconnecting");
  });

  it("parses incoming messages into events array", () => {
    const { result } = renderHook(() => useDecisionStream("", ""));
    act(() => {
      MockEventSource.instances[0].emit(
        JSON.stringify({ id: 1, tick_log_id: 1, step: "SIGNAL_GENERATED", symbol: "INFY", algo: "ema", ts: "2026-01-01T10:00:00Z", context: {} })
      );
    });
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].step).toBe("SIGNAL_GENERATED");
  });

  it("ignores malformed messages silently", () => {
    const { result } = renderHook(() => useDecisionStream("", ""));
    act(() => {
      MockEventSource.instances[0].emit("not-valid-json{{{");
    });
    expect(result.current.events).toHaveLength(0);
  });

  it("closes EventSource on unmount", () => {
    const { unmount } = renderHook(() => useDecisionStream("", ""));
    unmount();
    expect(MockEventSource.instances[0].close).toHaveBeenCalled();
  });

  it("reconnects when algoName changes", () => {
    const { rerender } = renderHook(({ algo }) => useDecisionStream("", algo), {
      initialProps: { algo: "" },
    });
    expect(MockEventSource.instances).toHaveLength(1);
    rerender({ algo: "ema_crossover" });
    // New EventSource created for updated URL
    expect(MockEventSource.instances.length).toBeGreaterThanOrEqual(2);
    const lastInstance = MockEventSource.instances[MockEventSource.instances.length - 1];
    expect(lastInstance.url).toContain("algo_name=ema_crossover");
  });
});
