import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { PositionsPanel } from "@/components/panels/PositionsPanel";
import { server } from "@/__tests__/msw/server";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("PositionsPanel", () => {
  it("shows 'No data' when there are no positions", async () => {
    render(<PositionsPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText("No data")).toBeInTheDocument());
  });

  it("renders a row per position with signed qty", async () => {
    server.use(
      http.get("/api/positions", () =>
        HttpResponse.json([
          { symbol: "INFY", instrument_type: "EQ", net_qty: 50, avg_price: 1500.5, updated_at: "2026-08-25T05:00:00Z" },
          { symbol: "TCS", instrument_type: "EQ", net_qty: -10, avg_price: 3800.0, updated_at: null },
        ]),
      ),
    );
    render(<PositionsPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText("INFY")).toBeInTheDocument());
    expect(screen.getByText("TCS")).toBeInTheDocument();
    expect(screen.getByText("+50")).toBeInTheDocument();
    expect(screen.getByText("-10")).toBeInTheDocument();
  });
});
