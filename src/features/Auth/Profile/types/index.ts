export interface OnboardingStatus {
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  has_data: boolean;
  filled_fields_count: number;
  total_fields_count: number;
}

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
}
