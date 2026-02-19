import { useQueries } from "@tanstack/react-query";
import { dashboardService } from "../services";
import type { DashboardMetrics } from "../types";

/**
 * Hook para buscar todas as métricas do dashboard em paralelo
 * @param days - Número de dias para o período de análise (1, 7, 30, 90, 180)
 * @returns Objeto com todas as métricas e seus estados de carregamento/erro
 */
export const useDashboardMetrics = (days: number): DashboardMetrics => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "subscriptions", days],
        queryFn: () => dashboardService.getSubscriptionStats(days),
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
      {
        queryKey: ["dashboard", "onboardings", days],
        queryFn: () => dashboardService.getOnboardingStats(days),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "images", days],
        queryFn: () => dashboardService.getImageStats(days),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "emailsSent", days],
        queryFn: () => dashboardService.getEmailSentStats(days),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "emailsOpened", days],
        queryFn: () => dashboardService.getEmailOpenedStats(days),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "postsTotal", days],
        queryFn: () => dashboardService.getPostsTotalStats(days),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "postsEmail", days],
        queryFn: () => dashboardService.getPostsEmailStats(days),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["dashboard", "postsManual", days],
        queryFn: () => dashboardService.getPostsManualStats(days),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  return {
    subscriptions: {
      data: results[0].data,
      isLoading: results[0].isLoading,
      error: results[0].error,
    },
    onboardings: {
      data: results[1].data,
      isLoading: results[1].isLoading,
      error: results[1].error,
    },
    images: {
      data: results[2].data,
      isLoading: results[2].isLoading,
      error: results[2].error,
    },
    emailsSent: {
      data: results[3].data,
      isLoading: results[3].isLoading,
      error: results[3].error,
    },
    emailsOpened: {
      data: results[4].data,
      isLoading: results[4].isLoading,
      error: results[4].error,
    },
    postsTotal: {
      data: results[5].data,
      isLoading: results[5].isLoading,
      error: results[5].error,
    },
    postsEmail: {
      data: results[6].data,
      isLoading: results[6].isLoading,
      error: results[6].error,
    },
    postsManual: {
      data: results[7].data,
      isLoading: results[7].isLoading,
      error: results[7].error,
    },
  };
};
