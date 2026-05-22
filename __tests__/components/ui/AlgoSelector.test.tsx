import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlgoSelector } from "@/components/ui/AlgoSelector";
import { useDashboardStore } from "@/store";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  useDashboardStore.setState({ algoName: "" });
});

describe("AlgoSelector", () => {
  it("renders 'All strategies' as default option", async () => {
    render(<AlgoSelector />, { wrapper });
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("All strategies")).toBeInTheDocument();
  });

  it("shows algo names from API", async () => {
    render(<AlgoSelector />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
  });

  it("reflects current algoName from store as selected value", async () => {
    useDashboardStore.setState({ algoName: "" });
    render(<AlgoSelector />, { wrapper });
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("");
  });

  it("calls setAlgoName when selection changes", async () => {
    const user = userEvent.setup();
    render(<AlgoSelector />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    await user.selectOptions(screen.getByRole("combobox"), "ema_crossover");
    expect(useDashboardStore.getState().algoName).toBe("ema_crossover");
  });

  it("selecting 'All strategies' sets algoName to empty string", async () => {
    const user = userEvent.setup();
    useDashboardStore.setState({ algoName: "ema_crossover" });
    render(<AlgoSelector />, { wrapper });
    await waitFor(() => expect(screen.getByText("ema_crossover")).toBeInTheDocument());
    await user.selectOptions(screen.getByRole("combobox"), "");
    expect(useDashboardStore.getState().algoName).toBe("");
  });
});
