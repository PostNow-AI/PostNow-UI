import { api } from "./api";

// ===== INTERFACES =====

export interface CreatorProfile {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };

  // Step 1: Personal information
  professional_name?: string;
  profession?: string;
  instagram_handle?: string;
  whatsapp_number?: string;

  // Step 2: Business information
  business_name?: string;
  specialization?: string;
  business_instagram_handle?: string;
  business_website?: string;
  business_city?: string;
  business_description?: string;

  // Step 3: Branding
  logo?: string;
  voice_tone?: string;
  color_1?: string;
  color_2?: string;
  color_3?: string;
  color_4?: string;
  color_5?: string;
  color_palette?: string[]; // Read-only computed field

  // Onboarding status
  step_1_completed: boolean;
  step_2_completed: boolean;
  step_3_completed: boolean;
  onboarding_completed: boolean;
  current_step: number; // Read-only computed field

  // Metadata
  created_at: string;
  updated_at: string;
  onboarding_completed_at?: string;
}

export interface OnboardingData {
  // Step 1: Personal information
  professional_name?: string;
  profession?: string;
  instagram_handle?: string;
  whatsapp_number?: string;

  // Step 2: Business information
  business_name?: string;
  specialization?: string;
  business_instagram_handle?: string;
  business_website?: string;
  business_city?: string;
  business_description?: string;

  // Step 3: Branding
  logo?: string;
  voice_tone?: string;
  color_1?: string;
  color_2?: string;
  color_3?: string;
  color_4?: string;
  color_5?: string;
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

  // Step-based onboarding endpoints
  updateStep1: async (
    data: Partial<
      Pick<
        OnboardingData,
        | "professional_name"
        | "profession"
        | "instagram_handle"
        | "whatsapp_number"
      >
    >
  ): Promise<{
    message: string;
    profile: CreatorProfile;
    step_completed: boolean;
    current_step: number;
  }> => {
    const response = await api.patch(
      "/api/v1/creator-profile/onboarding/step1/",
      data
    );
    return response.data;
  },

  updateStep2: async (
    data: Partial<
      Pick<
        OnboardingData,
        | "business_name"
        | "specialization"
        | "business_instagram_handle"
        | "business_website"
        | "business_city"
        | "business_description"
      >
    >
  ): Promise<{
    message: string;
    profile: CreatorProfile;
    step_completed: boolean;
    current_step: number;
  }> => {
    const response = await api.patch(
      "/api/v1/creator-profile/onboarding/step2/",
      data
    );
    return response.data;
  },

  updateStep3: async (
    data: Partial<
      Pick<
        OnboardingData,
        | "logo"
        | "voice_tone"
        | "color_1"
        | "color_2"
        | "color_3"
        | "color_4"
        | "color_5"
      >
    >
  ): Promise<{
    message: string;
    profile: CreatorProfile;
    step_completed: boolean;
    current_step: number;
    onboarding_completed?: boolean;
  }> => {
    const response = await api.patch(
      "/api/v1/creator-profile/onboarding/step3/",
      data
    );
    return response.data;
  },

  // Get complete profile
  getProfile: async (): Promise<CreatorProfile> => {
    const response = await api.get("/api/v1/creator-profile/profile/");
    return response.data;
  },

  // Update profile (partial updates supported)
  updateProfile: async (
    data: Partial<OnboardingData>
  ): Promise<{ message: string; profile: CreatorProfile }> => {
    const response = await api.patch("/api/v1/creator-profile/profile/", data);
    return response.data;
  },

  // Reset profile (for testing)
  resetProfile: async (): Promise<{ message: string; reset: boolean }> => {
    const response = await api.post("/api/v1/creator-profile/profile/reset/");
    return response.data;
  },

  // Get onboarding suggestions
  getOnboardingSuggestions: async (): Promise<OnboardingSuggestions> => {
    const response = await api.get(
      "/api/v1/creator-profile/onboarding/suggestions/"
    );
    return response.data;
  },

  // Generate random colors
  generateRandomColors: async (): Promise<{
    colors: {
      color_1: string;
      color_2: string;
      color_3: string;
      color_4: string;
      color_5: string;
    };
  }> => {
    const response = await api.get(
      "/api/v1/creator-profile/onboarding/colors/"
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
