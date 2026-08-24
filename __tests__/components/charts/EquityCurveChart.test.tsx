import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { EquityCurveChart } from "@/components/charts/EquityCurveChart";

describe("EquityCurveChart", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(
      <EquityCurveChart
        equityCurve={[
          ["2026-05-19T00:00:00Z", 100000],
          ["2026-05-20T00:00:00Z", 105000],
        ]}
        data-testid="chart"
      />
    );
    expect(getByTestId("chart")).toBeInTheDocument();
  });

  it("marks a drawdown region when equity dips below the running max", () => {
    const { getByTestId } = render(
      <EquityCurveChart
        equityCurve={[
          ["2026-05-19T00:00:00Z", 100000],
          ["2026-05-20T00:00:00Z", 90000],
          ["2026-05-21T00:00:00Z", 100000],
        ]}
        data-testid="chart"
      />
    );
    const option = JSON.parse(getByTestId("chart").getAttribute("data-option")!);
    expect(option.series[0].markArea.data).toEqual([
      [{ xAxis: "2026-05-20" }, { xAxis: "2026-05-21" }],
    ]);
  });
});
