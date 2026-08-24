import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ReturnDistHistogram } from "@/components/charts/ReturnDistHistogram";

describe("ReturnDistHistogram", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(
      <ReturnDistHistogram
        returnDistribution={[-0.05, -0.02, 0, 0.02, 0.05, 0.08]}
        percentile5={-0.04}
        percentile95={0.07}
        data-testid="chart"
      />
    );
    expect(getByTestId("chart")).toBeInTheDocument();
  });

  it("draws percentile mark lines labeled 5th and 95th", () => {
    const { getByTestId } = render(
      <ReturnDistHistogram
        returnDistribution={[-0.05, -0.02, 0, 0.02, 0.05, 0.08]}
        percentile5={-0.04}
        percentile95={0.07}
        data-testid="chart"
      />
    );
    const option = JSON.parse(getByTestId("chart").getAttribute("data-option")!);
    const labels = option.series[0].markLine.data.map((d: { label: { formatter: string } }) => d.label.formatter);
    expect(labels).toEqual(["5th", "95th"]);
  });
});
