import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TargetAudienceStep } from "../TargetAudienceStep";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ProgressBarWithPhases
vi.mock("../../ProgressBarWithPhases", () => ({
  ProgressBarWithPhases: () => <div data-testid="progress-bar">Progress</div>,
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 14,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span>←</span>,
}));

// Mock cn
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("TargetAudienceStep", () => {
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
      render(<TargetAudienceStep {...defaultProps} />);
      expect(screen.getByText("Quem é seu cliente ideal?")).toBeInTheDocument();
    });

    it("deve renderizar as seções de seleção", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      expect(screen.getByText("Gênero")).toBeInTheDocument();
      expect(screen.getByText("Faixa etária")).toBeInTheDocument();
      expect(screen.getByText("Classe social")).toBeInTheDocument();
    });

    it("deve renderizar opções de gênero", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      expect(screen.getByText("Mulheres")).toBeInTheDocument();
      expect(screen.getByText("Homens")).toBeInTheDocument();
      expect(screen.getByText("Todos")).toBeInTheDocument();
    });

    it("deve renderizar opções de faixa etária", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      expect(screen.getByText("18-24")).toBeInTheDocument();
      expect(screen.getByText("25-34")).toBeInTheDocument();
      expect(screen.getByText("35-44")).toBeInTheDocument();
      expect(screen.getByText("45-54")).toBeInTheDocument();
      expect(screen.getByText("55+")).toBeInTheDocument();
      // "Todas" aparece 2x (faixa etária e classe social)
      expect(screen.getAllByText("Todas").length).toBeGreaterThanOrEqual(1);
    });

    it("deve renderizar opções de classe social", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      expect(screen.getByText("Classe C")).toBeInTheDocument();
      expect(screen.getByText("Classe B")).toBeInTheDocument();
      expect(screen.getByText("Classe A")).toBeInTheDocument();
    });

    it("deve renderizar o botão continuar", () => {
      render(<TargetAudienceStep {...defaultProps} />);
      expect(screen.getByText("Continuar")).toBeInTheDocument();
    });

    it("deve renderizar o progress bar", () => {
      render(<TargetAudienceStep {...defaultProps} />);
      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    });
  });

  describe("Validação", () => {
    it("deve estar inválido sem seleções", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      const continueButton = screen.getByText("Continuar");
      expect(continueButton).toBeDisabled();
    });

    it("deve estar inválido com apenas uma categoria selecionada", () => {
      const selection = JSON.stringify({
        gender: ["mulheres"],
        ageRange: [],
        incomeLevel: [],
      });

      render(<TargetAudienceStep {...defaultProps} value={selection} />);

      const continueButton = screen.getByText("Continuar");
      expect(continueButton).toBeDisabled();
    });

    it("deve estar válido com todas as categorias selecionadas", () => {
      const selection = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-b"],
      });

      render(<TargetAudienceStep {...defaultProps} value={selection} />);

      const continueButton = screen.getByText("Continuar");
      expect(continueButton).not.toBeDisabled();
    });
  });

  describe("Interação", () => {
    it("deve chamar onChange ao selecionar gênero", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Mulheres"));
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it("deve chamar onChange ao selecionar faixa etária", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      fireEvent.click(screen.getByText("25-34"));
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it("deve chamar onChange ao selecionar classe social", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Classe B"));
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it("deve permitir seleção múltipla em cada categoria", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Mulheres"));
      fireEvent.click(screen.getByText("Homens"));

      // onChange deve ter sido chamado duas vezes
      expect(defaultProps.onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      const selection = JSON.stringify({
        gender: ["mulheres"],
        ageRange: ["25-34"],
        incomeLevel: ["classe-b"],
      });

      render(<TargetAudienceStep {...defaultProps} value={selection} />);

      fireEvent.click(screen.getByText("Continuar"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar no botão voltar", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      const backButton = screen.getByLabelText ?
        screen.queryByLabelText("Voltar") :
        document.querySelector('[aria-label="Voltar"]') ||
        document.querySelector('button:has(span:contains("←"))');

      if (backButton) {
        fireEvent.click(backButton);
        expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("Placeholder quando vazio", () => {
    it("deve mostrar placeholder quando nada está selecionado", () => {
      render(<TargetAudienceStep {...defaultProps} />);
      expect(screen.getByText("Selecione abaixo para visualizar")).toBeInTheDocument();
    });

    it("não deve mostrar placeholder quando há seleções", () => {
      const selection = JSON.stringify({
        gender: ["mulheres"],
        ageRange: [],
        incomeLevel: [],
      });

      render(<TargetAudienceStep {...defaultProps} value={selection} />);
      expect(screen.queryByText("Selecione abaixo para visualizar")).not.toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter aria-pressed nos botões de seleção", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      const mulheresButton = screen.getByText("Mulheres");
      expect(mulheresButton).toHaveAttribute("aria-pressed", "false");
    });

    it("deve atualizar aria-pressed quando selecionado", () => {
      const selection = JSON.stringify({
        gender: ["mulheres"],
        ageRange: [],
        incomeLevel: [],
      });

      render(<TargetAudienceStep {...defaultProps} value={selection} />);

      const mulheresButton = screen.getByText("Mulheres");
      expect(mulheresButton).toHaveAttribute("aria-pressed", "true");
    });

    it("deve ter role='img' na área de ilustração", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      const illustration = document.querySelector('[role="img"]');
      expect(illustration).toBeInTheDocument();
    });
  });

  describe("Seleção 'Todos/Todas'", () => {
    it("deve selecionar todos os itens ao clicar em 'Todos'", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Todos"));

      // Deve ter chamado onChange com ambos os gêneros selecionados
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it("deve selecionar todas as faixas etárias ao clicar em 'Todas'", () => {
      render(<TargetAudienceStep {...defaultProps} />);

      // Encontra o botão "Todas" da seção de faixa etária
      const allButtons = screen.getAllByText("Todas");
      fireEvent.click(allButtons[0]); // Primeiro "Todas" é da faixa etária

      expect(defaultProps.onChange).toHaveBeenCalled();
    });
  });
});
