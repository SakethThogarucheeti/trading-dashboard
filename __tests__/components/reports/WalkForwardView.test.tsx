import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WalkForwardView } from "@/components/reports/views/WalkForwardView";
import type { BacktestReport, WalkForwardReport } from "@/lib/api";

function _window(overrides: Partial<BacktestReport> = {}): BacktestReport {
  return {
    session_type: "backtest",
    session_id: "w1",
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
    total_trades: 20,
    equity_curve: [],
    trades: [],
    started_at: "2026-01-01T00:00:00Z",
    finished_at: "2026-01-31T00:00:00Z",
    ...overrides,
  };
}

function _report(overrides: Partial<WalkForwardReport> = {}): WalkForwardReport {
  return {
    session_type: "walk_forward",
    session_id: "wf-001",
    aggregate_sharpe: 1.1,
    aggregate_max_drawdown: 0.1,
    aggregate_win_rate: 0.5,
    combined_equity_curve: [],
    windows: [_window()],
    started_at: "2026-01-01T00:00:00Z",
    finished_at: "2026-02-01T00:00:00Z",
    ...overrides,
  };
}

describe("WalkForwardView", () => {
  it("renders header fields", () => {
    render(<WalkForwardView report={_report()} />);
    expect(screen.getByText("1")).toBeInTheDocument(); // windows.length
    expect(screen.getByText("wf-001")).toBeInTheDocument();
  });

  it("renders aggregate metric cards", () => {
    render(<WalkForwardView report={_report()} />);
    expect(screen.getByText("Aggregate Sharpe")).toBeInTheDocument();
    expect(screen.getByText("Aggregate Max DD")).toBeInTheDocument();
    expect(screen.getByText("Aggregate Win Rate")).toBeInTheDocument();
    expect(screen.getByText("1.200")).toBeInTheDocument(); // aggregate_sharpe.toFixed(3)
  });

  it("renders one row per window in the table", () => {
    render(<WalkForwardView report={_report({ windows: [_window(), _window({ session_id: "w2" })] })} />);
    expect(screen.getByText("W1")).toBeInTheDocument();
    expect(screen.getByText("W2")).toBeInTheDocument();
  });
});
