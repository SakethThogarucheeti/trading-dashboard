import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../msw/server";
import { useLiveChartsData } from "@/hooks/useLiveChartsData";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("useLiveChartsData", () => {
  it("returns the configured intervals from settings", async () => {
    const setInterval = vi.fn();
    const { result } = renderHook(() => useLiveChartsData("INFY", "5min", "s1", "", setInterval), { wrapper });
    await waitFor(() => expect(result.current.availableIntervals).toEqual(["1min", "5min", "15min"]));
  });

  it("snaps interval to the first configured one when the current interval isn't offered", async () => {
    const setInterval = vi.fn();
    renderHook(() => useLiveChartsData("INFY", "30min", "s1", "", setInterval), { wrapper });
    await waitFor(() => expect(setInterval).toHaveBeenCalledWith("1min"));
  });

  it("does not call setInterval when the current interval is already configured", async () => {
    const setInterval = vi.fn();
    const { result } = renderHook(() => useLiveChartsData("INFY", "5min", "s1", "", setInterval), { wrapper });
    await waitFor(() => expect(result.current.availableIntervals).toEqual(["1min", "5min", "15min"]));
    expect(setInterval).not.toHaveBeenCalled();
  });

  it("defaults candles/ticks/charts to empty when nothing is mocked beyond the global handlers", async () => {
    const { result } = renderHook(() => useLiveChartsData("INFY", "5min", "s1", "", vi.fn()), { wrapper });
    await waitFor(() => expect(result.current.availableIntervals.length).toBeGreaterThan(0));
    expect(result.current.candles).toEqual([]);
    expect(result.current.ticks).toEqual([]);
    expect(result.current.charts).toEqual({});
  });

  it("builds a single areaGradient tickSeries named after the symbol", async () => {
    server.use(
      http.get("/api/ticks", () => HttpResponse.json([{ ts: "2026-05-01T09:15:00Z", price: 103.5 }]))
    );
    const { result } = renderHook(() => useLiveChartsData("INFY", "5min", "s1", "", vi.fn()), { wrapper });
    await waitFor(() => expect(result.current.ticks).toHaveLength(1));
    expect(result.current.tickSeries).toHaveLength(1);
    expect(result.current.tickSeries[0].name).toBe("INFY");
    expect(result.current.tickSeries[0].areaGradient).toBe(true);
    expect(result.current.tickSeries[0].data[0]).toEqual({ ts: "2026-05-01T09:15:00Z", value: 103.5 });
  });

  it("builds a two-series pnlSeries (gross dashed, net with symbols) from pnl points", async () => {
    server.use(
      http.get("/api/pnl", () =>
        HttpResponse.json({
          points: [{ ts: "2026-05-01T09:15:00Z", cumulative_gross: 500, cumulative_net: 480 }],
          summary: { gross: 500, costs: 20, net: 480, nifty_pct: 0.3, nifty_open: 22000, nifty_close: 22066 },
        })
      )
    );
    const { result } = renderHook(() => useLiveChartsData("INFY", "5min", "s1", "", vi.fn()), { wrapper });
    await waitFor(() => expect(result.current.pnlPoints).toHaveLength(1));
    expect(result.current.pnlSeries).toHaveLength(2);
    expect(result.current.pnlSeries[0].name).toBe("Gross P&L");
    expect(result.current.pnlSeries[0].dashed).toBe(true);
    expect(result.current.pnlSeries[1].name).toBe("Net P&L (after costs)");
    expect(result.current.pnlSeries[1].showSymbol).toBe(true);
    expect(result.current.pnlSummary.net).toBe(480);
  });

  it("falls back to the empty pnl summary when there's no pnl data", async () => {
    const { result } = renderHook(() => useLiveChartsData("INFY", "5min", "s1", "", vi.fn()), { wrapper });
    await waitFor(() => expect(result.current.availableIntervals.length).toBeGreaterThan(0));
    expect(result.current.pnlSummary.gross).toBe(0);
    expect(result.current.pnlPoints).toEqual([]);
  });
});
