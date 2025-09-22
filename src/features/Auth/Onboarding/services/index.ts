import { api } from "@/lib/api";
import type { OnboardingFormData } from "../types";

export const fetchOnboardingStatus = async () => {
  const response = await api.get("/api/v1/creator-profile/onboarding/status/");
  return response.data;
};

export const submitOnboardingStep1 = async (data: OnboardingFormData) => {
  const payload = {
    professional_name: data.professional_name,
    profession:
      data.profession === "Outro" ? data.custom_profession : data.profession,
    instagram_handle: data.instagram_username, // Backend expects instagram_handle
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
    specialization:
      data.specialization === "Outro"
        ? data.custom_specialization
        : data.specialization,
    business_instagram_handle: data.business_instagram, // Backend expects business_instagram_handle
    business_website:
      data.business_website && data.business_website.trim()
        ? data.business_website.startsWith("http://") ||
          data.business_website.startsWith("https://")
          ? data.business_website
          : `https://${data.business_website}`
        : data.business_website,
    business_city: data.business_location, // Backend expects business_city
    business_description: data.business_description,
  };
  const response = await api.put(
    "/api/v1/creator-profile/onboarding/step2/",
    payload
  );
  return response.data;
};

export const submitOnboardingStep3 = async (data: OnboardingFormData) => {
  const payload = {
    voice_tone: data.voice_tone_personality, // Backend expects voice_tone
    logo: data.logo_image_url, // Backend expects logo
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
