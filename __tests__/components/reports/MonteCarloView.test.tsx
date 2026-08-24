import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MonteCarloView } from "@/components/reports/views/MonteCarloView";
import type { MonteCarloReport } from "@/lib/api";

function _report(overrides: Partial<MonteCarloReport> = {}): MonteCarloReport {
  return {
    session_type: "monte_carlo",
    session_id: "mc-001",
    n_trials: 1000,
    method: "bootstrap",
    probability_of_ruin: 0.02,
    percentile_5_return: -0.15,
    percentile_95_return: 0.25,
    median_drawdown: 0.1,
    return_distribution: [0.01, 0.02, -0.01],
    drawdown_distribution: [0.05, 0.1, 0.08],
    started_at: "2026-05-19T04:00:00Z",
    finished_at: "2026-05-19T04:05:00Z",
    ...overrides,
  };
}

describe("MonteCarloView", () => {
  it("renders header fields", () => {
    render(<MonteCarloView report={_report()} />);
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(screen.getByText("bootstrap")).toBeInTheDocument();
    expect(screen.getByText("mc-001")).toBeInTheDocument();
  });

  it("renders stat cards with formatted percentages", () => {
    render(<MonteCarloView report={_report()} />);
    expect(screen.getByText("5th Pct Return")).toBeInTheDocument();
    expect(screen.getByText("95th Pct Return")).toBeInTheDocument();
    expect(screen.getByText("Median Drawdown")).toBeInTheDocument();
    expect(screen.getByText("Ruin Probability")).toBeInTheDocument();
  });
});
