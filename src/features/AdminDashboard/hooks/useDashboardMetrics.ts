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
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
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
