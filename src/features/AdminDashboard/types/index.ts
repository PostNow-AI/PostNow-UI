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
  | "logins"
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

/** Subscription detail for drill-down view */
export interface SubscriptionDetail {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  plan: {
    id: number;
    name: string;
    interval: string;
    interval_display: string;
    price: string;
  };
  start_date: string;
  status: string;
  status_display: string;
}

/** Response from subscription details endpoint */
export interface SubscriptionDetailsResponse {
  subscriptions: SubscriptionDetail[];
  count: number;
  period_days: number;
  start_date: string;
  end_date: string;
}

/** Subscription info for login details */
export interface LoginSubscriptionInfo {
  has_subscription: boolean;
  plan_name: string | null;
  start_date: string | null;
  status: string | null;
  status_display: string | null;
}

/** Login detail for drill-down view */
export interface LoginDetail {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  timestamp: string;
  subscription: LoginSubscriptionInfo;
}

/** Response from login details endpoint */
export interface LoginDetailsResponse {
  logins: LoginDetail[];
  count: number;
  period_days: number;
  start_date: string;
  end_date: string;
}

/** Step names mapping for onboarding funnel */
export interface OnboardingStepNames {
  [key: number]: string;
}

/** Response from onboarding funnel endpoint (Onboarding 2.0 - 20 steps) */
export interface OnboardingFunnelResponse {
  // Total counts
  started: number;
  completed: number;

  // Per-step completed counts (step_1 through step_20)
  step_1: number;
  step_2: number;
  step_3: number;
  step_4: number;
  step_5: number;
  step_6: number;
  step_7: number;
  step_8: number;
  step_9: number;
  step_10: number;
  step_11: number;
  step_12: number;
  step_13: number;
  step_14: number;
  step_15: number;
  step_16: number;
  step_17: number;
  step_18: number;
  step_19: number;
  step_20: number;

  // Per-step visited counts
  step_1_visited: number;
  step_2_visited: number;
  step_3_visited: number;
  step_4_visited: number;
  step_5_visited: number;
  step_6_visited: number;
  step_7_visited: number;
  step_8_visited: number;
  step_9_visited: number;
  step_10_visited: number;
  step_11_visited: number;
  step_12_visited: number;
  step_13_visited: number;
  step_14_visited: number;
  step_15_visited: number;
  step_16_visited: number;
  step_17_visited: number;
  step_18_visited: number;
  step_19_visited: number;
  step_20_visited: number;

  // Phase completion counts
  phase_1_completed: number;
  phase_2_completed: number;
  phase_3_completed: number;
  phase_4_completed: number;
  phase_5_completed: number;

  // Step names for reference
  step_names: OnboardingStepNames;

  // Metadata
  period_days?: number;
  start_date: string;
  end_date: string;
}

/** Phase configuration for funnel display */
export interface FunnelPhase {
  id: number;
  name: string;
  nameEn: string;
  steps: number[];
  color: string;
  textColor: string;
}

/** Onboarding funnel phases configuration */
export const FUNNEL_PHASES: FunnelPhase[] = [
  {
    id: 1,
    name: "Boas-vindas",
    nameEn: "Welcome",
    steps: [1, 2, 3],
    color: "bg-blue-500",
    textColor: "text-blue-400",
  },
  {
    id: 2,
    name: "Seu Negócio",
    nameEn: "Your Business",
    steps: [4, 5, 6, 7, 8],
    color: "bg-purple-500",
    textColor: "text-purple-400",
  },
  {
    id: 3,
    name: "Seu Público",
    nameEn: "Your Audience",
    steps: [9, 10, 11, 12],
    color: "bg-indigo-500",
    textColor: "text-indigo-400",
  },
  {
    id: 4,
    name: "Identidade Visual",
    nameEn: "Visual Identity",
    steps: [13, 14, 15, 16, 17],
    color: "bg-pink-500",
    textColor: "text-pink-400",
  },
  {
    id: 5,
    name: "Autenticação",
    nameEn: "Authentication",
    steps: [18, 19, 20],
    color: "bg-green-500",
    textColor: "text-green-400",
  },
];

/** Step names in Portuguese */
export const STEP_NAMES_PT: Record<number, string> = {
  1: "Boas-vindas",
  2: "Nome do Negócio",
  3: "Contato",
  4: "Nicho",
  5: "Descrição",
  6: "Propósito",
  7: "Personalidade",
  8: "Produtos",
  9: "Público-Alvo",
  10: "Interesses",
  11: "Localização",
  12: "Concorrentes",
  13: "Tom de Voz",
  14: "Estilo Visual",
  15: "Logo",
  16: "Cores",
  17: "Preview",
  18: "Perfil Pronto",
  19: "Cadastro",
  20: "Pagamento",
};

/** Statistics for an onboarding step */
export interface OnboardingStepStatistics {
  total_visits: number;
  completed: number;
  completion_rate: number;
  avg_time_seconds: number;
  prev_step_count: number;
  next_step_count: number;
  drop_off_count: number;
  drop_off_rate: number;
  progression_count: number;
  progression_rate: number;
}

/** User info in session details */
export interface SessionUser {
  id: number;
  email: string;
  username: string;
}

/** Session detail for step drill-down */
export interface OnboardingSessionDetail {
  session_id: string;
  is_simulation: boolean;
  visited_at: string;
  completed: boolean;
  completed_at: string | null;
  time_spent_seconds: number | null;
  user: SessionUser | null;
}

/** Response from onboarding step details endpoint */
export interface OnboardingStepDetailsResponse {
  step_number: number;
  step_name: string;
  step_name_pt: string;
  statistics: OnboardingStepStatistics;
  sessions: OnboardingSessionDetail[];
  sessions_total: number;
  period_days: number;
  start_date: string;
  end_date: string;
}
