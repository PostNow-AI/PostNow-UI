import { api } from "@/lib/api";
import type { OnboardingFormData } from "../constants/onboardingSchema";

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

export const submitOnboardingStep1 = async (data: OnboardingFormData) => {
  const payload = {
    professional_name: data.professional_name,
    profession: data.profession,
    instagram_handle: data.instagram_handle, // Backend expects instagram_handle
    whatsapp_number: data.whatsapp_number,
  };
  const response = await api.put(
    "/api/v1/creator-profile/onboarding/step1/",
    payload
  );
  return response.data;
};

export const submitOnboardingStep2 = async (data: OnboardingFormData) => {
  const payload = {
    business_name: data.business_name,
    specialization: data.specialization || "",
    business_description: data.business_description,
    target_gender: data.target_gender,
    target_age_range: data.target_age_range,
    target_interests: data.target_interests || "",
    target_location: data.target_location,
  };
  const response = await api.put(
    "/api/v1/creator-profile/onboarding/step2/",
    payload
  );
  return response.data;
};

export const submitOnboardingStep3 = async (data: OnboardingFormData) => {
  const payload = {
    voice_tone: data.voice_tone, // Backend expects voice_tone
    logo: data.logo, // Backend expects logo
    color_1: data.color_1,
    color_2: data.color_2,
    color_3: data.color_3,
    color_4: data.color_4,
    color_5: data.color_5,
  };
  const response = await api.put(
    "/api/v1/creator-profile/onboarding/step3/",
    payload
  );
  return response.data;
};
