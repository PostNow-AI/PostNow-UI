/**
 * Instagram Scheduling Types
 *
 * Types for Instagram account management and scheduled posts.
 */

// Instagram Account Types
export type InstagramAccountStatus =
  | "connected"
  | "disconnected"
  | "token_expired"
  | "error";

export interface InstagramAccount {
  id: number;
  instagram_user_id: string;
  instagram_username: string;
  instagram_name: string | null;
  profile_picture_url: string | null;
  facebook_page_id: string;
  facebook_page_name: string | null;
  status: InstagramAccountStatus;
  status_display: string;
  is_token_valid: boolean;
  days_until_expiration: number;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InstagramAccountListItem {
  id: number;
  instagram_username: string;
  instagram_name: string | null;
  profile_picture_url: string | null;
  status: InstagramAccountStatus;
  status_display: string;
  is_token_valid: boolean;
}

// Scheduled Post Types
export type ScheduledPostStatus =
  | "draft"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed"
  | "cancelled";

export type MediaType = "IMAGE" | "VIDEO" | "CAROUSEL" | "REELS" | "STORY";

export interface PublishingLog {
  id: number;
  attempt_number: number;
  status: string;
  status_display: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  step: string | null;
  error_code: string | null;
  error_message: string | null;
}

export interface ScheduledPost {
  id: number;
  caption: string;
  caption_preview: string;
  media_type: MediaType;
  media_type_display: string;
  media_urls: string[];
  scheduled_for: string;
  timezone: string;
  status: ScheduledPostStatus;
  status_display: string;
  instagram_media_id: string | null;
  instagram_permalink: string | null;
  published_at: string | null;
  retry_count: number;
  max_retries: number;
  last_error: string | null;
  is_ready_to_publish: boolean;
  can_retry: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduledPostListItem {
  id: number;
  caption_preview: string;
  media_type: MediaType;
  media_type_display: string;
  media_urls: string[];
  scheduled_for: string;
  status: ScheduledPostStatus;
  status_display: string;
  instagram_username: string;
  profile_picture_url: string | null;
  instagram_permalink: string | null;
  published_at: string | null;
  created_at: string;
}

export interface ScheduledPostDetail extends ScheduledPost {
  instagram_account: InstagramAccountListItem;
  post_idea: {
    id: number;
    content: string;
    content_preview: string;
    image_url: string | null;
    post_name: string;
    post_type: string;
  } | null;
  instagram_container_id: string | null;
  next_retry_at: string | null;
  publishing_logs: PublishingLog[];
}

// Create/Update Types
export interface ScheduledPostCreateData {
  instagram_account_id: number;
  post_idea_id?: number;
  caption: string;
  media_type: MediaType;
  media_urls: string[];
  scheduled_for: string;
  timezone?: string;
}

export interface ScheduledPostUpdateData {
  caption?: string;
  media_type?: MediaType;
  media_urls?: string[];
  scheduled_for?: string;
  timezone?: string;
}

// Calendar Event
export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  status: ScheduledPostStatus;
  status_display: string;
  media_type: MediaType;
  instagram_username: string;
  thumbnail_url: string | null;
}

// Stats
export interface ScheduledPostStats {
  pending: number;
  scheduled_future: number;
  published_today: number;
  failed: number;
  total_published: number;
}

// API Response Types
export interface PublishNowResponse {
  message: string;
  media_id: string;
  permalink: string;
}

export interface ErrorResponse {
  error: string;
  error_code?: string;
}
