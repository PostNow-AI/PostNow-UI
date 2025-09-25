import type { OnboardingFormData } from "@/features/Auth/Onboarding/constants/onboardingSchema";
import { api } from "../../../../lib/api";
import type { OnboardingStatus, UserData } from "../types";

export const profileApi = {
  // Get onboarding status
  getOnboardingStatus: async (): Promise<OnboardingStatus> => {
    const response = await api.get(
      "/api/v1/creator-profile/onboarding/status/"
    );
    return response.data;
  },
  // Reset onboarding (for editing)
  resetOnboardingForEdit: async (): Promise<{
    message: string;
    reset: boolean;
  }> => {
    const response = await api.post("/api/v1/creator-profile/profile/reset/");
    return response.data;
  },

  // Get complete profile
  getProfile: async (): Promise<OnboardingFormData> => {
    const response = await api.get("/api/v1/creator-profile/profile/");
    return response.data;
  },

  // Update profile (partial updates supported)
  updateProfile: async (data: Partial<UserData>): Promise<void> => {
    const response = await api.patch("/api/v1/auth/user/", data);
    return response.data;
  },

  updatePassword: async (data: {
    old_password: string;
    new_password1: string;
    new_password2: string;
  }): Promise<void> => {
    const response = await api.post("/api/v1/auth/password/change/", data);
    return response.data;
  },
};
