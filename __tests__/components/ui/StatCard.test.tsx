import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/ui/StatCard";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Sharpe" value="1.234" />);
    expect(screen.getByText("Sharpe")).toBeInTheDocument();
    expect(screen.getByText("1.234")).toBeInTheDocument();
  });

  it("applies the given color to the value", () => {
    render(<StatCard label="Max DD" value="-8.0%" color="#ff0000" />);
    expect(screen.getByText("-8.0%")).toHaveStyle({ color: "#ff0000" });
  });
});
