import { api } from "./api";

// ===== INTERFACES =====

export interface CreatorProfile {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  // Basic user info
  avatar?: string;
  // Professional information
  professional_name?: string;
  profession?: string;
  specialization?: string;

  // Social media
  linkedin_url?: string;
  instagram_username?: string;
  youtube_channel?: string;
  tiktok_username?: string;

  // Brandbook - Colors
  primary_color?: string;
  secondary_color?: string;
  accent_color_1?: string;
  accent_color_2?: string;
  accent_color_3?: string;

  // Brandbook - Typography
  primary_font?: string;
  secondary_font?: string;

  // Metadata
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  created_at: string;
  updated_at: string;
  onboarding_completed_at?: string;
}

export interface OnboardingData {
  professional_name?: string;
  profession?: string;
  specialization?: string;
  linkedin_url?: string;
  instagram_username?: string;
  youtube_channel?: string;
  tiktok_username?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color_1?: string;
  accent_color_2?: string;
  accent_color_3?: string;
  primary_font?: string;
  secondary_font?: string;
}

export interface OnboardingStatus {
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  has_data: boolean;
  filled_fields_count: number;
  total_fields_count: number;
}

export interface OnboardingSuggestions {
  professions: string[];
  specializations: string[];
  fonts: string[];
  colors: string[];
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
  // Get onboarding status
  getOnboardingStatus: async (): Promise<OnboardingStatus> => {
    const response = await api.get(
      "/api/v1/creator-profile/onboarding/status/"
    );
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

  // Skip onboarding
  skipOnboarding: async (): Promise<{
    message: string;
    skipped: boolean;
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
        | "onboarding_skipped"
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

  // Get onboarding suggestions
  getOnboardingSuggestions: async (): Promise<OnboardingSuggestions> => {
    const response = await api.get(
      "/api/v1/creator-profile/onboarding/suggestions/"
    );
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
