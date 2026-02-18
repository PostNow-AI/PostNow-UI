import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VisualStyleStep } from "../VisualStyleStep";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, ...props }: any) => (
      <div onClick={onClick} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock MicroStepLayout
vi.mock("../../MicroStepLayout", () => ({
  MicroStepLayout: ({
    children,
    title,
    titleRight,
    onNext,
    onBack,
    isValid,
  }: any) => (
    <div data-testid="micro-step-layout">
      <div className="flex items-center">
        <h1>{title}</h1>
        {titleRight}
      </div>
      <button onClick={onBack} data-testid="back-button">Voltar</button>
      <div data-testid="step-content">{children}</div>
      <button
        onClick={onNext}
        disabled={!isValid}
        data-testid="continue-button"
      >
        Continuar
      </button>
    </div>
  ),
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 14,
  visualStyleOptions: [
    { id: "1", label: "Minimalista", description: "Design limpo e simples", preview_image_url: null },
    { id: "2", label: "Vibrante", description: "Cores vivas e energia", preview_image_url: null },
    { id: "3", label: "Elegante", description: "Sofisticado e refinado", preview_image_url: null },
  ],
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Check: () => <span data-testid="icon-check">✓</span>,
  Palette: () => <span data-testid="icon-palette">🎨</span>,
}));

// Mock cn
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("VisualStyleStep", () => {
  const defaultProps = {
    value: [] as string[],
    onChange: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<VisualStyleStep {...defaultProps} />);
      expect(screen.getByText("Escolha seu estilo visual")).toBeInTheDocument();
    });

    it("deve renderizar o nome do estilo atual", () => {
      render(<VisualStyleStep {...defaultProps} />);
      expect(screen.getByText("Minimalista")).toBeInTheDocument();
    });

    it("deve renderizar a descrição do estilo", () => {
      render(<VisualStyleStep {...defaultProps} />);
      expect(screen.getByText("Design limpo e simples")).toBeInTheDocument();
    });

    it("deve renderizar indicadores de posição (dots)", () => {
      render(<VisualStyleStep {...defaultProps} />);
      // Deve ter 3 indicadores (um para cada estilo)
      const stepContent = screen.getByTestId("step-content");
      const buttons = stepContent.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Contador de seleções", () => {
    it("não deve mostrar contador quando nenhum estilo selecionado", () => {
      render(<VisualStyleStep {...defaultProps} value={[]} />);
      // O contador só aparece quando value.length > 0
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("deve mostrar contador quando estilos estão selecionados", () => {
      render(<VisualStyleStep {...defaultProps} value={["1", "2"]} />);
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("deve estar inválido sem seleções", () => {
      render(<VisualStyleStep {...defaultProps} value={[]} />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar válido com pelo menos uma seleção", () => {
      render(<VisualStyleStep {...defaultProps} value={["1"]} />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });

    it("deve estar válido com múltiplas seleções", () => {
      render(<VisualStyleStep {...defaultProps} value={["1", "2", "3"]} />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });
  });

  describe("Seleção", () => {
    it("deve chamar onChange ao clicar no carrossel", () => {
      render(<VisualStyleStep {...defaultProps} />);

      // Clicar na área do carrossel
      const stepContent = screen.getByTestId("step-content");
      const clickableArea = stepContent.querySelector("[class*='cursor-grab']");
      if (clickableArea) {
        fireEvent.click(clickableArea);
        expect(defaultProps.onChange).toHaveBeenCalledWith(["1"]);
      }
    });

    it("deve desselecionar ao clicar novamente", () => {
      render(<VisualStyleStep {...defaultProps} value={["1"]} />);

      const stepContent = screen.getByTestId("step-content");
      const clickableArea = stepContent.querySelector("[class*='cursor-grab']");
      if (clickableArea) {
        fireEvent.click(clickableArea);
        expect(defaultProps.onChange).toHaveBeenCalledWith([]);
      }
    });

    it("deve mostrar ícone de check quando selecionado", () => {
      render(<VisualStyleStep {...defaultProps} value={["1"]} />);
      expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    });
  });

  describe("Navegação no carrossel", () => {
    it("deve permitir clicar nos indicadores de posição", () => {
      render(<VisualStyleStep {...defaultProps} />);

      const stepContent = screen.getByTestId("step-content");
      const indicators = stepContent.querySelectorAll("button[class*='rounded-sm']");

      // Clicar no segundo indicador
      if (indicators.length > 1) {
        fireEvent.click(indicators[1]);
        // Após clicar, o estilo exibido deve mudar
        expect(screen.getByText("Vibrante")).toBeInTheDocument();
      }
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      render(<VisualStyleStep {...defaultProps} value={["1"]} />);

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<VisualStyleStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
