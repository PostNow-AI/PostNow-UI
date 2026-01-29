/**
 * useInstagramMetrics - Hook for fetching and managing Instagram metrics
 */

import { instagramService } from "@/services/instagramService";
import type {
  InstagramInsights,
  InstagramMetrics,
  MetricsChartData,
} from "@/types/instagram";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";

interface UseInstagramMetricsOptions {
  startDate?: string;
  endDate?: string;
  days?: number; // Shorthand: get last N days
  enabled?: boolean;
}

export function useInstagramMetrics(options: UseInstagramMetricsOptions = {}) {
  const { startDate, endDate, days = 30, enabled = true } = options;

  // Calculate date range if using 'days' shorthand
  const finalStartDate =
    startDate || format(subDays(new Date(), days), "yyyy-MM-dd");
  const finalEndDate = endDate || format(new Date(), "yyyy-MM-dd");

  const {
    data: metricsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["instagram", "metrics", finalStartDate, finalEndDate],
    queryFn: () => instagramService.getMetrics(finalStartDate, finalEndDate),
    enabled,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const metrics = metricsResponse?.results || [];

  // Transform metrics for charting
  const chartData: MetricsChartData[] = metrics.map((m: InstagramMetrics) => ({
    date: m.date,
    impressions: m.impressions,
    reach: m.reach,
    profileViews: m.profile_views,
    followers: m.follower_count,
    engagement: m.engagement_rate,
  }));

  // Calculate insights
  const insights: InstagramInsights | null =
    metrics.length > 0
      ? {
          totalFollowers: metrics[metrics.length - 1]?.follower_count || 0,
          followerGrowth: metrics.reduce(
            (sum: number, m: InstagramMetrics) => sum + m.follower_growth,
            0,
          ),
          avgEngagementRate:
            metrics.reduce(
              (sum: number, m: InstagramMetrics) => sum + m.engagement_rate,
              0,
            ) / metrics.length,
          totalImpressions: metrics.reduce(
            (sum: number, m: InstagramMetrics) => sum + m.impressions,
            0,
          ),
          totalReach: metrics.reduce(
            (sum: number, m: InstagramMetrics) => sum + m.reach,
            0,
          ),
          bestPostingTimes: [], // This would require media insights - can be added later
        }
      : null;

  // Latest metrics
  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null;

  // Growth calculations
  const followerGrowthRate =
    metrics.length >= 2
      ? ((metrics[metrics.length - 1].follower_count -
          metrics[0].follower_count) /
          metrics[0].follower_count) *
        100
      : 0;

  return {
    metrics,
    chartData,
    insights,
    latestMetrics,
    followerGrowthRate,
    isLoading,
    error,
    refetch,
    count: metricsResponse?.count || 0,
  };
}
