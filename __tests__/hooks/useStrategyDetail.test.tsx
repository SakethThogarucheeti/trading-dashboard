import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStrategyDetail } from "@/hooks/useStrategyDetail";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("useStrategyDetail", () => {
  it("resolves the matching algo from the algos list", async () => {
    const { result } = renderHook(() => useStrategyDetail("ema_crossover", ""), { wrapper });
    await waitFor(() => expect(result.current.algo?.strategy_id).toBe("ema"));
  });

  it("returns undefined algo for an unknown algoName", async () => {
    const { result } = renderHook(() => useStrategyDetail("does_not_exist", ""), { wrapper });
    await waitFor(() => expect(result.current.pnlSummary).toBeDefined());
    expect(result.current.algo).toBeUndefined();
  });

  it("derives warmup state from the algo's raw state dict", async () => {
    const { result } = renderHook(() => useStrategyDetail("ema_crossover", ""), { wrapper });
    await waitFor(() => expect(result.current.algo).toBeDefined());
    expect(result.current.barsSeen).toBe(25);
    expect(result.current.warmupComplete).toBe(true);
    expect(result.current.lastSignalAt).toBe("2026-05-01T10:00:00Z");
  });

  it("falls back to the empty summary when pnl data has no summary", async () => {
    const { result } = renderHook(() => useStrategyDetail("ema_crossover", ""), { wrapper });
    await waitFor(() => expect(result.current.pnlSummary).toBeDefined());
    expect(result.current.pnlSummary.gross).toBe(0);
    expect(result.current.pnlPoints).toEqual([]);
  });

  it("builds a two-series pnlSeries (gross dashed, net solid)", async () => {
    const { result } = renderHook(() => useStrategyDetail("ema_crossover", ""), { wrapper });
    await waitFor(() => expect(result.current.pnlSeries).toHaveLength(2));
    expect(result.current.pnlSeries[0].name).toBe("Gross P&L");
    expect(result.current.pnlSeries[0].dashed).toBe(true);
    expect(result.current.pnlSeries[1].name).toBe("Net P&L");
  });

  it("returns an empty charts object when none are configured", async () => {
    const { result } = renderHook(() => useStrategyDetail("ema_crossover", ""), { wrapper });
    await waitFor(() => expect(result.current.algo).toBeDefined());
    expect(result.current.charts).toEqual({});
  });
});
