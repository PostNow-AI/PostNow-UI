import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { profileApi } from "@/features/Auth/Profile/services";
import { handleApiError } from "@/lib/utils/errorHandling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  onboardingSchema,
  type OnboardingFormData,
} from "../constants/onboardingSchema";
import {
  completeOnboarding,
  submitOnboardingStep1,
  submitOnboardingStep2,
  submitOnboardingStep3,
} from "../services";

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { setOpenOnboarding, setShowSuccessDialog } = useOnboardingContext();
  const [previouslyCompletedForm, setPreviouslyCompletedForm] =
    useState<OnboardingFormData | null>(null);
  const percentage = (currentStep / 3) * 100;

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      target_age_range: "18-24",
      target_gender: "all",
      color_1: "#FF6B6B", // Soft Red
      color_2: "#4ECDC4", // Turquoise
      color_3: "#45B7D1", // Sky Blue
      color_4: "#96CEB4", // Sage Green
      color_5: "#FFBE0B", // Golden Yellow
    },
    mode: "onChange",
  });

  const { trigger } = form;

  // Step validation functions
  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "professional_name",
          "profession",
          "whatsapp_number",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "business_name",
          "business_description",
          "target_gender",
          "target_age_range",
          "target_location",
        ];
        break;
      case 3:
        fieldsToValidate = ["voice_tone"];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < 4) {
      // Debug: Log current form values when moving to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: profileApi.getProfile,
    retry: false,
  });

  useEffect(() => {
    setPreviouslyCompletedForm(profile ?? null);
  }, [profile]);

  useEffect(() => {
    if (previouslyCompletedForm) {
      form.reset({
        professional_name: previouslyCompletedForm.professional_name || "",
        profession: previouslyCompletedForm.profession || "",
        whatsapp_number: previouslyCompletedForm.whatsapp_number || "",
        business_name: previouslyCompletedForm.business_name || "",
        business_description:
          previouslyCompletedForm.business_description || "",
        target_gender: previouslyCompletedForm.target_gender || "",
        target_age_range: previouslyCompletedForm.target_age_range || "",
        target_location: previouslyCompletedForm.target_location || "",
        voice_tone: previouslyCompletedForm.voice_tone || "",
        instagram_handle: previouslyCompletedForm.instagram_handle || "",
        specialization: previouslyCompletedForm.specialization || "",
        target_interests: previouslyCompletedForm.target_interests || "",
        logo: previouslyCompletedForm.logo || "",
        color_1: previouslyCompletedForm.color_1 || "",
        color_2: previouslyCompletedForm.color_2 || "",
        color_3: previouslyCompletedForm.color_3 || "",
        color_4: previouslyCompletedForm.color_4 || "",
        color_5: previouslyCompletedForm.color_5 || "",
      });
    }
  }, [previouslyCompletedForm, form]);

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      await submitOnboardingStep1(data);
      await submitOnboardingStep2(data);
      await submitOnboardingStep3(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      setOpenOnboarding(false);
      if (!previouslyCompletedForm) {
        setShowSuccessDialog(true);
      }
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao salvar dados",
        defaultDescription:
          "Não foi possível salvar os dados do perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      await completeOnboarding();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Perfil configurado com sucesso!");
      setOpenOnboarding(false);
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao salvar dados",
        defaultDescription:
          "Não foi possível salvar os dados do perfil. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const handleFormSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      await onboardingMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleFormSubmit,
    form,
    currentStep,
    handleNextStep,
    handlePrevStep,
    previouslyCompletedForm,
    completeOnboardingMutation,
    percentage,
  };
};
