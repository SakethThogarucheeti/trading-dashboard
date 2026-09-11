import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../../msw/server";
import { LiveCharts } from "@/components/panels/LiveCharts";
import { useDashboardStore } from "@/store";
import type { Candle, Tick } from "@/lib/api";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

const CANDLE: Candle = { ts: "2026-05-01T09:15:00Z", open: 100, high: 105, low: 99, close: 103, volume: 1000 };
const TICK: Tick = { ts: "2026-05-01T09:15:00Z", price: 103.5 };

beforeEach(() => {
  useDashboardStore.setState({ sessionId: "s1", algoName: "", symbol: "INFY", interval: "5min" });
});

describe("LiveCharts", () => {
  it("shows 'No candle data today' when candles are empty", async () => {
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.getByText("No candle data today")).toBeInTheDocument());
  });

  it("renders the candlestick chart when candles are present", async () => {
    server.use(http.get("/api/candles", () => HttpResponse.json([CANDLE])));
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.queryByText("No candle data today")).not.toBeInTheDocument());
    expect(screen.getAllByTestId("echarts").length).toBeGreaterThan(0);
  });

  it("shows 'No tick data today' when ticks are empty", async () => {
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.getByText("No tick data today")).toBeInTheDocument());
  });

  it("renders the tick price chart when ticks are present", async () => {
    server.use(http.get("/api/ticks", () => HttpResponse.json([TICK])));
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.queryByText("No tick data today")).not.toBeInTheDocument());
  });

  it("shows 'No trades today' when there are no pnl points", async () => {
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.getByText("No trades today")).toBeInTheDocument());
  });

  it("renders the P&L chart when pnl points are present", async () => {
    server.use(
      http.get("/api/pnl", () =>
        HttpResponse.json({
          points: [{ ts: "2026-05-01T09:15:00Z", cumulative_gross: 500, cumulative_net: 480 }],
          summary: { gross: 500, costs: 20, net: 480, nifty_pct: 0.3, nifty_open: 22000, nifty_close: 22066 },
        })
      )
    );
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.queryByText("No trades today")).not.toBeInTheDocument());
  });

  it("shows the waiting message when there are no indicator charts", async () => {
    render(<LiveCharts />, { wrapper });
    await waitFor(() =>
      expect(screen.getByText("No indicator data yet — waiting for candles…")).toBeInTheDocument()
    );
  });

  it("renders a section per indicator chart when charts are present", async () => {
    server.use(
      http.get("/api/charts", () =>
        HttpResponse.json({ rsi: { rsi_14: [{ ts: "2026-05-01T09:15:00Z", value: 55 }] } })
      )
    );
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.getByText("rsi")).toBeInTheDocument());
    expect(screen.queryByText("No indicator data yet — waiting for candles…")).not.toBeInTheDocument();
  });

  it("snaps interval to the first configured interval when the current one isn't offered", async () => {
    server.use(http.get("/api/settings", () => HttpResponse.json({ candle_intervals: ["15min", "30min"] })));
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(useDashboardStore.getState().interval).toBe("15min"));
  });

  it("leaves interval untouched when it's already among the configured ones", async () => {
    server.use(http.get("/api/settings", () => HttpResponse.json({ candle_intervals: ["1min", "5min"] })));
    render(<LiveCharts />, { wrapper });
    await waitFor(() => expect(screen.getByText("Candlestick")).toBeInTheDocument());
    expect(useDashboardStore.getState().interval).toBe("5min");
  });

  it("typing a symbol and clicking Load updates the store symbol", async () => {
    const user = userEvent.setup();
    render(<LiveCharts />, { wrapper });
    const input = screen.getByPlaceholderText("Symbol");
    await user.clear(input);
    await user.type(input, "tcs");
    await user.click(screen.getByText("Load"));
    expect(useDashboardStore.getState().symbol).toBe("TCS");
  });
});
