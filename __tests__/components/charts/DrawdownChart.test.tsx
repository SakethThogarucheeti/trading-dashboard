import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DrawdownChart } from "@/components/charts/DrawdownChart";

describe("DrawdownChart", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(
      <DrawdownChart
        equityCurve={[
          ["2026-05-19T00:00:00Z", 100000],
          ["2026-05-20T00:00:00Z", 90000],
        ]}
        data-testid="chart"
      />
    );
    expect(getByTestId("chart")).toBeInTheDocument();
  });

  it("computes drawdown as negative fraction from running max", () => {
    const { getByTestId } = render(
      <DrawdownChart
        equityCurve={[
          ["2026-05-19T00:00:00Z", 100000],
          ["2026-05-20T00:00:00Z", 90000],
          ["2026-05-21T00:00:00Z", 100000],
        ]}
        data-testid="chart"
      />
    );
    const option = JSON.parse(getByTestId("chart").getAttribute("data-option")!);
    expect(option.series[0].data).toEqual([0, -0.1, 0]);
  });
});
