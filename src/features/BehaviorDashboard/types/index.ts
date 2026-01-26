export interface TimelineData {
  date: string;
  count: number;
}

export interface MetricResponse {
  metric: string;
  count: number;
  period_days: number;
  start_date: string;
  end_date: string;
  metric_name: string;
  note: string;
  timeline: TimelineData[];
}

export interface DateRangeOption {
  value: number;
  label: string;
}

export interface DashboardMetric {
  data: MetricResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export interface DashboardMetrics {
  subscriptions: DashboardMetric;
  onboardings: DashboardMetric;
  images: DashboardMetric;
  emailsSent: DashboardMetric;
  emailsOpened: DashboardMetric;
  postsTotal: DashboardMetric;
  postsEmail: DashboardMetric;
  postsManual: DashboardMetric;
}

export type MetricType =
  | "subscriptions"
  | "onboardings"
  | "images"
  | "emailsSent"
  | "emailsOpened"
  | "postsTotal"
  | "postsEmail"
  | "postsManual";
