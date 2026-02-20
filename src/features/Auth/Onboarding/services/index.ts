import { api } from "@/lib/api";
import type { OnboardingFormData } from "../constants/onboardingSchema";

// Tipos para os steps do novo onboarding
export interface OnboardingStep1Data {
  business_name: string;
  business_phone: string;
  business_website?: string;
  business_instagram_handle?: string;
  specialization: string;
  business_description: string;
  business_purpose: string;
  brand_personality: string;
  products_services: string;
  business_location: string;
  target_audience: string;
  target_interests?: string;
  main_competitors?: string;
  reference_profiles?: string;
}

export interface OnboardingStep2Data {
  voice_tone: string;
  logo?: string;
  color_1?: string;
  color_2?: string;
  color_3?: string;
  color_4?: string;
  color_5?: string;
  visual_style_ids?: string[];
}

export interface OnboardingStatus {
  onboarding_completed: boolean;
  step1_completed: boolean;
  step2_completed: boolean;
}

export const fetchOnboardingStatus = async (): Promise<OnboardingStatus> => {
  const response = await api.get<OnboardingStatus>("/api/v1/creator-profile/onboarding/status/");
  return response.data;
};

export const completeOnboarding = async (): Promise<{
  message: string;
  completed: boolean;
}> => {
  const response = await api.post<{ message: string; completed: boolean }>("/api/v1/creator-profile/profile/complete/");
  return response.data;
};

export interface OnboardingStepResponse {
  message: string;
  step_completed: boolean;
}

export interface VisualStylePreference {
  id: string;
  name: string;
  description: string;
  preview_image_url?: string | null;
}

export const submitOnboardingStep1 = async (data: OnboardingFormData | OnboardingStep1Data): Promise<OnboardingStepResponse> => {
  const payload = {
    business_name: data.business_name,
    business_phone: data.business_phone,
    business_website: data.business_website || "",
    business_instagram_handle: data.business_instagram_handle || "",
    specialization: data.specialization,
    business_description: data.business_description,
    business_purpose: data.business_purpose,
    brand_personality: data.brand_personality,
    products_services: data.products_services,
    business_location: data.business_location,
    target_audience: data.target_audience,
    target_interests: data.target_interests || "",
    main_competitors: data.main_competitors || "",
    reference_profiles: data.reference_profiles || "",
  };
  const response = await api.put<OnboardingStepResponse>(
    "/api/v1/creator-profile/onboarding/step1/",
    payload,
  );
  return response.data;
};

export const submitOnboardingStep2 = async (data: OnboardingFormData | OnboardingStep2Data): Promise<OnboardingStepResponse> => {
  const payload = {
    voice_tone: data.voice_tone,
    logo: data.logo || "",
    color_1: data.color_1 || "",
    color_2: data.color_2 || "",
    color_3: data.color_3 || "",
    color_4: data.color_4 || "",
    color_5: data.color_5 || "",
    visual_style_ids: data.visual_style_ids || [],
  };
  const response = await api.put<OnboardingStepResponse>(
    "/api/v1/creator-profile/onboarding/step2/",
    payload,
  );
  return response.data;
};

export const fetchVisualStylePreferences = async (): Promise<VisualStylePreference[]> => {
  const response = await api.get<VisualStylePreference[]>(
    "/api/v1/creator-profile/visual-style-preferences/",
  );
  return response.data;
};

export const createVisualStylePreference = async (
  name: string,
  description: string,
): Promise<VisualStylePreference> => {
  const payload = {
    name,
    description,
  };
  const response = await api.post<VisualStylePreference>(
    "/api/v1/creator-profile/visual-style-preferences/",
    payload,
  );
  return response.data;
};

export const generateSingleClientContext = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    "/api/v1/client-context/generate-single-client-context/",
  );
  return response.data;
};

// ========================================
// Temporary Onboarding Data (for anonymous users)
// ========================================

export interface TempOnboardingData {
  session_id: string;
  // Business data
  business_name?: string;
  business_phone?: string;
  business_website?: string;
  business_instagram_handle?: string;
  specialization?: string;
  business_description?: string;
  business_purpose?: string;
  brand_personality?: string;
  products_services?: string;
  target_audience?: string;
  target_interests?: string;
  business_location?: string;
  main_competitors?: string;
  reference_profiles?: string;
  // Branding data
  voice_tone?: string;
  logo?: string;
  color_1?: string;
  color_2?: string;
  color_3?: string;
  color_4?: string;
  color_5?: string;
  visual_style_ids?: string[];
}

export interface GetTempDataResponse {
  session_id: string;
  business_data: Record<string, unknown>;
  branding_data: Record<string, unknown>;
  expires_at: string;
}

/**
 * Save temporary onboarding data (no auth required).
 * Use this to persist data for anonymous users during onboarding.
 */
export const saveTempOnboardingData = async (data: TempOnboardingData): Promise<GetTempDataResponse> => {
  const response = await api.post<GetTempDataResponse>(
    "/api/v1/creator-profile/onboarding/temp-data/",
    data,
  );
  return response.data;
};

/**
 * Get temporary onboarding data by session_id (no auth required).
 * Returns null if data not found or expired.
 */
export const getTempOnboardingData = async (sessionId: string): Promise<GetTempDataResponse | null> => {
  try {
    const response = await api.get<GetTempDataResponse>(
      `/api/v1/creator-profile/onboarding/temp-data/?session_id=${encodeURIComponent(sessionId)}`,
    );
    return response.data;
  } catch {
    // Return null if data not found (404)
    return null;
  }
};

/**
 * Link temporary data to authenticated user (auth required).
 * Call this AFTER user signs up to transfer temp data to their profile.
 */
export const linkTempDataToUser = async (sessionId: string): Promise<{ status: string; profile_updated: boolean }> => {
  const response = await api.post<{ status: string; profile_updated: boolean }>(
    "/api/v1/creator-profile/onboarding/link-data/",
    { session_id: sessionId },
  );
  return response.data;
};

/**
 * Track onboarding step completion (no auth required).
 */
export const trackOnboardingStep = async (
  sessionId: string,
  stepNumber: number,
  completed: boolean = true,
): Promise<void> => {
  await api.post("/api/v1/creator-profile/onboarding/track-step/", {
    session_id: sessionId,
    step_number: stepNumber,
    completed,
  });
};
