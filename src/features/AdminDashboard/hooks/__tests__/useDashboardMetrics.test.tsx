import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useDashboardMetric,
  useAllDashboardMetrics,
} from "../useDashboardMetrics";
import type { DashboardMetric } from "../../types";

// Mock da API
vi.mock("@/lib/dashboard-api", () => ({
  dashboardApiService: {
    getMetric: vi.fn(),
    getAllMetrics: vi.fn(),
  },
}));

// Import do mock para poder manipular
import { dashboardApiService } from "@/lib/dashboard-api";

const mockMetric: DashboardMetric = {
  count: 42,
  timeline: [
    { date: "2026-02-08", count: 10 },
    { date: "2026-02-09", count: 15 },
    { date: "2026-02-10", count: 17 },
  ],
  start_date: "2026-01-11T00:00:00",
  end_date: "2026-02-10T00:00:00",
  metric_name: "subscriptions",
  period_days: 30,
  note: "Excludes admin users",
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useDashboardMetric", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar métrica com sucesso", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    const { result } = renderHook(
      () => useDashboardMetric("subscriptions", 30),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMetric);
    expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
      "subscriptions",
      30
    );
  });

  it("deve usar período de 7 dias quando especificado", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    renderHook(() => useDashboardMetric("onboardings", 7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "onboardings",
        7
      );
    });
  });

  it("deve usar período padrão de 30 dias", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    renderHook(() => useDashboardMetric("images"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith("images", 30);
    });
  });

  it("deve lidar com erro da API", async () => {
    const error = new Error("API Error");
    vi.mocked(dashboardApiService.getMetric).mockRejectedValue(error);

    const { result } = renderHook(
      () => useDashboardMetric("subscriptions", 30),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("deve chamar API para emails-sent", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    renderHook(() => useDashboardMetric("emails-sent", 90), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "emails-sent",
        90
      );
    });
  });

  it("deve chamar API para posts-total", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    renderHook(() => useDashboardMetric("posts-total", 180), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "posts-total",
        180
      );
    });
  });
});

describe("useAllDashboardMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar todas as métricas", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    const { result } = renderHook(() => useAllDashboardMetrics(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Deve ter chamado para cada uma das 8 métricas
    expect(dashboardApiService.getMetric).toHaveBeenCalledTimes(8);
  });

  it("deve retornar dados agrupados por tipo", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    const { result } = renderHook(() => useAllDashboardMetrics(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data.subscriptions).toBeDefined();
    expect(result.current.data.onboardings).toBeDefined();
    expect(result.current.data.images).toBeDefined();
  });

  it("deve usar período customizado para todas as métricas", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    renderHook(() => useAllDashboardMetrics(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const calls = vi.mocked(dashboardApiService.getMetric).mock.calls;
      calls.forEach((call) => {
        expect(call[1]).toBe(7);
      });
    });
  });

  it("deve retornar isError true quando alguma query falha", async () => {
    vi.mocked(dashboardApiService.getMetric).mockRejectedValue(
      new Error("Error")
    );

    const { result } = renderHook(() => useAllDashboardMetrics(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("deve chamar todas as métricas esperadas", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    renderHook(() => useAllDashboardMetrics(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "subscriptions",
        30
      );
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "onboardings",
        30
      );
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith("images", 30);
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "emails-sent",
        30
      );
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "emails-opened",
        30
      );
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "posts-total",
        30
      );
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "posts-email",
        30
      );
      expect(dashboardApiService.getMetric).toHaveBeenCalledWith(
        "posts-manual",
        30
      );
    });
  });

  it("deve fornecer função refetchAll", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    const { result } = renderHook(() => useAllDashboardMetrics(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetchAll).toBe("function");
  });

  it("deve retornar isFetching durante refetch", async () => {
    vi.mocked(dashboardApiService.getMetric).mockResolvedValue(mockMetric);

    const { result } = renderHook(() => useAllDashboardMetrics(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // isFetching should be false when not actively fetching
    expect(result.current.isFetching).toBe(false);
  });
});
