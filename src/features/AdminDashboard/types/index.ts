/**
 * Dashboard Analytics Types
 * Types for the admin dashboard metrics visualization
 */

/** Single data point in a metric timeline */
export interface TimelinePoint {
  date: string; // Format: "YYYY-MM-DD"
  count: number;
}

/** Response structure from dashboard API endpoints */
export interface DashboardMetric {
  count: number;
  timeline: TimelinePoint[];
  start_date: string;
  end_date: string;
  metric_name: string;
  period_days: number;
  note?: string;
}

/** Available time periods for metric queries */
export type PeriodDays = 1 | 7 | 30 | 90 | 180;

/** Available metric types matching backend endpoints */
export type MetricType =
  | "subscriptions"
  | "onboardings"
  | "images"
  | "emails-sent"
  | "emails-opened"
  | "posts-total"
  | "posts-email"
  | "posts-manual";

/** Configuration for displaying a metric */
export interface MetricConfig {
  type: MetricType;
  label: string;
  color: string;
  iconName: string;
}

/** Record of all metrics data */
export type AllMetricsData = Partial<Record<MetricType, DashboardMetric>>;
