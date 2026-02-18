import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PreviewStep } from "../PreviewStep";
import type { OnboardingTempData } from "@/features/Auth/Onboarding/hooks/useOnboardingStorage";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock ProgressBarWithPhases
vi.mock("../../ProgressBarWithPhases", () => ({
  ProgressBarWithPhases: () => <div data-testid="progress-bar">Progress</div>,
}));

// Mock usePreviewIdeas
vi.mock("@/features/Auth/Onboarding/hooks/usePreviewIdeas", () => ({
  usePreviewIdeas: () => [
    { title: "Post sobre novidades", description: "Compartilhe as últimas novidades" },
    { title: "Dica do dia", description: "Uma dica rápida para seus seguidores" },
    { title: "Bastidores", description: "Mostre os bastidores do seu negócio" },
  ],
}));

// Mock constants
vi.mock("@/features/Auth/Onboarding/constants/onboardingNewSchema", () => ({
  TOTAL_STEPS: 14,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ArrowRight: () => <span data-testid="icon-arrow">→</span>,
  Calendar: () => <span data-testid="icon-calendar">📅</span>,
  ChevronLeft: () => <span data-testid="icon-chevron">←</span>,
  Lightbulb: () => <span data-testid="icon-lightbulb">💡</span>,
  Palette: () => <span data-testid="icon-palette">🎨</span>,
  Sparkles: () => <span data-testid="icon-sparkles">✨</span>,
  Target: () => <span data-testid="icon-target">🎯</span>,
  TrendingUp: () => <span data-testid="icon-trending">📈</span>,
}));

describe("PreviewStep", () => {
  const mockData: OnboardingTempData = {
    business_name: "Studio Maria",
    specialization: "Beleza",
    business_description: "Salão de beleza",
    offer: "Eu ajudo mulheres a se sentirem bem através de tratamentos",
    personality_traits: ["Criativo", "Autêntico"],
    target_audience: '{"gender":["mulheres"],"ageRange":["25-34"],"incomeLevel":["classe-b"]}',
    audience_interests: ["Moda", "Beleza"],
    location: "São Paulo, SP",
    voice_tone: "Casual e Amigável",
    visual_style_ids: ["1", "2"],
    logo_url: "",
    colors: ["#4A90A4", "#6C5B7B", "#C06C84", "#F67280", "#F8B195"],
    current_step: 14,
  };

  const defaultProps = {
    data: mockData,
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o título", () => {
      render(<PreviewStep {...defaultProps} />);
      expect(screen.getByText("Veja o que preparamos para você")).toBeInTheDocument();
    });

    it("deve renderizar o nome do negócio", () => {
      render(<PreviewStep {...defaultProps} />);
      expect(screen.getByText(/Studio Maria/)).toBeInTheDocument();
    });

    it("deve renderizar o progress bar", () => {
      render(<PreviewStep {...defaultProps} />);
      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    });

    it("deve renderizar o botão voltar", () => {
      render(<PreviewStep {...defaultProps} />);
      expect(screen.getByLabelText("Voltar")).toBeInTheDocument();
    });

    it("deve renderizar o botão de criar conta", () => {
      render(<PreviewStep {...defaultProps} />);
      expect(screen.getByText("Criar minha conta")).toBeInTheDocument();
    });
  });

  describe("Benefícios", () => {
    it("deve renderizar os 4 benefícios", () => {
      render(<PreviewStep {...defaultProps} />);

      expect(screen.getByText("Ideias diárias")).toBeInTheDocument();
      expect(screen.getByText("Conteúdo estratégico")).toBeInTheDocument();
      expect(screen.getByText("Visual alinhado")).toBeInTheDocument();
      expect(screen.getByText("Tendências")).toBeInTheDocument();
    });

    it("deve renderizar descrições dos benefícios", () => {
      render(<PreviewStep {...defaultProps} />);

      expect(screen.getByText("Posts personalizados baseados no seu perfil")).toBeInTheDocument();
      expect(screen.getByText("Focado no seu público-alvo")).toBeInTheDocument();
      expect(screen.getByText("Usando suas cores e estilo")).toBeInTheDocument();
      expect(screen.getByText("Conteúdo atualizado com o mercado")).toBeInTheDocument();
    });
  });

  describe("Ideias personalizadas", () => {
    it("deve renderizar seção de ideias", () => {
      render(<PreviewStep {...defaultProps} />);
      expect(screen.getByText("Ideias personalizadas para você")).toBeInTheDocument();
    });

    it("deve renderizar as ideias geradas", () => {
      render(<PreviewStep {...defaultProps} />);

      expect(screen.getByText("Post sobre novidades")).toBeInTheDocument();
      expect(screen.getByText("Dica do dia")).toBeInTheDocument();
      expect(screen.getByText("Bastidores")).toBeInTheDocument();
    });

    it("deve renderizar descrições das ideias", () => {
      render(<PreviewStep {...defaultProps} />);

      expect(screen.getByText("Compartilhe as últimas novidades")).toBeInTheDocument();
      expect(screen.getByText("Uma dica rápida para seus seguidores")).toBeInTheDocument();
      expect(screen.getByText("Mostre os bastidores do seu negócio")).toBeInTheDocument();
    });
  });

  describe("Cores da marca", () => {
    it("deve renderizar as cores da marca", () => {
      render(<PreviewStep {...defaultProps} />);

      // Verifica se as 5 cores estão renderizadas
      const stepContent = document.querySelector("main");
      const colorDivs = stepContent?.querySelectorAll("[style*='background-color']");

      expect(colorDivs?.length).toBeGreaterThanOrEqual(5);
    });

    it("deve mostrar texto 'Suas cores'", () => {
      render(<PreviewStep {...defaultProps} />);
      expect(screen.getByText("Suas cores")).toBeInTheDocument();
    });
  });

  describe("Navegação", () => {
    it("deve chamar onNext ao clicar em 'Criar minha conta'", () => {
      render(<PreviewStep {...defaultProps} />);

      fireEvent.click(screen.getByText("Criar minha conta"));
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onBack ao clicar no botão voltar", () => {
      render(<PreviewStep {...defaultProps} />);

      fireEvent.click(screen.getByLabelText("Voltar"));
      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });
});
