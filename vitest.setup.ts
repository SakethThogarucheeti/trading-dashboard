import "@testing-library/jest-dom";
import React from "react";
import { vi, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./__tests__/msw/server";

// jsdom does not implement EventSource — provide a minimal stub so components
// that use useDecisionStream can render without throwing.
class _StubEventSource {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;
  readyState = 0;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;
  constructor(public url: string) {}
  close() { this.readyState = 2; }
  addEventListener() {}
  removeEventListener() {}
}
vi.stubGlobal("EventSource", _StubEventSource);

vi.mock("echarts-for-react", () => ({
  default: ({ option, "data-testid": tid }: { option: unknown; "data-testid"?: string }) =>
    React.createElement("div", {
      "data-testid": tid ?? "echarts",
      "data-option": JSON.stringify(option),
    }),
}));

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
