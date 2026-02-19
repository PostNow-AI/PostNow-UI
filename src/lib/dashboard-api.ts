/**
 * Dashboard API Service
 * Service for fetching analytics metrics from the AuditSystem dashboard endpoints
 */

import { api } from "./api";
import type {
  DashboardMetric,
  MetricType,
  PeriodDays,
  SubscriptionDetailsResponse,
  LoginDetailsResponse,
  OnboardingFunnelResponse,
  OnboardingStepDetailsResponse,
} from "@/features/AdminDashboard/types";

const BASE_URL = "/api/v1/audit/dashboard";

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

  /**
   * Fetch detailed subscription list for drill-down view
   * @param days - Number of days for the time period (default: 30)
   * @returns Promise with subscription details
   */
  getSubscriptionDetails: async (
    days: PeriodDays = 30
  ): Promise<SubscriptionDetailsResponse> => {
    const response = await api.get<SubscriptionDetailsResponse>(
      `${BASE_URL}/subscriptions/details/`,
      { params: { days } }
    );
    return response.data;
  },

  /**
   * Fetch detailed login list for drill-down view
   * @param days - Number of days for the time period (default: 30)
   * @returns Promise with login details
   */
  getLoginDetails: async (
    days: PeriodDays = 30
  ): Promise<LoginDetailsResponse> => {
    const response = await api.get<LoginDetailsResponse>(
      `${BASE_URL}/logins/details/`,
      { params: { days } }
    );
    return response.data;
  },

  /**
   * Fetch onboarding funnel statistics for drill-down view
   * @param days - Number of days for the time period (default: 30)
   * @returns Promise with funnel step counts and field counts
   */
  getOnboardingFunnel: async (
    days: PeriodDays = 30
  ): Promise<OnboardingFunnelResponse> => {
    const response = await api.get<OnboardingFunnelResponse>(
      `${BASE_URL}/onboarding/funnel/`,
      { params: { days } }
    );
    return response.data;
  },

  /**
   * Fetch detailed information about a specific onboarding step
   * @param stepNumber - The step number (1-20)
   * @param days - Number of days for the time period (default: 30)
   * @returns Promise with step details including session list
   */
  getOnboardingStepDetails: async (
    stepNumber: number,
    days: PeriodDays = 30
  ): Promise<OnboardingStepDetailsResponse> => {
    const response = await api.get<OnboardingStepDetailsResponse>(
      `${BASE_URL}/onboarding/step/${stepNumber}/`,
      { params: { days } }
    );
    return response.data;
  },
};
