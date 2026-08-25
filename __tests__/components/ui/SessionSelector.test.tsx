import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionSelector } from "@/components/ui/SessionSelector";
import { useDashboardStore } from "@/store";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  useDashboardStore.setState({ sessionId: "" });
});

describe("SessionSelector", () => {
  it("renders 'live' as default option", async () => {
    render(<SessionSelector />, { wrapper });
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("live")).toBeInTheDocument();
  });

  it("shows session ids from API", async () => {
    render(<SessionSelector />, { wrapper });
    await waitFor(() => expect(screen.getByText("bt-test-001")).toBeInTheDocument());
    expect(screen.getByText("mc-test-001")).toBeInTheDocument();
  });

  it("filters out null entries from the API response", async () => {
    render(<SessionSelector />, { wrapper });
    await waitFor(() => expect(screen.getByText("bt-test-001")).toBeInTheDocument());
    // mockSessionIds includes a trailing null -- only "live" plus the 2 real ids should render
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("reflects current sessionId from store as selected value", async () => {
    useDashboardStore.setState({ sessionId: "" });
    render(<SessionSelector />, { wrapper });
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("");
  });

  it("calls setSessionId when selection changes", async () => {
    const user = userEvent.setup();
    render(<SessionSelector />, { wrapper });
    await waitFor(() => expect(screen.getByText("bt-test-001")).toBeInTheDocument());
    await user.selectOptions(screen.getByRole("combobox"), "bt-test-001");
    expect(useDashboardStore.getState().sessionId).toBe("bt-test-001");
  });

  it("selecting 'live' sets sessionId to empty string", async () => {
    const user = userEvent.setup();
    useDashboardStore.setState({ sessionId: "bt-test-001" });
    render(<SessionSelector />, { wrapper });
    await waitFor(() => expect(screen.getByText("bt-test-001")).toBeInTheDocument());
    await user.selectOptions(screen.getByRole("combobox"), "");
    expect(useDashboardStore.getState().sessionId).toBe("");
  });
});
