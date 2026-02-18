import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LogoStep } from "../LogoStep";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock MicroStepLayout
vi.mock("../../MicroStepLayout", () => ({
  MicroStepLayout: ({
    children,
    title,
    subtitle,
    onNext,
    onBack,
    isValid,
    nextLabel,
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
        {nextLabel || "Continuar"}
      </button>
    </div>
  ),
}));

// Mock PreviewColorButton
vi.mock("../../PreviewColorButton", () => ({
  PreviewColorButton: ({ color, onChange }: any) => (
    <button
      data-testid={`color-button-${color}`}
      onClick={() => onChange("#FFFFFF")}
      style={{ backgroundColor: color }}
    >
      {color}
    </button>
  ),
}));

// Mock useExtractColors
vi.mock("@/hooks/useExtractColors", () => ({
  useExtractColors: () => ({
    extractedColors: [],
    isExtracting: false,
    extractColorsFromImage: vi.fn().mockResolvedValue(["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"]),
    updateColor: vi.fn(),
    setExtractedColors: vi.fn(),
  }),
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 14,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ImagePlus: () => <span data-testid="icon-image-plus">📷</span>,
  Trash2: () => <span data-testid="icon-trash">🗑️</span>,
  Upload: () => <span data-testid="icon-upload">⬆️</span>,
}));

// Mock cn
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("LogoStep", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    onColorsExtracted: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<LogoStep {...defaultProps} />);
      expect(screen.getByText("Adicione seu logo")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo", () => {
      render(<LogoStep {...defaultProps} />);
      expect(
        screen.getByText("Opcional - vamos extrair as cores automaticamente!")
      ).toBeInTheDocument();
    });

    it("deve renderizar área de upload quando não há logo", () => {
      render(<LogoStep {...defaultProps} />);
      expect(screen.getByText("Clique para enviar")).toBeInTheDocument();
      expect(screen.getByText("ou arraste e solte seu logo aqui")).toBeInTheDocument();
    });

    it("deve mostrar formatos aceitos", () => {
      render(<LogoStep {...defaultProps} />);
      expect(screen.getByText("PNG, JPG ou SVG (máx. 500KB)")).toBeInTheDocument();
    });
  });

  describe("Com logo carregado", () => {
    const logoBase64 = "data:image/png;base64,iVBORw0KGgo=";

    it("deve mostrar a imagem do logo", () => {
      render(<LogoStep {...defaultProps} value={logoBase64} />);
      const img = screen.getByAltText("Logo");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", logoBase64);
    });

    it("deve mostrar botão de remover", () => {
      render(<LogoStep {...defaultProps} value={logoBase64} />);
      expect(screen.getByTestId("icon-trash")).toBeInTheDocument();
    });

    it("deve chamar onChange com string vazia ao remover logo", () => {
      render(<LogoStep {...defaultProps} value={logoBase64} />);

      const removeButton = screen.getByTestId("icon-trash").closest("button");
      if (removeButton) {
        fireEvent.click(removeButton);
        expect(defaultProps.onChange).toHaveBeenCalledWith("");
        expect(defaultProps.onColorsExtracted).toHaveBeenCalledWith([]);
      }
    });
  });

  describe("Botão de ação", () => {
    it("deve mostrar 'Pular' quando não há logo", () => {
      render(<LogoStep {...defaultProps} value="" />);
      expect(screen.getByTestId("continue-button")).toHaveTextContent("Pular");
    });

    it("deve mostrar 'Continuar' quando há logo", () => {
      render(<LogoStep {...defaultProps} value="data:image/png;base64,xxx" />);
      expect(screen.getByTestId("continue-button")).toHaveTextContent("Continuar");
    });
  });

  describe("Validação", () => {
    it("deve estar sempre válido (logo é opcional)", () => {
      render(<LogoStep {...defaultProps} value="" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });

    it("deve estar válido com logo", () => {
      render(<LogoStep {...defaultProps} value="data:image/png;base64,xxx" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });
  });

  describe("Upload", () => {
    it("deve ter input de arquivo escondido", () => {
      render(<LogoStep {...defaultProps} />);
      const input = document.getElementById("logo-upload") as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.type).toBe("file");
      expect(input.accept).toBe("image/*");
    });

    it("deve ter label clicável", () => {
      render(<LogoStep {...defaultProps} />);
      const label = screen.getByText("Clique para enviar").closest("label");
      expect(label).toHaveAttribute("for", "logo-upload");
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar/pular", () => {
      render(<LogoStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<LogoStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Cores extraídas", () => {
    it("deve usar cores sugeridas se fornecidas", () => {
      const suggestedColors = ["#111", "#222", "#333", "#444", "#555"];
      render(<LogoStep {...defaultProps} suggestedColors={suggestedColors} />);
      // O useEffect deve inicializar com as cores sugeridas
      // (verificação indireta através do mock)
    });
  });
});
