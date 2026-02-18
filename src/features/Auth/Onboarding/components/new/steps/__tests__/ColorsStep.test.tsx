import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ColorsStep } from "../ColorsStep";

// Mock MicroStepLayout
vi.mock("../../MicroStepLayout", () => ({
  MicroStepLayout: ({
    children,
    title,
    onNext,
    onBack,
    isValid,
  }: any) => (
    <div data-testid="micro-step-layout">
      <h1>{title}</h1>
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

// Mock ColorPicker
vi.mock("../../ColorPicker", () => ({
  ColorPicker: ({
    colors,
    onChange,
    palettes,
    logoPalette,
  }: any) => (
    <div data-testid="color-picker">
      <span data-testid="current-colors">{JSON.stringify(colors)}</span>
      <span data-testid="palettes-count">{palettes?.length || 0}</span>
      {logoPalette && <span data-testid="logo-palette">has logo palette</span>}
      <button onClick={() => onChange(["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"])} data-testid="select-palette">
        Selecionar Paleta
      </button>
    </div>
  ),
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 14,
  colorPalettes: [
    ["#FF0000", "#FF5500", "#FFAA00", "#FFFF00", "#AAFF00"],
    ["#0000FF", "#0055FF", "#00AAFF", "#00FFFF", "#00FFAA"],
  ],
}));

describe("ColorsStep", () => {
  const defaultColors = ["#4A90A4", "#6C5B7B", "#C06C84", "#F67280", "#F8B195"];

  const defaultProps = {
    value: defaultColors,
    onChange: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<ColorsStep {...defaultProps} />);
      expect(screen.getByText("Paletas sugeridas")).toBeInTheDocument();
    });

    it("deve renderizar o ColorPicker", () => {
      render(<ColorsStep {...defaultProps} />);
      expect(screen.getByTestId("color-picker")).toBeInTheDocument();
    });

    it("deve passar as cores atuais para o ColorPicker", () => {
      render(<ColorsStep {...defaultProps} />);
      expect(screen.getByTestId("current-colors")).toHaveTextContent(JSON.stringify(defaultColors));
    });

    it("deve passar as paletas para o ColorPicker", () => {
      render(<ColorsStep {...defaultProps} />);
      expect(screen.getByTestId("palettes-count")).toHaveTextContent("2");
    });
  });

  describe("Cores sugeridas do logo", () => {
    it("deve passar logoPalette quando suggestedColors é fornecido", () => {
      const suggestedColors = ["#111111", "#222222", "#333333", "#444444", "#555555"];
      render(<ColorsStep {...defaultProps} suggestedColors={suggestedColors} />);
      expect(screen.getByTestId("logo-palette")).toBeInTheDocument();
    });

    it("não deve passar logoPalette quando suggestedColors não é fornecido", () => {
      render(<ColorsStep {...defaultProps} />);
      expect(screen.queryByTestId("logo-palette")).not.toBeInTheDocument();
    });

    it("deve auto-aplicar cores sugeridas quando tem 5 cores", () => {
      const suggestedColors = ["#111111", "#222222", "#333333", "#444444", "#555555"];
      render(<ColorsStep {...defaultProps} value={[]} suggestedColors={suggestedColors} />);

      // O useEffect deve chamar onChange com as cores sugeridas
      expect(defaultProps.onChange).toHaveBeenCalledWith(suggestedColors);
    });

    it("não deve auto-aplicar se já aplicou antes", () => {
      const suggestedColors = ["#111111", "#222222", "#333333", "#444444", "#555555"];
      const { rerender } = render(<ColorsStep {...defaultProps} value={[]} suggestedColors={suggestedColors} />);

      // Primeira chamada
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);

      // Re-render não deve chamar novamente
      rerender(<ColorsStep {...defaultProps} value={suggestedColors} suggestedColors={suggestedColors} />);
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validação", () => {
    it("deve estar válido com 5 cores", () => {
      render(<ColorsStep {...defaultProps} value={defaultColors} />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });

    it("deve estar inválido com menos de 5 cores", () => {
      render(<ColorsStep {...defaultProps} value={["#FF0000", "#00FF00"]} />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar inválido com mais de 5 cores", () => {
      render(<ColorsStep {...defaultProps} value={[...defaultColors, "#FFFFFF"]} />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar inválido com array vazio", () => {
      render(<ColorsStep {...defaultProps} value={[]} />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });
  });

  describe("Interação", () => {
    it("deve chamar onChange ao selecionar paleta", () => {
      render(<ColorsStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("select-palette"));
      expect(defaultProps.onChange).toHaveBeenCalledWith([
        "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"
      ]);
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      render(<ColorsStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<ColorsStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
