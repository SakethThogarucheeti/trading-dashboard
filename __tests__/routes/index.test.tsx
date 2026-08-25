import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LiveDashboardPage } from "@/src/routes/index";
import { useDashboardStore } from "@/store";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  useDashboardStore.setState({ algoName: "", sessionId: "" });
});

describe("LiveDashboardPage", () => {
  it("renders the overview layout (status panels) when no algo is selected", () => {
    render(<LiveDashboardPage />, { wrapper });
    expect(screen.getByText("Live Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Algo Status")).toBeInTheDocument();
    expect(screen.getByText("Positions")).toBeInTheDocument();
    expect(screen.getByText("Recent Signals")).toBeInTheDocument();
  });

  it("renders StrategyDetailView instead of the overview when an algo is selected", async () => {
    useDashboardStore.setState({ algoName: "ema_crossover", sessionId: "" });
    render(<LiveDashboardPage />, { wrapper });
    await waitFor(() => expect(screen.getByText("← All strategies")).toBeInTheDocument());
    expect(screen.queryByText("Algo Status")).not.toBeInTheDocument();
  });
});
