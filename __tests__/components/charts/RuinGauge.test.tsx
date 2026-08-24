import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RuinGauge } from "@/components/charts/RuinGauge";

describe("RuinGauge", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(<RuinGauge probabilityOfRuin={0.032} data-testid="chart" />);
    expect(getByTestId("chart")).toBeInTheDocument();
  });

  it("converts probability to a percentage gauge value", () => {
    const { getByTestId } = render(<RuinGauge probabilityOfRuin={0.032} data-testid="chart" />);
    const option = JSON.parse(getByTestId("chart").getAttribute("data-option")!);
    expect(option.series[0].data[0].value).toBe(3.2);
  });
});
