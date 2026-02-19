/**
 * Dashboard Metrics Hooks
 * React Query hooks for fetching dashboard analytics data
 */

import { useQuery, useQueries } from "@tanstack/react-query";
import { dashboardApiService } from "@/lib/dashboard-api";
import type {
  MetricType,
  PeriodDays,
  DashboardMetric,
  AllMetricsData,
} from "../types";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for fetching a single dashboard metric
 * @param metric - The metric type to fetch
 * @param days - Number of days for the time period (default: 30)
 */
export const useDashboardMetric = (
  metric: MetricType,
  days: PeriodDays = 30
) => {
  return useQuery({
    queryKey: ["dashboard", metric, days],
    queryFn: () => dashboardApiService.getMetric(metric, days),
    staleTime: STALE_TIME,
  });
};

/**
 * Hook for fetching all dashboard metrics in parallel
 * Uses useQueries for optimal parallel fetching with React Query
 * @param days - Number of days for the time period (default: 30)
 */
export const useAllDashboardMetrics = (days: PeriodDays = 30) => {
  const metrics: MetricType[] = [
    "subscriptions",
    "onboardings",
    "logins",
    "images",
    "emails-sent",
    "emails-opened",
    "posts-total",
    "posts-email",
    "posts-manual",
  ];

  const queries = useQueries({
    queries: metrics.map((metric) => ({
      queryKey: ["dashboard", metric, days],
      queryFn: () => dashboardApiService.getMetric(metric, days),
      staleTime: STALE_TIME,
      // Don't fail the whole dashboard if one metric is missing
      retry: (failureCount: number, error: unknown) => {
        // Don't retry 404 errors (endpoint doesn't exist)
        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as { response?: { status?: number } }).response;
          if (response?.status === 404) return false;
        }
        return failureCount < 2;
      },
    })),
  });

  // Only show loading if ALL queries are loading (first load)
  const isLoading = queries.every((q) => q.isLoading);
  // Only show error if a critical metric fails (not logins which may not exist)
  const criticalMetrics = ["subscriptions", "onboardings", "images"];
  const isError = queries.some((q, i) => q.isError && criticalMetrics.includes(metrics[i]));
  const isFetching = queries.some((q) => q.isFetching);

  const data = metrics.reduce((acc, metric, i) => {
    if (queries[i].data) {
      acc[metric] = queries[i].data as DashboardMetric;
    }
    return acc;
  }, {} as AllMetricsData);

  const refetchAll = () => {
    queries.forEach((query) => query.refetch());
  };

  return { data, isLoading, isError, isFetching, refetchAll };
};
