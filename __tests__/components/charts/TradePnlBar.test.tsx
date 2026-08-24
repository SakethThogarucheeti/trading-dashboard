import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TradePnlBar } from "@/components/charts/TradePnlBar";
import type { TradeRecord } from "@/lib/api";

const trades: TradeRecord[] = [
  { symbol: "RELIANCE", pnl: 150, entry_price: 2500, exit_price: 2510, qty: 15 },
  { symbol: "TCS", pnl: -80, entry_price: 3600, exit_price: 3592, qty: 10 },
] as TradeRecord[];

describe("TradePnlBar", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(<TradePnlBar trades={trades} data-testid="chart" />);
    expect(getByTestId("chart")).toBeInTheDocument();
  });

  it("colors bars by pnl sign", () => {
    const { getByTestId } = render(<TradePnlBar trades={trades} data-testid="chart" />);
    const option = JSON.parse(getByTestId("chart").getAttribute("data-option")!);
    expect(option.series[0].data[0].value).toBe(150);
    expect(option.series[0].data[1].value).toBe(-80);
  });
});
