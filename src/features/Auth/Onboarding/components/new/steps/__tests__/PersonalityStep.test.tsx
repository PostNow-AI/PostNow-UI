import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PersonalityStep } from "../PersonalityStep";

// Mock PersonalityQuizStep
vi.mock("../PersonalityQuizStep", () => ({
  PersonalityQuizStep: ({
    value,
    onChange,
    onNext,
    onBack,
  }: any) => (
    <div data-testid="personality-quiz-step">
      <span data-testid="value">{JSON.stringify(value)}</span>
      <button onClick={() => onChange(["criativo"])} data-testid="select-option">
        Selecionar
      </button>
      <button onClick={onBack} data-testid="back-button">Voltar</button>
      <button onClick={onNext} data-testid="continue-button">Continuar</button>
    </div>
  ),
}));

describe("PersonalityStep", () => {
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
    it("deve renderizar o PersonalityQuizStep", () => {
      render(<PersonalityStep {...defaultProps} />);
      expect(screen.getByTestId("personality-quiz-step")).toBeInTheDocument();
    });

    it("deve passar value corretamente", () => {
      render(<PersonalityStep {...defaultProps} value={["criativo", "inovador"]} />);
      expect(screen.getByTestId("value")).toHaveTextContent('["criativo","inovador"]');
    });

    it("deve passar value vazio corretamente", () => {
      render(<PersonalityStep {...defaultProps} value={[]} />);
      expect(screen.getByTestId("value")).toHaveTextContent("[]");
    });
  });

  describe("Props passadas", () => {
    it("deve chamar onChange quando PersonalityQuizStep chama", () => {
      render(<PersonalityStep {...defaultProps} />);

      screen.getByTestId("select-option").click();
      expect(defaultProps.onChange).toHaveBeenCalledWith(["criativo"]);
    });

    it("deve chamar onNext quando PersonalityQuizStep chama", () => {
      render(<PersonalityStep {...defaultProps} />);

      screen.getByTestId("continue-button").click();
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack quando PersonalityQuizStep chama", () => {
      render(<PersonalityStep {...defaultProps} />);

      screen.getByTestId("back-button").click();
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
