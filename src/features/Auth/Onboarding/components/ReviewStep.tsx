import type { UseFormReturn } from "react-hook-form";
import { OnboardingReview } from "../../components/OnboardingReview";
import type { OnboardingFormData } from "../constants/onboardingSchema";

export const ReviewStep = ({
  form,
}: {
  form: UseFormReturn<OnboardingFormData>;
}) => {
  const { watch } = form;

  const watchedValues = watch();
  return <OnboardingReview values={watchedValues} />;
};
