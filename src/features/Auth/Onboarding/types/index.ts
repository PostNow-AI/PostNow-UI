export interface OnboardingFormData {
  professional_name: string;
  profession: string;
  custom_profession?: string;
  instagram_username?: string;
  whatsapp_number: string;
  business_name: string;
  specialization: string;
  custom_specialization?: string;
  business_instagram?: string;
  business_website?: string;
  business_location: string;
  business_description: string;
  voice_tone_personality: string;
  logo_image_url?: string;
  color_1?: string;
  color_2?: string;
  color_3?: string;
  color_4?: string;
  color_5?: string;
}

export interface OnboardingStatus {
  onboarding_completed: boolean;
  has_data: boolean;
  filled_fields_count: number;
  total_fields_count: number;
}
