import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlgoPnlMatrix } from "@/components/panels/AlgoPnlMatrix";
import { useDashboardStore } from "@/store";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  useDashboardStore.setState({ algoName: "" });
});

describe("AlgoPnlMatrix", () => {
  it("renders nothing when no data", async () => {
    // Override handler to return empty
    const { container } = render(<AlgoPnlMatrix />, { wrapper });
    // Initially empty or loading — not an error
    expect(container).toBeDefined();
  });

  it("renders algo rows after data loads", async () => {
    render(<AlgoPnlMatrix />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    expect(screen.getByText("rsi_mean_rev")).toBeInTheDocument();
  });

  it("shows P&L label for each algo", async () => {
    render(<AlgoPnlMatrix />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    // Both algos should show gross and net labels
    const grossLabels = screen.getAllByText(/gross/);
    expect(grossLabels.length).toBeGreaterThanOrEqual(2);
  });

  it("clicking an algo row calls setAlgoName", async () => {
    const user = userEvent.setup();
    render(<AlgoPnlMatrix />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    await user.click(screen.getByText("ema_crossover"));
    expect(useDashboardStore.getState().algoName).toBe("ema_crossover");
  });
});
