import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceToneStep } from "../VoiceToneStep";

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

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Plus: () => <span data-testid="icon-plus">+</span>,
}));

// Mock cn
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("VoiceToneStep", () => {
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
      render(<VoiceToneStep {...defaultProps} />);
      expect(screen.getByText("Qual o tom de voz da sua marca?")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo", () => {
      render(<VoiceToneStep {...defaultProps} />);
      expect(
        screen.getByText("Como você quer se comunicar com seu público?")
      ).toBeInTheDocument();
    });

    it("deve renderizar as opções de tom de voz", () => {
      render(<VoiceToneStep {...defaultProps} />);

      expect(screen.getByText("Casual e Amigável")).toBeInTheDocument();
      expect(screen.getByText("Inspirador")).toBeInTheDocument();
      expect(screen.getByText("Educativo")).toBeInTheDocument();
      expect(screen.getByText("Profissional")).toBeInTheDocument();
      expect(screen.getByText("Divertido")).toBeInTheDocument();
      expect(screen.getByText("Autoridade")).toBeInTheDocument();
    });

    it("deve renderizar o botão 'Outro'", () => {
      render(<VoiceToneStep {...defaultProps} />);
      expect(screen.getByText("Outro")).toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("deve estar inválido sem seleção", () => {
      render(<VoiceToneStep {...defaultProps} value="" />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar válido com opção selecionada", () => {
      render(<VoiceToneStep {...defaultProps} value="Casual e Amigável" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });

    it("deve estar válido com valor customizado", () => {
      render(<VoiceToneStep {...defaultProps} value="Meu Tom Customizado" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });
  });

  describe("Seleção", () => {
    it("deve chamar onChange ao selecionar opção", () => {
      render(<VoiceToneStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Inspirador"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("Inspirador");
    });

    it("deve desselecionar ao clicar novamente", () => {
      render(<VoiceToneStep {...defaultProps} value="Inspirador" />);

      fireEvent.click(screen.getByText("Inspirador"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("");
    });

    it("deve permitir trocar seleção", () => {
      render(<VoiceToneStep {...defaultProps} value="Inspirador" />);

      fireEvent.click(screen.getByText("Educativo"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("Educativo");
    });
  });

  describe("Descrição da opção", () => {
    it("deve mostrar descrição quando opção predefinida está selecionada", () => {
      render(<VoiceToneStep {...defaultProps} value="Casual e Amigável" />);
      expect(screen.getByText("Tom descontraído e próximo")).toBeInTheDocument();
    });

    it("deve mostrar descrição correta para Inspirador", () => {
      render(<VoiceToneStep {...defaultProps} value="Inspirador" />);
      expect(screen.getByText("Mensagens que motivam")).toBeInTheDocument();
    });

    it("deve mostrar descrição correta para Educativo", () => {
      render(<VoiceToneStep {...defaultProps} value="Educativo" />);
      expect(screen.getByText("Foco em ensinar e informar")).toBeInTheDocument();
    });

    it("não deve mostrar descrição para valor customizado", () => {
      render(<VoiceToneStep {...defaultProps} value="Meu Tom" />);
      expect(screen.queryByText("Tom descontraído e próximo")).not.toBeInTheDocument();
    });
  });

  describe("Opção 'Outro'", () => {
    it("deve mostrar input ao clicar em 'Outro'", () => {
      render(<VoiceToneStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Outro"));
      expect(screen.getByPlaceholderText("Digite o tom de voz...")).toBeInTheDocument();
    });

    it("deve limpar seleção ao abrir input customizado", () => {
      render(<VoiceToneStep {...defaultProps} value="Inspirador" />);

      fireEvent.click(screen.getByText("Outro"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("");
    });

    it("deve esconder botão Outro quando há valor customizado", () => {
      render(<VoiceToneStep {...defaultProps} value="Meu Tom Customizado" />);

      // Mostra o valor customizado como chip
      expect(screen.getByText("Meu Tom Customizado")).toBeInTheDocument();
      // Não mostra botão "Outro"
      expect(screen.queryByText("Outro")).not.toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      render(<VoiceToneStep {...defaultProps} value="Inspirador" />);

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<VoiceToneStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
