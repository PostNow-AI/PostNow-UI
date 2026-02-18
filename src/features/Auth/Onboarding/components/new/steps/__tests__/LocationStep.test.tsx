import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocationStep } from "../LocationStep";

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
  MapPin: () => <span data-testid="icon-map">📍</span>,
  Loader2: () => <span data-testid="icon-loader">⏳</span>,
}));

// Mock cn
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock fetch for location detection
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("LocationStep", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock response for IP geolocation
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        city: "São Paulo",
        region: "São Paulo",
        region_code: "SP",
      }),
    });
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<LocationStep {...defaultProps} />);
      expect(screen.getByText("Onde seu público está?")).toBeInTheDocument();
    });

    it("deve renderizar o subtítulo", () => {
      render(<LocationStep {...defaultProps} />);
      expect(
        screen.getByText("Selecione uma opção ou digite sua localização.")
      ).toBeInTheDocument();
    });

    it("deve renderizar o input de localização", () => {
      render(<LocationStep {...defaultProps} />);
      expect(screen.getByPlaceholderText("Ou digite sua localização")).toBeInTheDocument();
    });

    it("deve renderizar a dica de exemplo", () => {
      render(<LocationStep {...defaultProps} />);
      expect(screen.getByText(/Ex: Zona Sul de São Paulo/)).toBeInTheDocument();
    });
  });

  describe("Detecção de localização", () => {
    it("deve mostrar loading enquanto detecta", () => {
      // Fazer o fetch não resolver imediatamente
      mockFetch.mockImplementation(() => new Promise(() => {}));

      render(<LocationStep {...defaultProps} />);
      expect(screen.getByText("Detectando localização...")).toBeInTheDocument();
    });

    it("deve mostrar opções após detectar localização", async () => {
      render(<LocationStep {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();
      });
    });

    it("deve mostrar opções padrão quando detecção falha", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      render(<LocationStep {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Online")).toBeInTheDocument();
        expect(screen.getByText("Todo Brasil")).toBeInTheDocument();
      });
    });
  });

  describe("Opções rápidas", () => {
    it("deve mostrar opções Online e Todo Brasil", async () => {
      render(<LocationStep {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Online")).toBeInTheDocument();
        expect(screen.getByText("Todo Brasil")).toBeInTheDocument();
      });
    });

    it("deve chamar onChange ao clicar em opção rápida", async () => {
      render(<LocationStep {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Online")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Online"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("Online");
    });

    it("deve desselecionar ao clicar novamente", async () => {
      render(<LocationStep {...defaultProps} value="Online" />);

      await waitFor(() => {
        expect(screen.getByText("Online")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Online"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("");
    });
  });

  describe("Validação", () => {
    it("deve estar inválido com valor vazio", () => {
      render(<LocationStep {...defaultProps} value="" />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar inválido com menos de 2 caracteres", () => {
      render(<LocationStep {...defaultProps} value="A" />);
      expect(screen.getByTestId("continue-button")).toBeDisabled();
    });

    it("deve estar válido com 2 ou mais caracteres", () => {
      render(<LocationStep {...defaultProps} value="SP" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });

    it("deve estar válido com opção selecionada", () => {
      render(<LocationStep {...defaultProps} value="Online" />);
      expect(screen.getByTestId("continue-button")).not.toBeDisabled();
    });
  });

  describe("Input customizado", () => {
    it("deve chamar onChange ao digitar", () => {
      render(<LocationStep {...defaultProps} />);

      const input = screen.getByPlaceholderText("Ou digite sua localização");
      fireEvent.change(input, { target: { value: "Zona Sul" } });

      expect(defaultProps.onChange).toHaveBeenCalledWith("Zona Sul");
    });

    it("deve mostrar valor no input", () => {
      render(<LocationStep {...defaultProps} value="Zona Norte" />);

      const input = screen.getByPlaceholderText("Ou digite sua localização") as HTMLInputElement;
      expect(input.value).toBe("Zona Norte");
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em continuar", () => {
      render(<LocationStep {...defaultProps} value="São Paulo" />);

      fireEvent.click(screen.getByTestId("continue-button"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar em voltar", () => {
      render(<LocationStep {...defaultProps} />);

      fireEvent.click(screen.getByTestId("back-button"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
