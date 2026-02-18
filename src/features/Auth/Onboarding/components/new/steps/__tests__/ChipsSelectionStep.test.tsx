// Tests for Onboarding components
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ChipsSelectionStep,
  PERSONALITY_STEP_CONFIG,
  INTERESTS_STEP_CONFIG,
} from "../ChipsSelectionStep";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, onClick, disabled, className, ...props }: any) => (
      <button onClick={onClick} disabled={disabled} className={className} {...props}>
        {children}
      </button>
    ),
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock MicroStepLayout
vi.mock("../../MicroStepLayout", () => ({
  MicroStepLayout: ({
    children,
    title,
    subtitle,
    onNext,
    isValid,
  }: any) => (
    <div data-testid="micro-step-layout">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
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

// Mock SelectableChips
vi.mock("../../SelectableChips", () => ({
  SelectableChips: ({
    options,
    selected,
    onToggle,
    maxSelections,
  }: any) => (
    <div data-testid="selectable-chips">
      <span data-testid="selection-count">{selected.length} de {maxSelections}</span>
      {options.map((option: string) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
          data-selected={selected.includes(option)}
          data-testid={`chip-${option}`}
        >
          {option}
        </button>
      ))}
    </div>
  ),
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 13,
  personalityOptions: ["Criativo", "Profissional", "Autêntico", "Inovador"],
  interestOptions: ["Tecnologia", "Saúde", "Finanças", "Lifestyle"],
}));

describe("ChipsSelectionStep", () => {
  const defaultProps = {
    step: 5,
    title: "Título do step",
    subtitle: "Subtítulo do step",
    options: ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
    value: [],
    onChange: vi.fn(),
    maxSelections: 3,
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar título e subtítulo", () => {
      render(<ChipsSelectionStep {...defaultProps} />);

      expect(screen.getByText("Título do step")).toBeInTheDocument();
      expect(screen.getByText("Subtítulo do step")).toBeInTheDocument();
    });

    it("deve renderizar todas as opções", () => {
      render(<ChipsSelectionStep {...defaultProps} />);

      expect(screen.getByText("Opção 1")).toBeInTheDocument();
      expect(screen.getByText("Opção 2")).toBeInTheDocument();
      expect(screen.getByText("Opção 3")).toBeInTheDocument();
      expect(screen.getByText("Opção 4")).toBeInTheDocument();
    });

    it("deve renderizar botão continuar", () => {
      render(<ChipsSelectionStep {...defaultProps} />);

      expect(screen.getByTestId("continue-button")).toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("deve estar inválido sem seleções (minSelections = 1)", () => {
      render(<ChipsSelectionStep {...defaultProps} value={[]} />);

      const continueButton = screen.getByTestId("continue-button");
      expect(continueButton).toBeDisabled();
    });

    it("deve estar válido com pelo menos 1 seleção", () => {
      render(<ChipsSelectionStep {...defaultProps} value={["Opção 1"]} />);

      const continueButton = screen.getByTestId("continue-button");
      expect(continueButton).not.toBeDisabled();
    });

    it("deve respeitar minSelections customizado", () => {
      render(
        <ChipsSelectionStep
          {...defaultProps}
          value={["Opção 1"]}
          minSelections={2}
        />
      );

      const continueButton = screen.getByTestId("continue-button");
      expect(continueButton).toBeDisabled();
    });

    it("deve estar válido quando minSelections é atingido", () => {
      render(
        <ChipsSelectionStep
          {...defaultProps}
          value={["Opção 1", "Opção 2"]}
          minSelections={2}
        />
      );

      const continueButton = screen.getByTestId("continue-button");
      expect(continueButton).not.toBeDisabled();
    });
  });

  describe("Seleção", () => {
    it("deve chamar onChange ao selecionar opção", () => {
      const onChange = vi.fn();
      render(<ChipsSelectionStep {...defaultProps} onChange={onChange} />);

      fireEvent.click(screen.getByTestId("chip-Opção 1"));

      expect(onChange).toHaveBeenCalledWith(["Opção 1"]);
    });

    it("deve remover opção ao clicar novamente", () => {
      const onChange = vi.fn();
      render(
        <ChipsSelectionStep
          {...defaultProps}
          value={["Opção 1"]}
          onChange={onChange}
        />
      );

      fireEvent.click(screen.getByTestId("chip-Opção 1"));

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it("deve permitir múltiplas seleções até maxSelections", () => {
      const onChange = vi.fn();
      render(
        <ChipsSelectionStep
          {...defaultProps}
          value={["Opção 1", "Opção 2"]}
          onChange={onChange}
          maxSelections={3}
        />
      );

      fireEvent.click(screen.getByTestId("chip-Opção 3"));

      expect(onChange).toHaveBeenCalledWith(["Opção 1", "Opção 2", "Opção 3"]);
    });

    it("não deve adicionar além do maxSelections", () => {
      const onChange = vi.fn();
      render(
        <ChipsSelectionStep
          {...defaultProps}
          value={["Opção 1", "Opção 2", "Opção 3"]}
          onChange={onChange}
          maxSelections={3}
        />
      );

      fireEvent.click(screen.getByTestId("chip-Opção 4"));

      // onChange não deve ser chamado pois já atingiu o limite
      // Na verdade, o mock chama onToggle, mas o handler não adiciona
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      const onNext = vi.fn();
      render(
        <ChipsSelectionStep
          {...defaultProps}
          value={["Opção 1"]}
          onNext={onNext}
        />
      );

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });
});

describe("PERSONALITY_STEP_CONFIG", () => {
  it("deve ter configuração correta", () => {
    expect(PERSONALITY_STEP_CONFIG.step).toBe(5);
    expect(PERSONALITY_STEP_CONFIG.maxSelections).toBe(5);
    expect(PERSONALITY_STEP_CONFIG.allowCustom).toBe(true);
    expect(PERSONALITY_STEP_CONFIG.title).toContain("marca");
  });

  it("deve ter opções definidas", () => {
    expect(PERSONALITY_STEP_CONFIG.options).toBeDefined();
    expect(Array.isArray(PERSONALITY_STEP_CONFIG.options)).toBe(true);
    expect(PERSONALITY_STEP_CONFIG.options.length).toBeGreaterThan(0);
  });
});

describe("INTERESTS_STEP_CONFIG", () => {
  it("deve ter configuração correta", () => {
    expect(INTERESTS_STEP_CONFIG.step).toBe(7);
    expect(INTERESTS_STEP_CONFIG.maxSelections).toBe(8);
    expect(INTERESTS_STEP_CONFIG.allowCustom).toBe(true);
    expect(INTERESTS_STEP_CONFIG.title).toContain("interesses");
  });

  it("deve ter opções definidas", () => {
    expect(INTERESTS_STEP_CONFIG.options).toBeDefined();
    expect(Array.isArray(INTERESTS_STEP_CONFIG.options)).toBe(true);
    expect(INTERESTS_STEP_CONFIG.options.length).toBeGreaterThan(0);
  });
});
