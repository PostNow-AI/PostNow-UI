/**
 * Tests for PercentageLabel component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PercentageLabel } from "../PercentageLabel";

describe("PercentageLabel", () => {
  it("renders the percentage value", () => {
    render(<PercentageLabel rate={75} colorClass="text-blue-200" />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("applies the color class", () => {
    render(<PercentageLabel rate={50} colorClass="text-green-300" />);
    const label = screen.getByText("50%");
    expect(label).toHaveClass("text-green-300");
  });

  it("positions on right side for high rates (>=50%)", () => {
    render(<PercentageLabel rate={80} colorClass="text-blue-200" />);
    const label = screen.getByText("80%");
    // High rates position from the right edge
    expect(label.style.right).toBeTruthy();
    expect(label.style.left).toBeFalsy();
  });

  it("positions on left side for low rates (<50%)", () => {
    render(<PercentageLabel rate={30} colorClass="text-red-300" />);
    const label = screen.getByText("30%");
    // Low rates position from the left edge
    expect(label.style.left).toBeTruthy();
    expect(label.style.right).toBeFalsy();
  });

  it("renders 0% correctly", () => {
    render(<PercentageLabel rate={0} colorClass="text-red-300" />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders 100% correctly", () => {
    render(<PercentageLabel rate={100} colorClass="text-green-300" />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("has correct base styles", () => {
    render(<PercentageLabel rate={50} colorClass="text-blue-200" />);
    const label = screen.getByText("50%");
    expect(label).toHaveClass("absolute");
    expect(label).toHaveClass("font-bold");
    expect(label).toHaveClass("tabular-nums");
  });
});
