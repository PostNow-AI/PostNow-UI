import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BusinessNameStep } from "../BusinessNameStep";

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

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 14,
}));

describe("BusinessNameStep", () => {
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
      render(<BusinessNameStep {...defaultProps} />);
      expect(screen.getByText("Qual é o nome do seu negócio?")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo", () => {
      render(<BusinessNameStep {...defaultProps} />);
      expect(
        screen.getByText("Se você é autônomo, pode usar seu nome profissional.")
      ).toBeInTheDocument();
    });

    it("deve renderizar o input com placeholder", () => {
      render(<BusinessNameStep {...defaultProps} />);
      expect(screen.getByPlaceholderText("Ex: Studio Maria Souza")).toBeInTheDocument();
    });

    it("deve renderizar a dica sobre personalização", () => {
      render(<BusinessNameStep {...defaultProps} />);
      expect(
        screen.getByText("Este nome será usado para personalizar suas ideias de posts.")
      ).toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("deve estar inválido com valor vazio", () => {
      render(<BusinessNameStep {...defaultProps} value="" />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar inválido com menos de 2 caracteres", () => {
      render(<BusinessNameStep {...defaultProps} value="A" />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar inválido com apenas espaços", () => {
      render(<BusinessNameStep {...defaultProps} value="   " />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar válido com 2 ou mais caracteres", () => {
      render(<BusinessNameStep {...defaultProps} value="AB" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });

    it("deve estar válido com nome completo", () => {
      render(<BusinessNameStep {...defaultProps} value="Studio Maria Souza" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });
  });

  describe("Interação", () => {
    it("deve chamar onChange ao digitar", () => {
      render(<BusinessNameStep {...defaultProps} />);

      const input = screen.getByPlaceholderText("Ex: Studio Maria Souza");
      fireEvent.change(input, { target: { value: "Meu Negócio" } });

      expect(defaultProps.onChange).toHaveBeenCalledWith("Meu Negócio");
    });

    it("deve mostrar valor inicial no input", () => {
      render(<BusinessNameStep {...defaultProps} value="Nome Existente" />);

      const input = screen.getByPlaceholderText("Ex: Studio Maria Souza") as HTMLInputElement;
      expect(input.value).toBe("Nome Existente");
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      render(<BusinessNameStep {...defaultProps} value="Nome Válido" />);

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<BusinessNameStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it("não deve chamar onNext com valor inválido (botão desabilitado)", () => {
      render(<BusinessNameStep {...defaultProps} value="" />);

      const button = screen.getByTestId("continue-button");
      expect(button).toBeDisabled();
    });
  });
});
