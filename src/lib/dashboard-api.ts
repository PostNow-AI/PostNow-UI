/**
 * Dashboard API Service
 * Service for fetching analytics metrics from the AuditSystem dashboard endpoints
 */

import { api } from "./api";
import type {
  DashboardMetric,
  MetricType,
  PeriodDays,
} from "@/features/AdminDashboard/types";

const BASE_URL = "/auditsystem/dashboard";

export const dashboardApiService = {
  /**
   * Fetch a single metric from the dashboard API
   * @param metric - The metric type to fetch
   * @param days - Number of days for the time period (default: 30)
   * @returns Promise with the metric data
   */
  getMetric: async (
    metric: MetricType,
    days: PeriodDays = 30
  ): Promise<DashboardMetric> => {
    const response = await api.get<DashboardMetric>(`${BASE_URL}/${metric}/`, {
      params: { days },
    });
    return response.data;
  },

  /**
   * Fetch all dashboard metrics in parallel
   * @param days - Number of days for the time period (default: 30)
   * @returns Promise with all metrics data keyed by metric type
   */
  getAllMetrics: async (
    days: PeriodDays = 30
  ): Promise<Record<MetricType, DashboardMetric>> => {
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

    const results = await Promise.all(
      metrics.map((m) => dashboardApiService.getMetric(m, days))
    );

    return metrics.reduce(
      (acc, metric, i) => {
        acc[metric] = results[i];
        return acc;
      },
      {} as Record<MetricType, DashboardMetric>
    );
  },
};
