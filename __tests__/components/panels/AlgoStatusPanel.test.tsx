import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlgoStatusPanel } from "@/components/panels/AlgoStatusPanel";
import { useDashboardStore } from "@/store";
import { server } from "@/__tests__/msw/server";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  useDashboardStore.setState({ algoName: "" });
});

describe("AlgoStatusPanel", () => {
  it("renders algo name and strategy_id", async () => {
    render(<AlgoStatusPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    expect(screen.getByText("ema")).toBeInTheDocument();
  });

  it("shows 'warmed up' indicator when warmup is complete", async () => {
    render(<AlgoStatusPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText(/warmed up/i)).toBeInTheDocument());
  });

  it("shows algo params", async () => {
    render(<AlgoStatusPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    expect(screen.getByText(/fast/)).toBeInTheDocument();
  });

  it("clicking an algo card sets algoName in store", async () => {
    const user = userEvent.setup();
    render(<AlgoStatusPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    // The card root div has cursor: pointer — click the algo name text
    await user.click(screen.getByText("ema_crossover"));
    expect(useDashboardStore.getState().algoName).toBe("ema_crossover");
  });

  it("shows 'No algos configured' when list is empty", async () => {
    server.use(http.get("/api/algos", () => HttpResponse.json([])));
    render(<AlgoStatusPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText(/No algos configured/i)).toBeInTheDocument());
  });
});
