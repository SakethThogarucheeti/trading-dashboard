import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../../msw/server";
import type { LiveReport } from "@/lib/api";

/**
 * First route-level test in this repo -- see #15. LiveReportPage uses
 * Route.useSearch()/Link, both from @tanstack/react-router.
 *
 * Standing up a real router (routeTree + RouterProvider) hits a genuine
 * blocker: this app's __root.tsx renders a full <html>/<head>/<body> SSR
 * document shell (TanStack Start), which doesn't mount inside jsdom's
 * render() container. Grafting live.tsx's own exported Route onto a
 * lighter test-only root also fails ("Duplicate routes found with id:
 * __root__") -- file-routes carry an internal root binding that a
 * separately-constructed root collides with.
 *
 * Instead of an integration-style router harness, mocks createFileRoute
 * (so Route.useSearch() returns fixed search params) and Link (plain
 * anchor) -- a standard unit-testing pattern for router-coupled page
 * components that doesn't need real router internals at all.
 */
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (opts: { component: unknown }) => ({
    ...opts,
    useSearch: () => ({ period: "day" as const, date: undefined }),
  }),
  Link: ({ children, to, ...rest }: { children: React.ReactNode; to: string; [key: string]: unknown }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

// Imported after the mock so LiveReportPage's module-level Route picks it up.
const { LiveReportPage } = await import("@/src/routes/reports/live");

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

function _report(overrides: Partial<LiveReport> = {}): LiveReport {
  return {
    period: "day",
    start: "2026-01-05T00:00:00Z",
    end: "2026-01-05T23:59:59Z",
    signal_funnel: {
      candles_emitted: 100,
      signals_generated: 5,
      signals_accepted: 3,
      signals_rejected: 2,
      acceptance_rate: 0.6,
      rejection_reasons: { AFTER_CUTOFF: 2 },
    },
    order_funnel: {
      placed: 3,
      filled: 3,
      rejected: 0,
      cancelled: 0,
      fill_rate: 1.0,
    },
    pnl_summary: {
      gross: 1500,
      costs: 50,
      net: 1450,
      nifty_pct: 0.5,
      nifty_open: 22000,
      nifty_close: 22110,
      algo_pct: 1.45,
    },
    trades_by_symbol: [
      { symbol: "INFY", buys: 2, sells: 1, volume: 300, cash_flow: 1450 },
    ],
    benchmark: null,
    algo_configs: [],
    system_health: [],
    ...overrides,
  };
}

describe("LiveReportPage", () => {
  it("renders the signal funnel and P&L summary for the fetched report", async () => {
    server.use(http.get("/api/reports/live", () => HttpResponse.json(_report())));

    render(<LiveReportPage />, { wrapper });

    await waitFor(() => expect(screen.getByText("Signal Funnel")).toBeInTheDocument());
    expect(screen.getByText("Candles Emitted")).toBeInTheDocument();
    expect(screen.getByText("P&L Summary")).toBeInTheDocument();
  });

  it("renders the Trades by Symbol table when trades_by_symbol is non-empty", async () => {
    server.use(http.get("/api/reports/live", () => HttpResponse.json(_report())));

    render(<LiveReportPage />, { wrapper });

    await waitFor(() => expect(screen.getByText("Trades by Symbol")).toBeInTheDocument());
    expect(screen.getByText("INFY")).toBeInTheDocument();
  });

  it("omits the Trades by Symbol table when trades_by_symbol is empty", async () => {
    server.use(
      http.get("/api/reports/live", () => HttpResponse.json(_report({ trades_by_symbol: [] }))),
    );

    render(<LiveReportPage />, { wrapper });

    await waitFor(() => expect(screen.getByText("Signal Funnel")).toBeInTheDocument());
    expect(screen.queryByText("Trades by Symbol")).not.toBeInTheDocument();
  });

  it("shows the error message when the report fetch fails", async () => {
    server.use(http.get("/api/reports/live", () => new HttpResponse(null, { status: 500 })));

    render(<LiveReportPage />, { wrapper });

    await waitFor(() => expect(screen.getByText(/Failed to load report/)).toBeInTheDocument());
  });
});
