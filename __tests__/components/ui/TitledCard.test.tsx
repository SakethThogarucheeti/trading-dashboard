import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TitledCard } from "@/components/ui/TitledCard";

describe("TitledCard", () => {
  it("renders the title and children", () => {
    render(
      <TitledCard title="Positions">
        <span>row content</span>
      </TitledCard>,
    );
    expect(screen.getByText("Positions")).toBeInTheDocument();
    expect(screen.getByText("row content")).toBeInTheDocument();
  });

  it("merges an extra style override with its base styles", () => {
    render(
      <TitledCard title="Signal Funnel" style={{ marginBottom: 16 }}>
        <span>content</span>
      </TitledCard>,
    );
    const card = screen.getByText("Signal Funnel").parentElement;
    expect(card).toHaveStyle({ marginBottom: "16px", borderRadius: "8px" });
  });
});
