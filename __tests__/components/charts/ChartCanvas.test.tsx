import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChartCanvas } from "@/components/charts/ChartCanvas";

describe("ChartCanvas", () => {
  it("renders the given option under the given data-testid", () => {
    const { getByTestId } = render(
      <ChartCanvas option={{ series: [{ type: "line", data: [1, 2, 3] }] }} height={200} data-testid="canvas" />
    );
    const el = getByTestId("canvas");
    expect(el).toBeInTheDocument();
    expect(JSON.parse(el.getAttribute("data-option")!)).toEqual({
      series: [{ type: "line", data: [1, 2, 3] }],
    });
  });

  it("falls back to the default echarts test id when none is given", () => {
    const { getByTestId } = render(<ChartCanvas option={{}} height={100} />);
    expect(getByTestId("echarts")).toBeInTheDocument();
  });
});
