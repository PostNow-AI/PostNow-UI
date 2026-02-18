import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProgressBarWithPhases, usePhaseInfo } from "../ProgressBarWithPhases";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, style, className, ...props }: any) => (
      <div style={style} className={className} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("ProgressBarWithPhases", () => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: 12,
  };

  describe("Rendering", () => {
    it("should render without errors", () => {
      const { container } = render(<ProgressBarWithPhases {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render the progress bar background", () => {
      const { container } = render(<ProgressBarWithPhases {...defaultProps} />);
      expect(container.querySelector(".bg-muted")).toBeInTheDocument();
    });

    it("should render 3 phase markers", () => {
      const { container } = render(<ProgressBarWithPhases {...defaultProps} />);
      // 3 phase markers positioned absolutely
      const markers = container.querySelectorAll(".absolute.top-1\\/2");
      expect(markers.length).toBe(3);
    });

    it("should position markers at specific points", () => {
      const { container } = render(<ProgressBarWithPhases {...defaultProps} />);
      // Check for elements with left style positioning
      const markers = container.querySelectorAll('[style*="left"]');
      expect(markers.length).toBe(3);
    });
  });

  describe("Phase Progress", () => {
    it("should not show checkmarks on step 1 (no phase complete)", () => {
      const { container } = render(<ProgressBarWithPhases currentStep={1} totalSteps={12} />);
      const checkmarks = container.querySelectorAll(".lucide-check");
      expect(checkmarks.length).toBe(0);
    });

    it("should show 1 checkmark on step 5 (phase 1 complete)", () => {
      const { container } = render(<ProgressBarWithPhases currentStep={5} totalSteps={12} />);
      const checkmarks = container.querySelectorAll(".lucide-check");
      expect(checkmarks.length).toBe(1);
    });

    it("should show 2 checkmarks on step 9 (phases 1 and 2 complete)", () => {
      const { container } = render(<ProgressBarWithPhases currentStep={9} totalSteps={12} />);
      const checkmarks = container.querySelectorAll(".lucide-check");
      expect(checkmarks.length).toBe(2);
    });

    it("should show 3 checkmarks on step 13 (all phases complete)", () => {
      const { container } = render(<ProgressBarWithPhases currentStep={13} totalSteps={12} />);
      const checkmarks = container.querySelectorAll(".lucide-check");
      expect(checkmarks.length).toBe(3);
    });
  });

  describe("Visual States", () => {
    it("active phase should have primary border", () => {
      const { container } = render(
        <ProgressBarWithPhases currentStep={1} totalSteps={12} />
      );
      const activeMarker = container.querySelector(".border-primary");
      expect(activeMarker).toBeInTheDocument();
    });

    it("complete phase should have primary background", () => {
      const { container } = render(
        <ProgressBarWithPhases currentStep={5} totalSteps={12} />
      );
      const completeMarker = container.querySelector(".bg-primary.border-primary");
      expect(completeMarker).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <ProgressBarWithPhases {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Phase Labels", () => {
    it("should show phase labels by default", () => {
      render(<ProgressBarWithPhases {...defaultProps} />);
      expect(screen.getByText("Negócio")).toBeInTheDocument();
      expect(screen.getByText("Público")).toBeInTheDocument();
      expect(screen.getByText("Marca")).toBeInTheDocument();
    });

    it("should not show labels when showPhaseNames is false", () => {
      render(<ProgressBarWithPhases {...defaultProps} showPhaseNames={false} />);
      expect(screen.queryByText("Negócio")).not.toBeInTheDocument();
      expect(screen.queryByText("Público")).not.toBeInTheDocument();
      expect(screen.queryByText("Marca")).not.toBeInTheDocument();
    });

    it("active phase label should have foreground color", () => {
      const { container } = render(
        <ProgressBarWithPhases currentStep={1} totalSteps={12} />
      );
      const activeLabels = container.querySelectorAll(".text-foreground");
      expect(activeLabels.length).toBeGreaterThan(0);
    });

    it("complete phase label should have primary color", () => {
      const { container } = render(
        <ProgressBarWithPhases currentStep={5} totalSteps={12} />
      );
      const completeLabels = container.querySelectorAll(".text-primary");
      expect(completeLabels.length).toBeGreaterThan(0);
    });
  });
});

describe("usePhaseInfo", () => {
  describe("Phase Information", () => {
    it("should return Negócio phase for steps 1-4", () => {
      const { result: result1 } = renderHook(() => usePhaseInfo(1));
      expect(result1.current.phaseName).toBe("Negócio");
      expect(result1.current.phaseIndex).toBe(0);

      const { result: result4 } = renderHook(() => usePhaseInfo(4));
      expect(result4.current.phaseName).toBe("Negócio");
    });

    it("should return Público phase for steps 5-8", () => {
      const { result } = renderHook(() => usePhaseInfo(5));
      expect(result.current.phaseName).toBe("Público");
      expect(result.current.phaseIndex).toBe(1);
    });

    it("should return Marca phase for steps 9-12", () => {
      const { result } = renderHook(() => usePhaseInfo(9));
      expect(result.current.phaseName).toBe("Marca");
      expect(result.current.phaseIndex).toBe(2);
    });

    it("should return Marca phase for steps beyond 12", () => {
      const { result } = renderHook(() => usePhaseInfo(13));
      expect(result.current.phaseName).toBe("Marca");
      expect(result.current.phaseIndex).toBe(2);
    });
  });

  describe("Position in Phase", () => {
    it("should identify first step of phase", () => {
      const { result } = renderHook(() => usePhaseInfo(1));
      expect(result.current.isFirstStepOfPhase).toBe(true);
      expect(result.current.isLastStepOfPhase).toBe(false);
    });

    it("should identify last step of phase", () => {
      const { result } = renderHook(() => usePhaseInfo(4));
      expect(result.current.isFirstStepOfPhase).toBe(false);
      expect(result.current.isLastStepOfPhase).toBe(true);
    });

    it("should identify middle step of phase", () => {
      const { result } = renderHook(() => usePhaseInfo(2));
      expect(result.current.isFirstStepOfPhase).toBe(false);
      expect(result.current.isLastStepOfPhase).toBe(false);
    });
  });

  describe("Total Phases", () => {
    it("should return total of 3 phases", () => {
      const { result } = renderHook(() => usePhaseInfo(1));
      expect(result.current.totalPhases).toBe(3);
    });
  });
});
