/**
 * Tests for StepRow component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StepRow } from "../StepRow";

describe("StepRow", () => {
  const defaultProps = {
    stepNum: 2,
    stepCount: 98,
    stepRate: 98,
    displayRate: 98,
    isFirstStep: false,
    phaseColor: "bg-blue-500",
    onPhaseClick: vi.fn(),
  };

  it("renders step name", () => {
    render(<StepRow {...defaultProps} />);
    expect(screen.getByText("Nome do Negócio")).toBeInTheDocument();
  });

  it("renders step count", () => {
    render(<StepRow {...defaultProps} />);
    expect(screen.getByText("98")).toBeInTheDocument();
  });

  it("renders conversion rate when not first step", () => {
    render(<StepRow {...defaultProps} />);
    expect(screen.getByText("98%")).toBeInTheDocument();
  });

  it("does not render conversion rate for first step", () => {
    render(<StepRow {...defaultProps} isFirstStep={true} />);
    expect(screen.queryByText("98%")).not.toBeInTheDocument();
  });

  it("calls onPhaseClick when clicked", () => {
    const onPhaseClick = vi.fn();
    render(<StepRow {...defaultProps} onPhaseClick={onPhaseClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onPhaseClick).toHaveBeenCalledTimes(1);
  });

  it("calls onPhaseClick on Enter key", () => {
    const onPhaseClick = vi.fn();
    render(<StepRow {...defaultProps} onPhaseClick={onPhaseClick} />);

    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onPhaseClick).toHaveBeenCalledTimes(1);
  });

  it("applies green color for high conversion rate", () => {
    render(<StepRow {...defaultProps} stepRate={95} />);
    const rateElement = screen.getByText("95%");
    expect(rateElement).toHaveClass("text-green-300");
  });

  it("applies yellow color for medium conversion rate", () => {
    render(<StepRow {...defaultProps} stepRate={85} />);
    const rateElement = screen.getByText("85%");
    expect(rateElement).toHaveClass("text-yellow-300");
  });

  it("applies red color for low conversion rate", () => {
    render(<StepRow {...defaultProps} stepRate={70} />);
    const rateElement = screen.getByText("70%");
    expect(rateElement).toHaveClass("text-red-300");
  });
});
