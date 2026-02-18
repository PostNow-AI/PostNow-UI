import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignupStep } from "../SignupStep";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, onSubmit, ...props }: any) => (
      <form onSubmit={onSubmit} {...props}>{children}</form>
    ),
  },
}));

// Mock BetaLogo
vi.mock("@/components/ui/beta-logo", () => ({
  BetaLogo: () => <div data-testid="beta-logo">Logo</div>,
}));

// Mock Loader
vi.mock("@/components/ui/loader", () => ({
  Loader: () => <span data-testid="loader">Loading...</span>,
}));

// Mock GoogleOAuthButton
vi.mock("@/features/Auth/Login/components/GoogleOAuthButton", () => ({
  GoogleOAuthButton: ({ children, onClick }: any) => (
    <button onClick={onClick} data-testid="google-button">
      {children}
    </button>
  ),
}));

// Mock auth
vi.mock("@/lib/auth", () => ({
  authApi: {
    register: vi.fn().mockResolvedValue({ user: { id: 1 } }),
    checkEmailAvailability: vi.fn().mockResolvedValue({ available: true, message: "Email disponível" }),
  },
  authUtils: {
    loginWithGoogle: vi.fn(),
  },
}));

// Mock error handling
vi.mock("@/lib/utils/errorHandling", () => ({
  handleApiError: () => ({ description: "Erro no cadastro" }),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Eye: () => <span>👁️</span>,
  EyeClosed: () => <span>👁️‍🗨️</span>,
  Check: () => <span data-testid="icon-check">✓</span>,
  X: () => <span data-testid="icon-x">✗</span>,
  Loader2: () => <span data-testid="icon-loader">⏳</span>,
  ChevronLeft: () => <span>←</span>,
}));

// Mock cn
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Helper to render with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("SignupStep", () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o logo", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("beta-logo")).toBeInTheDocument();
    });

    it("deve renderizar o título", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Crie sua conta")).toBeInTheDocument();
    });

    it("deve renderizar campos do formulário", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByLabelText("Nome")).toBeInTheDocument();
      expect(screen.getByLabelText("Sobrenome")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Senha")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
    });

    it("deve renderizar botão de criar conta", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Criar conta")).toBeInTheDocument();
    });

    it("deve renderizar opção de Google", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("google-button")).toBeInTheDocument();
      expect(screen.getByText("Continuar com Google")).toBeInTheDocument();
    });

    it("deve renderizar divider 'Ou continue com'", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Ou continue com")).toBeInTheDocument();
    });

    it("deve renderizar botão voltar", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByLabelText("Voltar")).toBeInTheDocument();
    });
  });

  describe("Campos de senha", () => {
    it("deve toggle visibilidade da senha", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      const senhaToggle = screen.getByLabelText("Mostrar senha");
      fireEvent.click(senhaToggle);
      expect(screen.getByLabelText("Ocultar senha")).toBeInTheDocument();
    });

    it("deve toggle visibilidade da confirmação de senha", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      const confirmToggle = screen.getByLabelText("Mostrar confirmação de senha");
      fireEvent.click(confirmToggle);
      expect(screen.getByLabelText("Ocultar confirmação de senha")).toBeInTheDocument();
    });
  });

  describe("Preenchimento do formulário", () => {
    it("deve permitir preencher nome", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Seu nome");
      fireEvent.change(input, { target: { value: "Maria" } });
      expect(input).toHaveValue("Maria");
    });

    it("deve permitir preencher sobrenome", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Seu sobrenome");
      fireEvent.change(input, { target: { value: "Silva" } });
      expect(input).toHaveValue("Silva");
    });

    it("deve permitir preencher email", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("seu@email.com");
      fireEvent.change(input, { target: { value: "maria@email.com" } });
      expect(input).toHaveValue("maria@email.com");
    });

    it("deve permitir preencher senha", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Crie uma senha");
      fireEvent.change(input, { target: { value: "minhasenha123" } });
      expect(input).toHaveValue("minhasenha123");
    });

    it("deve permitir preencher confirmação de senha", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Confirme sua senha");
      fireEvent.change(input, { target: { value: "minhasenha123" } });
      expect(input).toHaveValue("minhasenha123");
    });
  });

  describe("Navegação", () => {
    it("deve chamar onBack ao clicar em voltar", () => {
      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByLabelText("Voltar"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Google signup", () => {
    it("deve chamar loginWithGoogle ao clicar no botão Google", async () => {
      const { authUtils } = await import("@/lib/auth");

      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByTestId("google-button"));
      expect(authUtils.loginWithGoogle).toHaveBeenCalled();
    });

    it("deve salvar flag no localStorage antes de chamar Google", async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      render(<SignupStep {...defaultProps} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByTestId("google-button"));

      expect(setItemSpy).toHaveBeenCalledWith("postnow_from_onboarding", "true");
    });
  });
});
