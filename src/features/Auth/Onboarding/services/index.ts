// @ts-nocheck
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

export const fetchOnboardingStatus = async () => {
  const response = await api.get("/api/v1/creator-profile/onboarding/status/");
  return response.data;
};

export const completeOnboarding = async (): Promise<{
  message: string;
  completed: boolean;
}> => {
  const response = await api.post("/api/v1/creator-profile/profile/complete/");
  return response.data;
};

export const submitOnboardingStep1 = async (data: OnboardingFormData | OnboardingStep1Data) => {
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
  const response = await api.put(
    "/api/v1/creator-profile/onboarding/step1/",
    payload,
  );
  return response.data;
};

export const submitOnboardingStep2 = async (data: OnboardingFormData | OnboardingStep2Data) => {
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
  const response = await api.put(
    "/api/v1/creator-profile/onboarding/step2/",
    payload,
  );
  return response.data;
};

export const fetchVisualStylePreferences = async () => {
  const response = await api.get(
    "/api/v1/creator-profile/visual-style-preferences/",
  );
  return response.data;
};

export const createVisualStylePreference = async (
  name: string,
  description: string,
) => {
  const payload = {
    name,
    description,
  };
  const response = await api.post(
    "/api/v1/creator-profile/visual-style-preferences/",
    payload,
  );
  return response.data;
};

export const generateSingleClientContext = async () => {
  const response = await api.post(
    "/api/v1/client-context/generate-single-client-context/",
  );
  return response.data;
};
