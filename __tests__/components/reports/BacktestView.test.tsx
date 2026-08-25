import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BacktestView } from "@/components/reports/views/BacktestView";
import type { BacktestReport } from "@/lib/api";

function _report(overrides: Partial<BacktestReport> = {}): BacktestReport {
  return {
    session_type: "backtest",
    session_id: "bt-001",
    algo_name: "ema_crossover",
    start: "2026-01-01T00:00:00Z",
    end: "2026-01-31T00:00:00Z",
    initial_equity: 100_000,
    final_equity: 105_000,
    sharpe_ratio: 1.2,
    max_drawdown: 0.08,
    max_drawdown_duration_secs: 3600,
    win_rate: 0.55,
    profit_factor: 1.4,
    cagr: 0.12,
    calmar_ratio: 1.5,
    total_trades: 2,
    equity_curve: [],
    trades: [
      {
        symbol: "INFY",
        side: "BUY",
        qty: 10,
        entry_price: 1500,
        exit_price: 1520,
        pnl: 200,
        entry_time: "2026-01-05T09:15:00Z",
        exit_time: "2026-01-05T10:00:00Z",
      },
      {
        symbol: "TCS",
        side: "SELL",
        qty: 5,
        entry_price: 3400,
        exit_price: 3380,
        pnl: 100,
        entry_time: "2026-01-06T09:15:00Z",
        exit_time: "2026-01-06T09:45:00Z",
      },
    ],
    started_at: "2026-01-01T00:00:00Z",
    finished_at: "2026-01-31T00:00:00Z",
    ...overrides,
  };
}

describe("BacktestView", () => {
  it("renders header fields", () => {
    render(<BacktestView report={_report()} />);
    expect(screen.getByText("ema_crossover")).toBeInTheDocument();
    expect(screen.getByText("bt-001")).toBeInTheDocument();
  });

  it("renders metrics", () => {
    render(<BacktestView report={_report()} />);
    expect(screen.getByText("Sharpe Ratio")).toBeInTheDocument();
    expect(screen.getByText("1.200")).toBeInTheDocument();
    expect(screen.getByText("Total Trades")).toBeInTheDocument();
  });

  it("renders one row per trade in the trade table", () => {
    render(<BacktestView report={_report()} />);
    expect(screen.getByText("INFY")).toBeInTheDocument();
    expect(screen.getByText("TCS")).toBeInTheDocument();
  });

  it("shows 'No trades' and omits the trade table when trades is empty", () => {
    render(<BacktestView report={_report({ trades: [], total_trades: 0 })} />);
    expect(screen.getByText("No trades")).toBeInTheDocument();
  });
});
