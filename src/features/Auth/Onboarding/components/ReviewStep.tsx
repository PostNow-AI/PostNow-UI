import { Verified } from "lucide-react";
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
  return (
    <OnboardingReview
      title={
        <>
          <Verified className="text-lime-600 h-6 w-6" />
          Revise as informações de negócio
        </>
      }
      description="Se estiver tudo certo, estamos prontos para começar o trabalho."
      values={watchedValues}
    />
  );
};
