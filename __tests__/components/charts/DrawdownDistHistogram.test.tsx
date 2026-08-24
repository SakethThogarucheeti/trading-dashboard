import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DrawdownDistHistogram } from "@/components/charts/DrawdownDistHistogram";

describe("DrawdownDistHistogram", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(
      <DrawdownDistHistogram
        drawdownDistribution={[-0.01, -0.02, -0.03, -0.04, -0.05]}
        data-testid="chart"
      />
    );
    expect(getByTestId("chart")).toBeInTheDocument();
  });

  it("bins the distribution into a bar series", () => {
    const { getByTestId } = render(
      <DrawdownDistHistogram
        drawdownDistribution={[-0.01, -0.02, -0.03, -0.04, -0.05]}
        data-testid="chart"
      />
    );
    const option = JSON.parse(getByTestId("chart").getAttribute("data-option")!);
    expect(option.series[0].type).toBe("bar");
    expect(Array.isArray(option.series[0].data)).toBe(true);
    expect(option.series[0].data.length).toBeGreaterThan(0);
  });
});
