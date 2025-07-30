import { api } from "./api";

// ===== INTERFACES =====

export interface CreatorProfile {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  // Required fields (onboarding)
  main_platform: string;
  niche: string;
  experience_level: string;
  primary_goal: string;
  time_available: string;

  // Important fields (level 2)
  specific_profession?: string;
  target_audience?: string;
  communication_tone?: string;
  expertise_areas?: string[];
  preferred_duration?: string;
  complexity_level?: string;
  theme_diversity?: number;
  publication_frequency?: string;

  // Optional fields (level 3)
  instagram_username?: string;
  linkedin_url?: string;
  twitter_username?: string;
  tiktok_username?: string;
  revenue_stage?: string;
  team_size?: string;
  revenue_goal?: string;
  authority_goal?: string;
  leads_goal?: string;
  has_designer?: boolean;
  current_tools?: string[];
  tools_budget?: string;
  preferred_hours?: string[];

  // Completion tracking
  onboarding_completed: boolean;
  completeness_percentage: number;
  created_at: string;
  updated_at: string;
  onboarding_completed_at?: string;
}

export interface OnboardingData {
  main_platform: string;
  niche: string;
  experience_level: string;
  primary_goal: string;
  time_available: string;
}

export interface ProfileCompletionStatus {
  onboarding_completed: boolean;
  completeness_percentage: number;
  required_fields_missing: string[];
  total_fields: number;
  filled_fields: number;
}

export interface ProfileChoices {
  platforms: { value: string; label: string }[];
  experience_levels: { value: string; label: string }[];
  goals: { value: string; label: string }[];
  time_options: { value: string; label: string }[];
  communication_tones: { value: string; label: string }[];
  content_durations: { value: string; label: string }[];
  complexity_levels: { value: string; label: string }[];
  frequencies: { value: string; label: string }[];
  revenue_stages: { value: string; label: string }[];
  team_sizes: { value: string; label: string }[];
}

export interface ProfileSuggestions {
  niches: string[];
  tools: string[];
  expertise_areas: string[];
  preferred_hours: string[];
}

export interface UserBehavior {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  ideas_selected: string[];
  ideas_rejected: string[];
  avg_time_per_idea: number;
  preferred_topics: string[];
  preferred_complexity: number;
  preferred_length: string;
  peak_hours: string[];
  usage_frequency: string;
  avg_session_duration: number;
  total_interactions: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

// ===== API METHODS =====

export const creatorProfileApi = {
  // Get profile completion status
  getCompletionStatus: async (): Promise<ProfileCompletionStatus> => {
    const response = await api.get("/api/v1/creator-profile/status/");
    return response.data;
  },

  // Submit onboarding form
  submitOnboarding: async (
    data: OnboardingData
  ): Promise<{ message: string; profile: CreatorProfile }> => {
    const response = await api.post(
      "/api/v1/creator-profile/onboarding/",
      data
    );
    return response.data;
  },

  // Skip onboarding (only works if required fields are completed)
  skipOnboarding: async (): Promise<{
    message: string;
    can_skip: boolean;
    completeness_percentage: number;
  }> => {
    const response = await api.post("/api/v1/creator-profile/onboarding/skip/");
    return response.data;
  },

  // Get complete profile
  getProfile: async (): Promise<CreatorProfile> => {
    const response = await api.get("/api/v1/creator-profile/profile/");
    return response.data;
  },

  // Update profile (partial updates supported)
  updateProfile: async (
    data: Partial<
      Omit<
        CreatorProfile,
        | "user"
        | "onboarding_completed"
        | "completeness_percentage"
        | "created_at"
        | "updated_at"
        | "onboarding_completed_at"
      >
    >
  ): Promise<{ message: string; profile: CreatorProfile }> => {
    const response = await api.patch("/api/v1/creator-profile/profile/", data);
    return response.data;
  },

  // Reset profile (for testing)
  resetProfile: async (): Promise<{ message: string; reset: boolean }> => {
    const response = await api.delete("/api/v1/creator-profile/profile/reset/");
    return response.data;
  },

  // Get profile field choices
  getChoices: async (): Promise<ProfileChoices> => {
    const response = await api.get("/api/v1/creator-profile/choices/");
    return response.data;
  },

  // Get profile suggestions
  getSuggestions: async (): Promise<ProfileSuggestions> => {
    const response = await api.get("/api/v1/creator-profile/suggestions/");
    return response.data;
  },

  // User behavior endpoints
  getBehavior: async (): Promise<UserBehavior> => {
    const response = await api.get("/api/v1/creator-profile/behavior/");
    return response.data;
  },

  updateBehavior: async (
    data: Partial<
      Omit<UserBehavior, "user" | "created_at" | "updated_at" | "last_activity">
    >
  ): Promise<{ message: string; behavior: UserBehavior }> => {
    const response = await api.patch("/api/v1/creator-profile/behavior/", data);
    return response.data;
  },
};
