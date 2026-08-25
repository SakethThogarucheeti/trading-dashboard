import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { HealthPanel } from "@/components/panels/HealthPanel";
import { server } from "@/__tests__/msw/server";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("HealthPanel", () => {
  it("shows 'No data' when there are no heartbeats", async () => {
    render(<HealthPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText("No data")).toBeInTheDocument());
  });

  it("renders a row per heartbeat with STALE/OK status", async () => {
    server.use(
      http.get("/api/health", () =>
        HttpResponse.json([
          { module: "ingestor", last_seen: "2026-08-25T05:00:00Z", stale: false },
          { module: "worker-ema", last_seen: "2026-08-25T04:00:00Z", stale: true },
        ]),
      ),
    );
    render(<HealthPanel />, { wrapper });
    await waitFor(() => expect(screen.getByText("ingestor")).toBeInTheDocument());
    expect(screen.getByText("worker-ema")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.getByText("STALE")).toBeInTheDocument();
  });
});
