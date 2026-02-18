import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OfferStep } from "../OfferStep";

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

describe("OfferStep", () => {
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
      render(<OfferStep {...defaultProps} />);
      expect(screen.getByText("Qual é a sua oferta?")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo", () => {
      render(<OfferStep {...defaultProps} />);
      expect(
        screen.getByText("Complete a frase para definir claramente o que você oferece")
      ).toBeInTheDocument();
    });

    it("deve renderizar os 3 campos da frase", () => {
      render(<OfferStep {...defaultProps} />);

      expect(screen.getByText("Eu ajudo")).toBeInTheDocument();
      expect(screen.getByText("a")).toBeInTheDocument();
      expect(screen.getByText("através de")).toBeInTheDocument();
    });

    it("deve renderizar os placeholders", () => {
      render(<OfferStep {...defaultProps} />);

      expect(screen.getByPlaceholderText("mulheres que buscam autoestima")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("recuperar a confiança e se sentir bem")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("tratamentos estéticos")).toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("deve estar inválido com campos vazios", () => {
      render(<OfferStep {...defaultProps} value="" />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar inválido com apenas um campo preenchido", () => {
      render(<OfferStep {...defaultProps} value="" />);

      const audienceInput = screen.getByPlaceholderText("mulheres que buscam autoestima");
      fireEvent.change(audienceInput, { target: { value: "mulheres" } });

      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar inválido com campos com menos de 3 caracteres", () => {
      render(<OfferStep {...defaultProps} value="" />);

      const audienceInput = screen.getByPlaceholderText("mulheres que buscam autoestima");
      const transformInput = screen.getByPlaceholderText("recuperar a confiança e se sentir bem");
      const methodInput = screen.getByPlaceholderText("tratamentos estéticos");

      fireEvent.change(audienceInput, { target: { value: "ab" } });
      fireEvent.change(transformInput, { target: { value: "cd" } });
      fireEvent.change(methodInput, { target: { value: "ef" } });

      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar válido com todos os campos preenchidos (3+ caracteres)", () => {
      render(<OfferStep {...defaultProps} value="" />);

      const audienceInput = screen.getByPlaceholderText("mulheres que buscam autoestima");
      const transformInput = screen.getByPlaceholderText("recuperar a confiança e se sentir bem");
      const methodInput = screen.getByPlaceholderText("tratamentos estéticos");

      fireEvent.change(audienceInput, { target: { value: "mulheres" } });
      fireEvent.change(transformInput, { target: { value: "emagrecer" } });
      fireEvent.change(methodInput, { target: { value: "treinos" } });

      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });
  });

  describe("Preview", () => {
    it("deve mostrar preview quando todos os campos estão válidos", () => {
      render(<OfferStep {...defaultProps} value="" />);

      const audienceInput = screen.getByPlaceholderText("mulheres que buscam autoestima");
      const transformInput = screen.getByPlaceholderText("recuperar a confiança e se sentir bem");
      const methodInput = screen.getByPlaceholderText("tratamentos estéticos");

      fireEvent.change(audienceInput, { target: { value: "mulheres" } });
      fireEvent.change(transformInput, { target: { value: "emagrecer" } });
      fireEvent.change(methodInput, { target: { value: "treinos" } });

      expect(screen.getByText("Sua oferta:")).toBeInTheDocument();
    });

    it("não deve mostrar preview quando campos estão incompletos", () => {
      render(<OfferStep {...defaultProps} value="" />);

      expect(screen.queryByText("Sua oferta:")).not.toBeInTheDocument();
    });
  });

  describe("Parsing de valor existente", () => {
    it("deve parsear valor existente corretamente", () => {
      const existingValue = "Eu ajudo empreendedores a aumentar vendas através de marketing digital";
      render(<OfferStep {...defaultProps} value={existingValue} />);

      const audienceInput = screen.getByPlaceholderText("mulheres que buscam autoestima") as HTMLInputElement;
      const transformInput = screen.getByPlaceholderText("recuperar a confiança e se sentir bem") as HTMLInputElement;
      const methodInput = screen.getByPlaceholderText("tratamentos estéticos") as HTMLInputElement;

      expect(audienceInput.value).toBe("empreendedores");
      expect(transformInput.value).toBe("aumentar vendas");
      expect(methodInput.value).toBe("marketing digital");
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      render(<OfferStep {...defaultProps} value="" />);

      const audienceInput = screen.getByPlaceholderText("mulheres que buscam autoestima");
      const transformInput = screen.getByPlaceholderText("recuperar a confiança e se sentir bem");
      const methodInput = screen.getByPlaceholderText("tratamentos estéticos");

      fireEvent.change(audienceInput, { target: { value: "mulheres" } });
      fireEvent.change(transformInput, { target: { value: "emagrecer" } });
      fireEvent.change(methodInput, { target: { value: "treinos" } });

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<OfferStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
