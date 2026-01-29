/**
 * Instagram Integration Type Definitions
 * PostNow - Instagram Graph API Integration
 */

export interface InstagramAccount {
  id: number;
  user: number;
  instagram_user_id: string;
  username: string;
  account_type: "BUSINESS" | "CREATOR" | "PERSONAL";
  profile_picture_url?: string;
  followers_count: number;
  media_count: number;
  is_active: boolean;
  access_token_expires_at: string;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InstagramMetrics {
  id: number;
  account: number;
  date: string;
  impressions: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
  email_contacts: number;
  follower_count: number;
  follower_growth: number;
  engagement_rate: number;
  created_at: string;
}

export interface InstagramNotification {
  id: number;
  account: number;
  notification_type:
    | "first_connection"
    | "token_expiring"
    | "token_expired"
    | "sync_error"
    | "sync_success"
    | "daily_report";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface InstagramConnectionAttempt {
  id: number;
  user: number;
  step_reached: string;
  error_message?: string;
  success: boolean;
  created_at: string;
}

export interface InstagramConnectResponse {
  authorization_url: string;
  state: string;
}

export interface InstagramCallbackRequest {
  code: string;
  state: string;
}

export interface InstagramCallbackResponse {
  success: boolean;
  message: string;
  account?: InstagramAccount;
}

export interface InstagramStatusResponse {
  connected: boolean;
  account?: InstagramAccount;
  days_until_expiration?: number;
  needs_reconnection: boolean;
}

export interface InstagramSyncResponse {
  success: boolean;
  message: string;
  metrics?: InstagramMetrics;
  next_sync_available_at?: string;
}

export interface InstagramMetricsResponse {
  results: InstagramMetrics[];
  count: number;
}

export interface InstagramNotificationsResponse {
  results: InstagramNotification[];
  count: number;
  unread_count: number;
}

export interface InstagramHealthCheckResponse {
  status: "healthy" | "degraded" | "down";
  details: {
    database: boolean;
    instagram_api: boolean;
    encryption: boolean;
  };
  message: string;
}

export interface MetricsChartData {
  date: string;
  impressions: number;
  reach: number;
  profileViews: number;
  followers: number;
  engagement: number;
}

export interface BestPostingTime {
  hour: number;
  day: string;
  avgEngagement: number;
}

export interface InstagramInsights {
  totalFollowers: number;
  followerGrowth: number;
  avgEngagementRate: number;
  totalImpressions: number;
  totalReach: number;
  bestPostingTimes: BestPostingTime[];
}
