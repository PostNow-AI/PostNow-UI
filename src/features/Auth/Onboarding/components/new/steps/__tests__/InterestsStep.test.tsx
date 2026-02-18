import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { InterestsStep } from "../InterestsStep";

// Mock ChipsSelectionStep
vi.mock("../ChipsSelectionStep", () => ({
  ChipsSelectionStep: ({
    value,
    onChange,
    onNext,
    onBack,
    title,
    step,
  }: any) => (
    <div data-testid="chips-selection-step">
      <h1>{title}</h1>
      <span data-testid="step">{step}</span>
      <span data-testid="value">{JSON.stringify(value)}</span>
      <button onClick={() => onChange(["tecnologia"])} data-testid="select-option">
        Selecionar
      </button>
      <button onClick={onBack} data-testid="back-button">Voltar</button>
      <button onClick={onNext} data-testid="continue-button">Continuar</button>
    </div>
  ),
  INTERESTS_STEP_CONFIG: {
    step: 7,
    title: "Quais são os interesses do seu público?",
    subtitle: "Selecione até 8 opções",
    maxSelections: 8,
    allowCustom: true,
    options: ["Tecnologia", "Saúde", "Finanças", "Lifestyle", "Moda", "Viagem"],
  },
}));

describe("InterestsStep", () => {
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
    it("deve renderizar o ChipsSelectionStep", () => {
      render(<InterestsStep {...defaultProps} />);
      expect(screen.getByTestId("chips-selection-step")).toBeInTheDocument();
    });

    it("deve usar a configuração INTERESTS_STEP_CONFIG", () => {
      render(<InterestsStep {...defaultProps} />);
      expect(screen.getByText("Quais são os interesses do seu público?")).toBeInTheDocument();
    });

    it("deve passar value corretamente", () => {
      render(<InterestsStep {...defaultProps} value={["tecnologia", "saude"]} />);
      expect(screen.getByTestId("value")).toHaveTextContent('["tecnologia","saude"]');
    });
  });

  describe("Props passadas", () => {
    it("deve chamar onChange quando ChipsSelectionStep chama", () => {
      render(<InterestsStep {...defaultProps} />);

      screen.getByTestId("select-option").click();
      expect(defaultProps.onChange).toHaveBeenCalledWith(["tecnologia"]);
    });

    it("deve chamar onNext quando ChipsSelectionStep chama", () => {
      render(<InterestsStep {...defaultProps} />);

      screen.getByTestId("continue-button").click();
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack quando ChipsSelectionStep chama", () => {
      render(<InterestsStep {...defaultProps} />);

      screen.getByTestId("back-button").click();
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
