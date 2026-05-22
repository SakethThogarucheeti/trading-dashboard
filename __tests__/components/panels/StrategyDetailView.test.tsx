import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrategyDetailView } from "@/components/panels/StrategyDetailView";
import { useDashboardStore } from "@/store";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  useDashboardStore.setState({ algoName: "ema_crossover", sessionId: "" });
});

describe("StrategyDetailView", () => {
  it("renders the algo name as heading", async () => {
    render(<StrategyDetailView />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
  });

  it("renders '← All strategies' back button", () => {
    render(<StrategyDetailView />, { wrapper });
    expect(screen.getByText(/← All strategies/)).toBeInTheDocument();
  });

  it("clicking back button resets algoName to empty string", async () => {
    const user = userEvent.setup();
    render(<StrategyDetailView />, { wrapper });
    await user.click(screen.getByText(/← All strategies/));
    expect(useDashboardStore.getState().algoName).toBe("");
  });

  it("shows strategy_id when algo data loads", async () => {
    render(<StrategyDetailView />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema")).toBeInTheDocument());
  });

  it("shows 'P&L' section header with algo name", async () => {
    render(<StrategyDetailView />, { wrapper });
    await waitFor(() => expect(screen.getByText(/P&L — ema_crossover/)).toBeInTheDocument());
  });

  it("renders algo params section", async () => {
    render(<StrategyDetailView />, { wrapper });
    await waitFor(() => expect(screen.getByText(/PARAMS/)).toBeInTheDocument());
  });
});
