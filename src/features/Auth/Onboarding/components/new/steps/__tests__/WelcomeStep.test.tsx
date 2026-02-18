import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WelcomeStep } from "../WelcomeStep";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock BetaLogo
vi.mock("@/components/ui/beta-logo", () => ({
  BetaLogo: () => <div data-testid="beta-logo">Logo</div>,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="icon-sparkles">✨</span>,
  Target: () => <span data-testid="icon-target">🎯</span>,
  Zap: () => <span data-testid="icon-zap">⚡</span>,
}));

describe("WelcomeStep", () => {
  const defaultProps = {
    onNext: vi.fn(),
    onLogin: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o logo", () => {
      render(<WelcomeStep {...defaultProps} />);
      expect(screen.getByTestId("beta-logo")).toBeInTheDocument();
    });

    it("deve renderizar o título principal", () => {
      render(<WelcomeStep {...defaultProps} />);
      expect(screen.getByText(/Vamos construir seu negócio/)).toBeInTheDocument();
      expect(screen.getByText("juntos!")).toBeInTheDocument();
    });

    it("deve renderizar a descrição", () => {
      render(<WelcomeStep {...defaultProps} />);
      expect(
        screen.getByText(/Em poucos minutos, seu perfil estará pronto/)
      ).toBeInTheDocument();
    });

    it("deve renderizar as 3 features", () => {
      render(<WelcomeStep {...defaultProps} />);

      expect(screen.getByText("Ideias personalizadas")).toBeInTheDocument();
      expect(screen.getByText("Conheça seu público")).toBeInTheDocument();
      expect(screen.getByText("Resultados rápidos")).toBeInTheDocument();
    });

    it("deve renderizar descrições das features", () => {
      render(<WelcomeStep {...defaultProps} />);

      expect(screen.getByText("Posts criados especialmente para seu negócio")).toBeInTheDocument();
      expect(screen.getByText("Entenda melhor quem são seus clientes")).toBeInTheDocument();
      expect(screen.getByText("Comece a postar em minutos")).toBeInTheDocument();
    });

    it("deve renderizar o botão 'Começar agora'", () => {
      render(<WelcomeStep {...defaultProps} />);
      expect(screen.getByText("Começar agora")).toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em 'Começar agora'", () => {
      render(<WelcomeStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Começar agora"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Login link", () => {
    it("deve mostrar link de login quando onLogin é fornecido", () => {
      render(<WelcomeStep {...defaultProps} />);

      expect(screen.getByText("Já tem uma conta?")).toBeInTheDocument();
      expect(screen.getByText("Fazer login")).toBeInTheDocument();
    });

    it("deve chamar onLogin ao clicar no link de login", () => {
      render(<WelcomeStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Fazer login"));
      expect(defaultProps.onLogin).toHaveBeenCalledTimes(1);
    });

    it("não deve mostrar link de login quando onLogin não é fornecido", () => {
      render(<WelcomeStep onNext={defaultProps.onNext} />);

      expect(screen.queryByText("Já tem uma conta?")).not.toBeInTheDocument();
      expect(screen.queryByText("Fazer login")).not.toBeInTheDocument();
    });
  });
});
