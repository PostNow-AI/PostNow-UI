import { api } from "@/lib/api";
import type { MetricResponse } from "../types";

export const dashboardService = {
  async getSubscriptionStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/subscriptions/`, {
      params: { days },
    });
    return response.data;
  },

  async getOnboardingStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/onboardings/`, {
      params: { days },
    });
    return response.data;
  },

  async getImageStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/images/`, {
      params: { days },
    });
    return response.data;
  },

  async getEmailSentStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/emails-sent/`, {
      params: { days },
    });
    return response.data;
  },

  async getEmailOpenedStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/emails-opened/`, {
      params: { days },
    });
    return response.data;
  },

  async getPostsTotalStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/posts-total/`, {
      params: { days },
    });
    return response.data;
  },

  async getPostsEmailStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/posts-email/`, {
      params: { days },
    });
    return response.data;
  },

  async getPostsManualStats(days: number): Promise<MetricResponse> {
    const response = await api.get(`/api/v1/audit/dashboard/posts-manual/`, {
      params: { days },
    });
    return response.data;
  },
};
