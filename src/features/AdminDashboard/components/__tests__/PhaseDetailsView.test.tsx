/**
 * Tests for PhaseDetailsView component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PhaseDetailsView } from "../PhaseDetailsView";

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
  step_3: 95,
  step_4: 90,
  step_5: 88,
  step_6: 85,
  step_7: 82,
  step_8: 80,
  step_9: 75,
  step_10: 72,
  step_11: 70,
  step_12: 68,
  step_13: 65,
  step_14: 62,
  step_15: 60,
  step_16: 58,
  step_17: 55,
  step_18: 52,
  step_19: 50,
  step_20: 48,
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

describe("PhaseDetailsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (dashboardApiService.getOnboardingFunnel as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockFunnelData
    );
  });

  const defaultProps = {
    phaseId: 1,
    days: 30 as const,
    onBack: vi.fn(),
  };

  it("renders phase name", async () => {
    renderWithClient(<PhaseDetailsView {...defaultProps} />);

    await waitFor(() => {
      // Phase name appears multiple times (header and step name)
      expect(screen.getAllByText(/Boas-vindas/i).length).toBeGreaterThan(0);
    });
  });

  it("renders back button", async () => {
    renderWithClient(<PhaseDetailsView {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
    });
  });

  it("calls onBack when back button is clicked", async () => {
    const onBack = vi.fn();
    renderWithClient(<PhaseDetailsView {...defaultProps} onBack={onBack} />);

    await waitFor(() => {
      const backButton = screen.getAllByRole("button")[0];
      fireEvent.click(backButton);
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  it("shows loading state", () => {
    (dashboardApiService.getOnboardingFunnel as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {})
    );
    renderWithClient(<PhaseDetailsView {...defaultProps} />);

    // Loading spinner should be present
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows error state when phase not found", async () => {
    renderWithClient(<PhaseDetailsView {...defaultProps} phaseId={999} />);

    await waitFor(() => {
      expect(screen.getByText("Fase não encontrada")).toBeInTheDocument();
    });
  });

  it("displays phase statistics", async () => {
    renderWithClient(<PhaseDetailsView {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Entraram")).toBeInTheDocument();
      expect(screen.getByText("Desistiram")).toBeInTheDocument();
      expect(screen.getByText("Retenção")).toBeInTheDocument();
    });
  });

  it("displays step details for the phase", async () => {
    renderWithClient(<PhaseDetailsView {...defaultProps} phaseId={1} />);

    await waitFor(() => {
      // Phase 1 has steps 1, 2, 3 - Boas-vindas appears multiple times
      expect(screen.getAllByText(/Boas-vindas/i).length).toBeGreaterThan(0);
      expect(screen.getByText("Nome do Negócio")).toBeInTheDocument();
      expect(screen.getByText("Contato")).toBeInTheDocument();
    });
  });
});
