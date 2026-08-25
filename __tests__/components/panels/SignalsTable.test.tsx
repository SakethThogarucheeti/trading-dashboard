import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { SignalsTable } from "@/components/panels/SignalsTable";
import { server } from "@/__tests__/msw/server";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("SignalsTable", () => {
  it("shows 'No signals today' when there are no signals", async () => {
    render(<SignalsTable />, { wrapper });
    await waitFor(() => expect(screen.getByText("No signals today")).toBeInTheDocument());
  });

  it("renders a row per signal with its step", async () => {
    server.use(
      http.get("/api/signals", () =>
        HttpResponse.json([
          {
            created_at: "2026-08-25T05:00:00Z",
            symbol: "INFY",
            algo_name: "ema_crossover",
            step: "SIGNAL_ACCEPTED",
            context: '{"qty": 10}',
          },
        ]),
      ),
    );
    render(<SignalsTable />, { wrapper });
    await waitFor(() => expect(screen.getByText("INFY")).toBeInTheDocument());
    expect(screen.getByText("SIGNAL_ACCEPTED")).toBeInTheDocument();
    expect(screen.getByText("qty=10")).toBeInTheDocument();
  });
});
