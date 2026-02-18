import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MicroStepLayout } from "../MicroStepLayout";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock the ProgressBarWithPhases component
vi.mock("../ProgressBarWithPhases", () => ({
  ProgressBarWithPhases: ({ currentStep, totalSteps }: any) => (
    <div data-testid="progress-bar">
      Step {currentStep} of {totalSteps}
    </div>
  ),
}));

// Mock the accessibility hook
vi.mock("../../../hooks/useOnboardingA11y", () => ({
  useOnboardingA11y: () => ({
    announce: vi.fn(),
    getProgressBarProps: () => ({}),
  }),
}));

describe("MicroStepLayout", () => {
  const defaultProps = {
    step: 1,
    totalSteps: 10,
    title: "Test Step",
    onNext: vi.fn(),
    isValid: true,
    children: <div>Step Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render title", () => {
      render(<MicroStepLayout {...defaultProps} />);
      expect(screen.getByRole("heading", { name: "Test Step" })).toBeInTheDocument();
    });

    it("should render subtitle when provided", () => {
      render(<MicroStepLayout {...defaultProps} subtitle="Test subtitle" />);
      expect(screen.getByText("Test subtitle")).toBeInTheDocument();
    });

    it("should render children content", () => {
      render(<MicroStepLayout {...defaultProps} />);
      expect(screen.getByText("Step Content")).toBeInTheDocument();
    });

    it("should render custom nextLabel", () => {
      render(<MicroStepLayout {...defaultProps} nextLabel="Próximo" />);
      expect(screen.getByRole("button", { name: /Próximo/ })).toBeInTheDocument();
    });

    it("should render default nextLabel when not provided", () => {
      render(<MicroStepLayout {...defaultProps} />);
      expect(screen.getByRole("button", { name: /Continuar/ })).toBeInTheDocument();
    });

    it("should render titleRight when provided", () => {
      render(
        <MicroStepLayout
          {...defaultProps}
          titleRight={<span data-testid="title-right">Extra</span>}
        />
      );
      expect(screen.getByTestId("title-right")).toBeInTheDocument();
    });

    it("should render preview when provided", () => {
      render(
        <MicroStepLayout
          {...defaultProps}
          preview={<div data-testid="preview">Preview Content</div>}
        />
      );
      expect(screen.getByTestId("preview")).toBeInTheDocument();
    });
  });

  describe("Back Button", () => {
    it("should show back button when step > 1 and onBack provided", () => {
      render(
        <MicroStepLayout
          {...defaultProps}
          step={2}
          onBack={vi.fn()}
        />
      );
      expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
    });

    it("should hide back button when step is 1", () => {
      render(
        <MicroStepLayout
          {...defaultProps}
          step={1}
          onBack={vi.fn()}
        />
      );
      expect(screen.queryByRole("button", { name: "Voltar" })).not.toBeInTheDocument();
    });

    it("should hide back button when showBack is false", () => {
      render(
        <MicroStepLayout
          {...defaultProps}
          step={2}
          onBack={vi.fn()}
          showBack={false}
        />
      );
      expect(screen.queryByRole("button", { name: "Voltar" })).not.toBeInTheDocument();
    });

    it("should call onBack when back button clicked", () => {
      const onBack = vi.fn();
      render(
        <MicroStepLayout
          {...defaultProps}
          step={2}
          onBack={onBack}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Next Button", () => {
    it("should enable next button when isValid is true", () => {
      render(<MicroStepLayout {...defaultProps} isValid={true} />);
      const button = screen.getByRole("button", { name: /Continuar/ });
      expect(button).not.toBeDisabled();
    });

    it("should disable next button when isValid is false", () => {
      render(<MicroStepLayout {...defaultProps} isValid={false} />);
      const button = screen.getByRole("button", { name: /Continuar/ });
      expect(button).toBeDisabled();
    });

    it("should disable next button when isLoading is true", () => {
      render(<MicroStepLayout {...defaultProps} isLoading={true} />);
      // Button keeps aria-label with nextLabel but shows loading text
      const button = screen.getByRole("button", { name: /Continuar/ });
      expect(button).toBeDisabled();
    });

    it("should show loading state", () => {
      render(<MicroStepLayout {...defaultProps} isLoading={true} />);
      expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("should call onNext when button clicked", () => {
      const onNext = vi.fn();
      render(<MicroStepLayout {...defaultProps} onNext={onNext} />);

      fireEvent.click(screen.getByRole("button", { name: /Continuar/ }));
      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("should call onNext on Ctrl+Enter when valid", () => {
      const onNext = vi.fn();
      render(<MicroStepLayout {...defaultProps} onNext={onNext} />);

      const region = screen.getByRole("region");
      fireEvent.keyDown(region, { key: "Enter", ctrlKey: true });

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("should call onNext on Cmd+Enter when valid", () => {
      const onNext = vi.fn();
      render(<MicroStepLayout {...defaultProps} onNext={onNext} />);

      const region = screen.getByRole("region");
      fireEvent.keyDown(region, { key: "Enter", metaKey: true });

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("should not call onNext on Ctrl+Enter when invalid", () => {
      const onNext = vi.fn();
      render(<MicroStepLayout {...defaultProps} onNext={onNext} isValid={false} />);

      const region = screen.getByRole("region");
      fireEvent.keyDown(region, { key: "Enter", ctrlKey: true });

      expect(onNext).not.toHaveBeenCalled();
    });

    it("should not call onNext on Ctrl+Enter when loading", () => {
      const onNext = vi.fn();
      render(<MicroStepLayout {...defaultProps} onNext={onNext} isLoading={true} />);

      const region = screen.getByRole("region");
      fireEvent.keyDown(region, { key: "Enter", ctrlKey: true });

      expect(onNext).not.toHaveBeenCalled();
    });

    it("should call onBack on Escape when step > 1", () => {
      const onBack = vi.fn();
      render(
        <MicroStepLayout
          {...defaultProps}
          step={2}
          onBack={onBack}
        />
      );

      const region = screen.getByRole("region");
      fireEvent.keyDown(region, { key: "Escape" });

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("should not call onBack on Escape when step is 1", () => {
      const onBack = vi.fn();
      render(
        <MicroStepLayout
          {...defaultProps}
          step={1}
          onBack={onBack}
        />
      );

      const region = screen.getByRole("region");
      fireEvent.keyDown(region, { key: "Escape" });

      expect(onBack).not.toHaveBeenCalled();
    });
  });

  describe("Progress Bar", () => {
    it("should render ProgressBarWithPhases when showPhases is true", () => {
      render(<MicroStepLayout {...defaultProps} showPhases={true} />);
      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    });

    it("should show correct step in progress bar", () => {
      render(<MicroStepLayout {...defaultProps} step={5} totalSteps={10} />);
      expect(screen.getByText("Step 5 of 10")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct region aria-label", () => {
      render(<MicroStepLayout {...defaultProps} step={3} totalSteps={10} />);
      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("aria-label", "Etapa 3 de 10: Test Step");
    });

    it("should have aria-live on main content", () => {
      render(<MicroStepLayout {...defaultProps} />);
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("aria-live", "polite");
    });

    it("should have descriptive aria-label on next button when valid", () => {
      render(<MicroStepLayout {...defaultProps} step={3} />);
      const button = screen.getByRole("button", { name: /Continuar/ });
      expect(button).toHaveAttribute("aria-label", "Continuar - Ir para etapa 4");
    });

    it("should have descriptive aria-label on next button when invalid", () => {
      render(<MicroStepLayout {...defaultProps} isValid={false} />);
      const button = screen.getByRole("button", { name: /Continuar/ });
      expect(button).toHaveAttribute(
        "aria-label",
        "Continuar - Preencha os campos obrigatórios"
      );
    });
  });
});
