/**
 * Tests for FunnelSection component
 * Updated for the new onboarding funnel implementation
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FunnelSection } from "../FunnelSection";

// Mock the dashboard API service
vi.mock("@/lib/dashboard-api", () => ({
  dashboardApiService: {
    getOnboardingFunnel: vi.fn(),
  },
}));

import { dashboardApiService } from "@/lib/dashboard-api";

const mockFunnelData = {
  started: 100,
  step_1: 100,
  step_2: 98,
  step_3: 92,
  step_4: 88,
  step_5: 83,
  step_6: 79,
  step_7: 72,
  step_8: 66,
  step_9: 57,
  step_10: 48,
  step_11: 48,
  step_12: 40,
  step_13: 34,
  step_14: 32,
  step_15: 29,
  step_16: 25,
  step_17: 23,
  step_18: 22,
  step_19: 19,
  step_20: 12,
  start_date: "2026-01-11",
  end_date: "2026-02-10",
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("FunnelSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (dashboardApiService.getOnboardingFunnel as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockFunnelData
    );
  });

  it("deve renderizar título do card quando não fullscreen", async () => {
    renderWithClient(<FunnelSection days={30} fullscreen={false} />);

    await waitFor(() => {
      expect(screen.getByText("Funil do Onboarding")).toBeInTheDocument();
    });
  });

  it("deve exibir o número de sessões", async () => {
    renderWithClient(<FunnelSection days={30} />);

    await waitFor(() => {
      expect(screen.getByText("100 sessões")).toBeInTheDocument();
    });
  });

  it("deve exibir as 5 fases do funil", async () => {
    renderWithClient(<FunnelSection days={30} />);

    await waitFor(() => {
      // Phase names appear in uppercase in headers
      expect(screen.getAllByText(/Boas-vindas/i).length).toBeGreaterThan(0);
      expect(screen.getByText("Seu Negócio")).toBeInTheDocument();
      expect(screen.getByText("Seu Público")).toBeInTheDocument();
      expect(screen.getByText("Identidade Visual")).toBeInTheDocument();
      expect(screen.getByText("Autenticação")).toBeInTheDocument();
    });
  });

  it("deve exibir os nomes das etapas", async () => {
    renderWithClient(<FunnelSection days={30} />);

    await waitFor(() => {
      expect(screen.getByText("Nome do Negócio")).toBeInTheDocument();
      expect(screen.getByText("Contato")).toBeInTheDocument();
      expect(screen.getByText("Nicho")).toBeInTheDocument();
    });
  });

  it("deve exibir contagens das etapas", async () => {
    renderWithClient(<FunnelSection days={30} />);

    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("98")).toBeInTheDocument();
      expect(screen.getByText("92")).toBeInTheDocument();
    });
  });

  it("deve exibir a taxa de conversão total", async () => {
    renderWithClient(<FunnelSection days={30} />);

    await waitFor(() => {
      // Total: 12/100 = 12%
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });
  });

  it("deve mostrar loading enquanto carrega", () => {
    (dashboardApiService.getOnboardingFunnel as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {})
    );
    renderWithClient(<FunnelSection days={30} />);

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve mostrar erro quando falha", async () => {
    (dashboardApiService.getOnboardingFunnel as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("API Error")
    );
    renderWithClient(<FunnelSection days={30} />);

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar dados do funil")).toBeInTheDocument();
    });
  });

  it("deve navegar para detalhes da fase ao clicar", async () => {
    renderWithClient(<FunnelSection days={30} fullscreen={true} />);

    await waitFor(() => {
      expect(screen.getAllByText(/Boas-vindas/i).length).toBeGreaterThan(0);
    });

    // Click on a phase header
    const phaseHeader = screen.getAllByRole("button")[0];
    fireEvent.click(phaseHeader);

    // Should show phase details view
    await waitFor(() => {
      expect(screen.getByText("Entraram")).toBeInTheDocument();
    });
  });
});
