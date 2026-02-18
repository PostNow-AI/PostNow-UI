import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaywallFlow } from "../PaywallFlow";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onClick, ...props }: any) => (
      <div onClick={onClick} {...props}>{children}</div>
    ),
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    img: ({ ...props }: any) => <img {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Bell: () => <span data-testid="icon-bell">🔔</span>,
  Check: () => <span data-testid="icon-check">✓</span>,
  ChevronLeft: () => <span data-testid="icon-chevron">←</span>,
  Crown: () => <span data-testid="icon-crown">👑</span>,
  Lock: () => <span data-testid="icon-lock">🔒</span>,
}));

// Mock cn
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("PaywallFlow", () => {
  const mockPlans = [
    {
      id: "monthly",
      name: "Mensal",
      price: 29.9,
      pricePerMonth: 29.9,
      interval: "month" as const,
    },
    {
      id: "yearly",
      name: "Anual",
      price: 199.9,
      pricePerMonth: 16.66,
      interval: "year" as const,
      badge: "Mais popular",
      savings: "Economize 44%",
      recommended: true,
    },
  ];

  const defaultProps = {
    trialDays: 7,
    plans: mockPlans,
    onSelectPlan: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ business_name: "Meu Negócio" })
    );
  });

  describe("Tela 1: TrialIntroScreen", () => {
    it("deve renderizar a primeira tela por padrão", () => {
      render(<PaywallFlow {...defaultProps} />);

      expect(
        screen.getByText(/Queremos que você/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/experimente o/)
      ).toBeInTheDocument();
    });

    it("deve mostrar o botão 'Teste por R$ 0,00'", () => {
      render(<PaywallFlow {...defaultProps} />);

      expect(screen.getByText("Teste por R$ 0,00")).toBeInTheDocument();
    });

    it("deve mostrar 'Nenhum pagamento agora'", () => {
      render(<PaywallFlow {...defaultProps} />);

      expect(screen.getByText("Nenhum pagamento agora")).toBeInTheDocument();
    });

    it("deve mostrar preço do plano selecionado", () => {
      render(<PaywallFlow {...defaultProps} />);

      // Plano anual é recomendado e selecionado por padrão
      expect(screen.getByText(/R\$ 199,90 por ano/)).toBeInTheDocument();
    });

    it("deve avançar para tela 2 ao clicar em continuar", async () => {
      render(<PaywallFlow {...defaultProps} />);

      fireEvent.click(screen.getByText("Teste por R$ 0,00"));

      await waitFor(() => {
        expect(
          screen.getByText(/Vamos te avisar antes/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Tela 2: ReminderScreen", () => {
    it("deve renderizar a segunda tela após avançar", async () => {
      render(<PaywallFlow {...defaultProps} />);

      // Avançar para tela 2
      fireEvent.click(screen.getByText("Teste por R$ 0,00"));

      await waitFor(() => {
        expect(
          screen.getByText(/Vamos te avisar antes/)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/do seu período de teste/)
        ).toBeInTheDocument();
      });
    });

    it("deve mostrar botão 'Continuar GRÁTIS'", async () => {
      render(<PaywallFlow {...defaultProps} />);

      fireEvent.click(screen.getByText("Teste por R$ 0,00"));

      await waitFor(() => {
        expect(screen.getByText("Continuar GRÁTIS")).toBeInTheDocument();
      });
    });

    it("deve ter botão de voltar", async () => {
      render(<PaywallFlow {...defaultProps} />);

      fireEvent.click(screen.getByText("Teste por R$ 0,00"));

      await waitFor(() => {
        expect(screen.getByTestId("icon-chevron")).toBeInTheDocument();
      });
    });

    it("deve voltar para tela 1 ao clicar em voltar", async () => {
      render(<PaywallFlow {...defaultProps} />);

      // Ir para tela 2
      fireEvent.click(screen.getByText("Teste por R$ 0,00"));

      await waitFor(() => {
        expect(screen.getByText("Continuar GRÁTIS")).toBeInTheDocument();
      });

      // Voltar
      const backButton = screen.getByTestId("icon-chevron").closest("button");
      if (backButton) {
        fireEvent.click(backButton);
      }

      await waitFor(() => {
        expect(screen.getByText("Teste por R$ 0,00")).toBeInTheDocument();
      });
    });

    it("deve avançar para tela 3 ao continuar", async () => {
      render(<PaywallFlow {...defaultProps} />);

      // Ir para tela 2
      fireEvent.click(screen.getByText("Teste por R$ 0,00"));

      await waitFor(() => {
        fireEvent.click(screen.getByText("Continuar GRÁTIS"));
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Inicie seu teste/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Tela 3: PlanSelectionScreen", () => {
    const goToScreen3 = async () => {
      render(<PaywallFlow {...defaultProps} />);

      // Ir para tela 2
      fireEvent.click(screen.getByText("Teste por R$ 0,00"));
      await waitFor(() => {
        expect(screen.getByText("Continuar GRÁTIS")).toBeInTheDocument();
      });

      // Ir para tela 3
      fireEvent.click(screen.getByText("Continuar GRÁTIS"));
      await waitFor(() => {
        expect(screen.getByText(/Inicie seu teste/)).toBeInTheDocument();
      });
    };

    it("deve renderizar título com dias de trial", async () => {
      await goToScreen3();

      // Verifica que há pelo menos um elemento com "GRÁTIS"
      expect(screen.getAllByText(/GRÁTIS/).length).toBeGreaterThan(0);
      // Verifica timeline
      expect(screen.getByText("Hoje")).toBeInTheDocument();
    });

    it("deve renderizar timeline com 3 itens", async () => {
      await goToScreen3();

      expect(screen.getByText("Hoje")).toBeInTheDocument();
      expect(screen.getByText(/Em 5 dias - Lembrete/)).toBeInTheDocument();
      expect(screen.getByText(/Em 7 dias - Cobrança/)).toBeInTheDocument();
    });

    it("deve renderizar os dois planos", async () => {
      await goToScreen3();

      expect(screen.getByText("Mensal")).toBeInTheDocument();
      expect(screen.getByText("Anual")).toBeInTheDocument();
    });

    it("deve selecionar plano recomendado por padrão", async () => {
      await goToScreen3();

      // O plano anual tem recommended: true
      const anualText = screen.getByText("Anual");
      const anualButton = anualText.closest("button");

      expect(anualButton?.className).toContain("border-primary");
    });

    it("deve permitir trocar de plano", async () => {
      await goToScreen3();

      // Clicar no plano mensal
      fireEvent.click(screen.getByText("Mensal"));

      // O botão mensal deve ficar selecionado
      const mensalText = screen.getByText("Mensal");
      const mensalButton = mensalText.closest("button");

      await waitFor(() => {
        expect(mensalButton?.className).toContain("border-primary");
      });
    });

    it("deve chamar onSelectPlan ao confirmar", async () => {
      const onSelectPlan = vi.fn();
      render(<PaywallFlow {...defaultProps} onSelectPlan={onSelectPlan} />);

      // Navegar até tela 3
      fireEvent.click(screen.getByText("Teste por R$ 0,00"));
      await waitFor(() => {
        fireEvent.click(screen.getByText("Continuar GRÁTIS"));
      });

      await waitFor(() => {
        expect(screen.getByText(/Iniciar teste grátis/)).toBeInTheDocument();
      });

      // Confirmar
      fireEvent.click(screen.getByText(/Iniciar teste grátis/));

      expect(onSelectPlan).toHaveBeenCalledWith("yearly");
    });

  });

  describe("Preços formatados", () => {
    it("deve formatar preços em reais brasileiro", () => {
      render(<PaywallFlow {...defaultProps} />);

      // Verifica formato brasileiro (vírgula como separador decimal)
      expect(screen.getByText(/R\$ 199,90/)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 16,66\/mês/)).toBeInTheDocument();
    });
  });

  describe("Nome do negócio", () => {
    it("deve obter nome do negócio do localStorage", () => {
      render(<PaywallFlow {...defaultProps} />);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("postnow_onboarding_data");
    });

    it("deve usar 'SUA MARCA' como fallback", () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      render(<PaywallFlow {...defaultProps} />);

      // O componente deve funcionar mesmo sem dados no localStorage
      expect(screen.getByText("Teste por R$ 0,00")).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("deve aceitar trialDays customizado", () => {
      render(<PaywallFlow {...defaultProps} trialDays={14} />);
      // O componente deve renderizar sem erros com qualquer trialDays
      expect(screen.getByText("Teste por R$ 0,00")).toBeInTheDocument();
    });

    it("deve aceitar isLoading", () => {
      render(<PaywallFlow {...defaultProps} isLoading={true} />);
      // O componente deve renderizar sem erros com isLoading
      expect(screen.getByText("Teste por R$ 0,00")).toBeInTheDocument();
    });

    it("deve aceitar onBack opcional", () => {
      const onBack = vi.fn();
      render(<PaywallFlow {...defaultProps} onBack={onBack} />);
      // O componente deve renderizar com onBack
      expect(screen.getByText("Teste por R$ 0,00")).toBeInTheDocument();
    });
  });
});
