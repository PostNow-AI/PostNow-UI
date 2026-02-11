import { api } from "@/lib/api";
import type { OnboardingFormData } from "../constants/onboardingSchema";

// Tipos para os steps do novo onboarding
export interface OnboardingStep1Data {
  business_name: string | null;
  business_phone: string | null;
  business_website?: string | null;
  business_instagram_handle?: string | null;
  specialization: string | null;
  business_description: string | null;
  business_purpose: string | null;
  brand_personality: string | null;
  products_services: string | null;
  business_location: string | null;
  target_audience: string | null;
  target_interests?: string | null;
  main_competitors?: string | null;
  reference_profiles?: string | null;
}

export interface OnboardingStep2Data {
  voice_tone: string | null;
  logo?: string | null;
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
