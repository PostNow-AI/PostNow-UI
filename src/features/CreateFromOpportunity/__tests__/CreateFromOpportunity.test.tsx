import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CreateFromOpportunity } from "../index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [
    new URLSearchParams(
      "topic=IA%20substituindo%20empregos&category=polemica&score=95"
    ),
  ],
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ArrowLeft: () => <span data-testid="icon-arrow-left">back</span>,
  ArrowRight: () => <span data-testid="icon-arrow-right">next</span>,
  Check: () => <span data-testid="icon-check">check</span>,
  Sparkles: () => <span data-testid="icon-sparkles">sparkles</span>,
  Loader2: () => <span data-testid="icon-loader">loading</span>,
  CheckCircle2: () => <span data-testid="icon-check-circle">success</span>,
  ExternalLink: () => <span data-testid="icon-external">external</span>,
  Plus: () => <span data-testid="icon-plus">plus</span>,
}));

// Mock the service
vi.mock("../services", () => ({
  createFromOpportunityService: {
    getVisualStyles: vi.fn().mockResolvedValue([
      { id: 1, name: "Minimalista", description: "Design limpo" },
      { id: 2, name: "Bold", description: "Cores fortes" },
    ]),
    generatePost: vi.fn().mockResolvedValue({ message: "Post gerado" }),
  },
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("CreateFromOpportunity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o header com logo", async () => {
      render(<CreateFromOpportunity />, { wrapper: createWrapper() });

      // Deve ter a imagem do logo
      const logos = screen.getAllByAltText("PostNow");
      expect(logos.length).toBeGreaterThan(0);
    });

    it("deve renderizar o step indicator", async () => {
      render(<CreateFromOpportunity />, { wrapper: createWrapper() });

      // Deve mostrar os 3 passos (usando getAllByText pois pode haver múltiplos elementos)
      const stepElements = screen.getAllByText("1");
      expect(stepElements.length).toBeGreaterThan(0);
    });

    it("deve começar no passo 1 (Topic)", async () => {
      render(<CreateFromOpportunity />, { wrapper: createWrapper() });

      // Deve mostrar elementos do StepTopic
      const buttons = screen.getAllByText("Continuar");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("deve mostrar o tópico da URL", async () => {
      render(<CreateFromOpportunity />, { wrapper: createWrapper() });

      const topics = screen.getAllByText("IA substituindo empregos");
      expect(topics.length).toBeGreaterThan(0);
    });

    it("deve mostrar o score da URL", async () => {
      render(<CreateFromOpportunity />, { wrapper: createWrapper() });

      const scores = screen.getAllByText("95/100");
      expect(scores.length).toBeGreaterThan(0);
    });
  });

  describe("Header", () => {
    it("deve mostrar botão Voltar no passo 1", async () => {
      render(<CreateFromOpportunity />, { wrapper: createWrapper() });

      const buttons = screen.getAllByText("Voltar");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter estrutura semântica correta", async () => {
      const { container } = render(<CreateFromOpportunity />, {
        wrapper: createWrapper(),
      });

      // Deve ter header
      expect(container.querySelector("header")).toBeInTheDocument();

      // Deve ter main
      expect(container.querySelector("main")).toBeInTheDocument();
    });
  });
});
