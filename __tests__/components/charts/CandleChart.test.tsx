import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CandleChart } from "@/components/charts/CandleChart";
import type { Candle } from "@/lib/api";

const candles: Candle[] = [
  { ts: "2026-05-19T04:00:00Z", open: 100, high: 105, low: 98, close: 102 },
  { ts: "2026-05-19T04:05:00Z", open: 102, high: 108, low: 101, close: 107 },
] as Candle[];

describe("CandleChart", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(<CandleChart candles={candles} data-testid="chart" />);
    expect(getByTestId("chart")).toBeInTheDocument();
  });

  it("maps candles to [open, close, low, high] series data", () => {
    const { getByTestId } = render(<CandleChart candles={candles} data-testid="chart" />);
    const option = JSON.parse(getByTestId("chart").getAttribute("data-option")!);
    expect(option.series[0].data).toEqual([
      [100, 102, 98, 105],
      [102, 107, 101, 108],
    ]);
  });

  it("respects a custom height", () => {
    const { getByTestId } = render(
      <CandleChart candles={candles} height={400} data-testid="chart" />
    );
    expect(getByTestId("chart")).toBeInTheDocument();
  });
});
