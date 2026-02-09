// @ts-nocheck
/**
 * Types para o sistema de Campanhas.
 * Seguindo padrão de IdeaBank/types/index.ts
 */

import type { Post, PostIdea } from "@/features/IdeaBank/types";

// ============================================================================
// CAMPAIGN TYPES
// ============================================================================

export type CampaignType =
  | "branding"
  | "sales"
  | "launch"
  | "education"
  | "engagement"
  | "lead_generation"
  | "portfolio";

export type CampaignStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "active"
  | "completed"
  | "paused";

export type CampaignStructure =
  | "aida"
  | "pas"
  | "funil"
  | "bab"
  | "storytelling"
  | "simple";

export interface Campaign {
  id: number;
  name: string;
  type: CampaignType;
  type_display: string;
  objective: string;
  main_message: string;
  structure: CampaignStructure;
  structure_display: string;
  duration_days: number;
  post_count: number;
  post_frequency: number;
  start_date: string | null;
  end_date: string | null;
  visual_styles: string[];
  content_mix: Record<string, number>;
  status: CampaignStatus;
  status_display: string;
  is_auto_generated: boolean;
  posts_count: number;
  posts_approved_count: number;
  is_fully_approved: boolean;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  completed_at: string | null;
}

export interface CampaignPost {
  id: number;
  campaign: number;
  post: Post;
  sequence_order: number;
  scheduled_date: string;
  scheduled_time: string;
  phase: string;
  phase_display: string;
  theme: string;
  visual_style: string;
  is_approved: boolean;
  approved_at: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface CampaignWithPosts extends Campaign {
  campaign_posts: CampaignPost[];
}

export interface CampaignDraft {
  id: number;
  user: number;
  status: string;
  current_phase: string;
  briefing_data: Record<string, any>;
  structure_chosen: string | null;
  styles_chosen: string[];
  duration_days: number | null;
  post_count: number | null;
  posts_data: any[];
  completed_campaign: number | null;
  total_time_spent: number;
  interaction_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CampaignCreationData {
  name: string;
  type: CampaignType;
  objective: string;
  main_message?: string;
  structure: CampaignStructure;
  duration_days: number;
  post_count: number;
  post_frequency?: number;
  visual_styles: string[];
  content_mix?: Record<string, number>;
  briefing_data?: Record<string, any>;
  is_auto_generated?: boolean;
}

export interface CampaignGenerationRequest {
  objective: string;
  main_message?: string;
  structure: CampaignStructure;
  duration_days: number;
  post_count: number;
  visual_styles: string[];
  briefing_data?: Record<string, any>;
}

export interface CampaignGenerationResponse {
  campaign_id: number;
  posts: Array<{
    campaign_post_id: number;
    post_id: number;
    post_idea_id: number;
    sequence: number;
    phase: string;
    content_preview: string;
    has_image: boolean;
  }>;
  total_generated: number;
  success_rate: number;
  message: string;
}

export interface PostRegenerationRequest {
  feedback_items?: string[];
  user_note?: string;
}

// ============================================================================
// VISUAL STYLE TYPES
// ============================================================================

export interface VisualStyle {
  id: number;
  name: string;
  slug: string;
  category: string;
  category_display: string;
  description: string;
  tags: string[];
  global_success_rate: number;
  success_rate_by_niche: Record<string, number>;
  preview_image_url: string | null;
  best_for_campaign_types: string[];
  best_for_niches: string[];
  is_active: boolean;
}

// ============================================================================
// STRUCTURE TYPES
// ============================================================================

export interface CampaignStructureConfig {
  name: string;
  description: string;
  phases: Array<{
    name: string;
    key: string;
    weight: number;
    objective: string;
    description: string;
  }>;
  ideal_duration_days: number;
  min_duration_days: number;
  max_duration_days: number;
  ideal_posts: [number, number];
  posts_per_week: [number, number];
  best_for: string[];
  success_rate: number;
  sample_size: number;
  source: string;
}

export interface StructuresResponse {
  success: boolean;
  data: Record<string, CampaignStructureConfig>;
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export interface CampaignTemplate {
  id: number;
  name: string;
  description: string;
  campaign_type: CampaignType;
  campaign_type_display: string;
  structure: CampaignStructure;
  structure_display: string;
  duration_days: number;
  post_count: number;
  post_frequency: number;
  visual_styles: string[];
  content_mix: Record<string, number>;
  phase_distribution: Record<string, number>;
  style_mapping: Record<string, string>;
  success_rate: number;
  times_used: number;
  avg_approval_rate: number;
  created_at: string;
}

// ============================================================================
// WIZARD STEP TYPES
// ============================================================================

export type WizardStep =
  | "flow"
  | "briefing"
  | "structure"
  | "duration"
  | "styles"
  | "review"
  | "generating"
  | "approval";

export interface BriefingData {
  objective: string;
  main_message: string;
  has_cases?: boolean;
  cases_description?: string;
  has_materials?: boolean;
  materials_description?: string;
  deadline?: string;
  additional_info?: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
  phase: string;
  message: string;
}

