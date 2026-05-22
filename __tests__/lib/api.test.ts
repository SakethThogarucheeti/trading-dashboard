import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  fetchSignals,
  fetchPnl,
  fetchCharts,
  fetchPnlByAlgo,
  fetchAlgos,
} from "@/lib/api";

const server = setupServer(
  http.get("/api/signals", ({ request }) => {
    const url = new URL(request.url);
    const algoName = url.searchParams.get("algo_name") ?? "";
    return HttpResponse.json([
      { created_at: "2026-01-01T10:00:00Z", symbol: "INFY", algo_name: algoName || "default", step: "SIGNAL_GENERATED", context: "{}" },
    ]);
  }),
  http.get("/api/pnl", ({ request }) => {
    const url = new URL(request.url);
    const algoName = url.searchParams.get("algo_name") ?? "";
    return HttpResponse.json({
      points: [],
      summary: { gross: algoName === "ema" ? 500 : 0, costs: 0, net: algoName === "ema" ? 500 : 0, nifty_pct: null, nifty_open: null, nifty_close: null },
    });
  }),
  http.get("/api/charts", ({ request }) => {
    const url = new URL(request.url);
    const algoName = url.searchParams.get("algo_name") ?? "";
    return HttpResponse.json(algoName ? { ema: { ema_20: [] } } : {});
  }),
  http.get("/api/pnl/by-algo", () =>
    HttpResponse.json({
      ema_crossover: { gross: 1000, costs: 50, net: 950 },
      rsi_mean_rev: { gross: -200, costs: 30, net: -230 },
    })
  ),
  http.get("/api/algos", () =>
    HttpResponse.json([
      { name: "ema_crossover", strategy_id: "ema", warmup_candles: 20, candle_intervals: ["5min"], equity: 100000, enabled: true, params: {}, state: {}, updated_at: null },
    ])
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("fetchSignals", () => {
  it("fetches all signals when no algoName", async () => {
    const signals = await fetchSignals();
    expect(signals).toHaveLength(1);
    expect(signals[0].algo_name).toBe("default");
  });

  it("passes algo_name query param when provided", async () => {
    const signals = await fetchSignals("", "ema_crossover");
    expect(signals[0].algo_name).toBe("ema_crossover");
  });

  it("passes session_id query param when provided", async () => {
    const signals = await fetchSignals("bt-001");
    expect(signals).toHaveLength(1);
  });
});

describe("fetchPnl", () => {
  it("returns zero P&L when no algoName", async () => {
    const result = await fetchPnl();
    expect(result.summary.gross).toBe(0);
  });

  it("passes algo_name and returns filtered P&L", async () => {
    const result = await fetchPnl("", "ema");
    expect(result.summary.gross).toBe(500);
    expect(result.summary.net).toBe(500);
  });

  it("response has points array", async () => {
    const result = await fetchPnl();
    expect(Array.isArray(result.points)).toBe(true);
  });
});

describe("fetchCharts", () => {
  it("returns empty object when no algoName", async () => {
    const result = await fetchCharts();
    expect(result).toEqual({});
  });

  it("passes algo_name and returns filtered charts", async () => {
    const result = await fetchCharts("", "ema_crossover");
    expect(result).toHaveProperty("ema");
  });
});

describe("fetchPnlByAlgo", () => {
  it("returns per-algo P&L breakdown", async () => {
    const result = await fetchPnlByAlgo();
    expect(result).toHaveProperty("ema_crossover");
    expect(result.ema_crossover.net).toBe(950);
    expect(result.ema_crossover.gross).toBe(1000);
    expect(result.ema_crossover.costs).toBe(50);
  });

  it("includes negative P&L algos", async () => {
    const result = await fetchPnlByAlgo();
    expect(result.rsi_mean_rev.net).toBe(-230);
  });
});

describe("fetchAlgos", () => {
  it("returns algo list", async () => {
    const result = await fetchAlgos();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("ema_crossover");
  });
});
