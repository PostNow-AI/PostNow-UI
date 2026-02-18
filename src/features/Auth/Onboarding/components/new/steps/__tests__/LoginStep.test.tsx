import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginStep } from "../LoginStep";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
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
    login: vi.fn().mockResolvedValue({ user: { id: 1 } }),
  },
  authUtils: {
    loginWithGoogle: vi.fn(),
  },
}));

// Mock subscription API
vi.mock("@/lib/subscription-api", () => ({
  subscriptionApiService: {
    getUserSubscription: vi.fn().mockResolvedValue(null),
  },
}));

// Mock error handling
vi.mock("@/lib/utils/errorHandling", () => ({
  handleApiError: () => ({ description: "Erro no login" }),
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
  ChevronLeft: () => <span>←</span>,
}));

// Mock react-router-dom (parcial)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to render with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("LoginStep", () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onSignupClick: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o logo", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("beta-logo")).toBeInTheDocument();
    });

    it("deve renderizar o título", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Entrar na sua conta")).toBeInTheDocument();
    });

    it("deve renderizar descrição sobre sincronização", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(
        screen.getByText("Seus dados do onboarding serão sincronizados automaticamente")
      ).toBeInTheDocument();
    });

    it("deve renderizar campos do formulário", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    });

    it("deve renderizar botão de entrar", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Entrar")).toBeInTheDocument();
    });

    it("deve renderizar link 'Esqueceu a senha?'", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Esqueceu a senha?")).toBeInTheDocument();
    });

    it("deve renderizar opção de Google", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("google-button")).toBeInTheDocument();
      expect(screen.getByText("Continuar com Google")).toBeInTheDocument();
    });

    it("deve renderizar divider 'Ou continue com'", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Ou continue com")).toBeInTheDocument();
    });

    it("deve renderizar link para criar conta", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByText("Não tem uma conta?")).toBeInTheDocument();
      expect(screen.getByText("Criar conta")).toBeInTheDocument();
    });

    it("deve renderizar botão voltar", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });
      expect(screen.getByLabelText("Voltar")).toBeInTheDocument();
    });
  });

  describe("Campo de senha", () => {
    it("deve toggle visibilidade da senha", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      const senhaToggle = screen.getByLabelText("Mostrar senha");
      fireEvent.click(senhaToggle);
      expect(screen.getByLabelText("Ocultar senha")).toBeInTheDocument();
    });
  });

  describe("Preenchimento do formulário", () => {
    it("deve permitir preencher email", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("seu@email.com");
      fireEvent.change(input, { target: { value: "maria@email.com" } });
      expect(input).toHaveValue("maria@email.com");
    });

    it("deve permitir preencher senha", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      const input = screen.getByPlaceholderText("Sua senha");
      fireEvent.change(input, { target: { value: "minhasenha123" } });
      expect(input).toHaveValue("minhasenha123");
    });
  });

  describe("Navegação", () => {
    it("deve chamar onBack ao clicar em voltar", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByLabelText("Voltar"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onSignupClick ao clicar em 'Criar conta'", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByText("Criar conta"));
      expect(defaultProps.onSignupClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Google login", () => {
    it("deve chamar loginWithGoogle ao clicar no botão Google", async () => {
      const { authUtils } = await import("@/lib/auth");

      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByTestId("google-button"));
      expect(authUtils.loginWithGoogle).toHaveBeenCalled();
    });

    it("deve salvar flag no localStorage antes de chamar Google", async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByTestId("google-button"));

      expect(setItemSpy).toHaveBeenCalledWith("postnow_from_onboarding", "true");
    });
  });

  describe("Link 'Esqueceu a senha?'", () => {
    it("deve ter link correto para recuperação de senha", () => {
      render(<LoginStep {...defaultProps} />, { wrapper: createWrapper() });

      const link = screen.getByText("Esqueceu a senha?");
      expect(link).toHaveAttribute("href", "/forgot-password");
    });
  });
});
