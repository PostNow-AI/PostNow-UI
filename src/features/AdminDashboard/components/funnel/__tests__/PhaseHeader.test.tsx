/**
 * Tests for PhaseHeader component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhaseHeader } from "../PhaseHeader";
import type { FunnelPhase } from "../../../types";

describe("PhaseHeader", () => {
  const mockPhase: FunnelPhase = {
    id: 1,
    name: "Boas-vindas",
    nameEn: "Welcome",
    steps: [1, 2, 3],
    color: "bg-blue-500",
    textColor: "text-blue-400",
    lightTextColor: "text-blue-200",
  };

  const defaultProps = {
    phase: mockPhase,
    headerTotalRate: 100,
    phaseConversion: 100,
    isFirstPhase: true,
    onPhaseClick: vi.fn(),
  };

  it("renders phase name", () => {
    render(<PhaseHeader {...defaultProps} />);
    expect(screen.getByText("Boas-vindas")).toBeInTheDocument();
  });

  it("renders total rate percentage", () => {
    render(<PhaseHeader {...defaultProps} headerTotalRate={88} />);
    expect(screen.getByText("88%")).toBeInTheDocument();
  });

  it("does not render conversion rate for first phase", () => {
    render(<PhaseHeader {...defaultProps} isFirstPhase={true} phaseConversion={96} />);
    // Should only have one percentage (the total rate)
    const percentages = screen.getAllByText(/%$/);
    expect(percentages).toHaveLength(1);
  });

  it("renders conversion rate for non-first phases", () => {
    render(
      <PhaseHeader
        {...defaultProps}
        isFirstPhase={false}
        headerTotalRate={88}
        phaseConversion={96}
      />
    );
    expect(screen.getByText("88%")).toBeInTheDocument();
    expect(screen.getByText("96%")).toBeInTheDocument();
  });

  it("calls onPhaseClick when clicked", () => {
    const onPhaseClick = vi.fn();
    render(<PhaseHeader {...defaultProps} onPhaseClick={onPhaseClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onPhaseClick).toHaveBeenCalledTimes(1);
  });

  it("calls onPhaseClick on Enter key", () => {
    const onPhaseClick = vi.fn();
    render(<PhaseHeader {...defaultProps} onPhaseClick={onPhaseClick} />);

    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onPhaseClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct color class for high conversion", () => {
    render(
      <PhaseHeader {...defaultProps} isFirstPhase={false} phaseConversion={95} />
    );
    const conversionElement = screen.getByText("95%");
    expect(conversionElement).toHaveClass("text-green-300");
  });

  it("applies correct color class for medium conversion", () => {
    render(
      <PhaseHeader {...defaultProps} isFirstPhase={false} phaseConversion={75} />
    );
    const conversionElement = screen.getByText("75%");
    expect(conversionElement).toHaveClass("text-yellow-300");
  });

  it("applies correct color class for low conversion", () => {
    render(
      <PhaseHeader {...defaultProps} isFirstPhase={false} phaseConversion={60} />
    );
    const conversionElement = screen.getByText("60%");
    expect(conversionElement).toHaveClass("text-red-300");
  });
});
