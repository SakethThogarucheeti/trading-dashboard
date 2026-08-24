import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WarmupBar } from "@/components/charts/WarmupBar";

describe("WarmupBar", () => {
  it("renders with the given data-testid", () => {
    const { getByTestId } = render(<WarmupBar barsSeen={5} warmupTarget={20} data-testid="bar" />);
    expect(getByTestId("bar")).toBeInTheDocument();
  });

  it("computes percentage progress and shows the percent label when incomplete", () => {
    const { getByTestId } = render(<WarmupBar barsSeen={5} warmupTarget={20} data-testid="bar" />);
    const option = JSON.parse(getByTestId("bar").getAttribute("data-option")!);
    expect(option.series[0].data[0].value).toBe(25);
    expect(option.series[0].label.formatter).toBe("25%");
  });

  it("shows a checkmark and caps at 100 when warmup is complete", () => {
    const { getByTestId } = render(<WarmupBar barsSeen={25} warmupTarget={20} data-testid="bar" />);
    const option = JSON.parse(getByTestId("bar").getAttribute("data-option")!);
    expect(option.series[0].data[0].value).toBe(100);
    expect(option.series[0].label.formatter).toBe("✓");
  });
});
