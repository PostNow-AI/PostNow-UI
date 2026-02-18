import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NicheStep } from "../NicheStep";

// Mock MicroStepLayout
vi.mock("../../MicroStepLayout", () => ({
  MicroStepLayout: ({
    children,
    title,
    subtitle,
    onNext,
    onBack,
    isValid,
  }: any) => (
    <div data-testid="micro-step-layout">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
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

// Mock SelectableCards
vi.mock("../../SelectableCards", () => ({
  SelectableCards: ({ options, selected, onSelect }: any) => (
    <div data-testid="selectable-cards">
      {options.map((opt: any) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          data-selected={selected === opt.id}
          data-testid={`card-${opt.id}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 14,
  nicheOptions: [
    { id: "beleza", label: "Beleza" },
    { id: "saude", label: "Saúde" },
    { id: "fitness", label: "Fitness" },
    { id: "gastronomia", label: "Gastronomia" },
    { id: "outro", label: "Outro" },
  ],
}));

describe("NicheStep", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<NicheStep {...defaultProps} />);
      expect(screen.getByText("Qual é o seu nicho de atuação?")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo", () => {
      render(<NicheStep {...defaultProps} />);
      expect(
        screen.getByText("Escolha a área que melhor representa seu negócio.")
      ).toBeInTheDocument();
    });

    it("deve renderizar as opções de nicho", () => {
      render(<NicheStep {...defaultProps} />);

      expect(screen.getByText("Beleza")).toBeInTheDocument();
      expect(screen.getByText("Saúde")).toBeInTheDocument();
      expect(screen.getByText("Fitness")).toBeInTheDocument();
      expect(screen.getByText("Gastronomia")).toBeInTheDocument();
      expect(screen.getByText("Outro")).toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("deve estar inválido sem seleção", () => {
      render(<NicheStep {...defaultProps} value="" />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar válido com nicho selecionado", () => {
      render(<NicheStep {...defaultProps} value="beleza" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });

    it("deve estar inválido com 'outro' selecionado mas sem texto", () => {
      render(<NicheStep {...defaultProps} value="outro" />);
      // Quando 'outro' está selecionado, precisa de texto no input
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });
  });

  describe("Seleção", () => {
    it("deve chamar onChange ao selecionar nicho", () => {
      render(<NicheStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("card-beleza"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("beleza");
    });

    it("deve chamar onChange ao selecionar outro nicho", () => {
      render(<NicheStep {...defaultProps} value="beleza" />);

      fireEvent.click(screen.getByTestId("card-saude"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("saude");
    });
  });

  describe("Opção 'Outro'", () => {
    it("deve mostrar input quando 'outro' é selecionado", () => {
      render(<NicheStep {...defaultProps} value="outro" />);

      expect(screen.getByPlaceholderText("Digite seu nicho...")).toBeInTheDocument();
    });

    it("não deve mostrar input quando outro nicho é selecionado", () => {
      render(<NicheStep {...defaultProps} value="beleza" />);

      expect(screen.queryByPlaceholderText("Digite seu nicho...")).not.toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      render(<NicheStep {...defaultProps} value="beleza" />);

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<NicheStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
