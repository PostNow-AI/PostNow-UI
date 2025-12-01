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
          "business_name",
          "business_description",
          "specialization",
          "business_purpose",
          "brand_personality",
          "products_services",
          "business_location",
          "target_audience",
          "business_purpose",
          "brand_personality",
        ];
        break;
      case 2:
        fieldsToValidate = ["voice_tone", "visual_style_ids"];
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
        business_name: previouslyCompletedForm.business_name || "",
        business_description:
          previouslyCompletedForm.business_description || "",
        business_purpose: previouslyCompletedForm.business_purpose || "",
        brand_personality: previouslyCompletedForm.brand_personality || "",
        products_services: previouslyCompletedForm.products_services || "",
        business_phone: previouslyCompletedForm.business_phone || "",
        business_website: previouslyCompletedForm.business_website || "",
        business_instagram_handle:
          previouslyCompletedForm.business_instagram_handle || "",
        target_audience: previouslyCompletedForm.target_audience || "",
        target_interests: previouslyCompletedForm.target_interests || "",
        main_competitors: previouslyCompletedForm.main_competitors || "",
        reference_profiles: previouslyCompletedForm.reference_profiles || "",
        business_location: previouslyCompletedForm.business_location || "",
        voice_tone: previouslyCompletedForm.voice_tone || "",
        specialization: previouslyCompletedForm.specialization || "",
        logo: previouslyCompletedForm.logo || "",
        visual_style_ids: previouslyCompletedForm?.visual_style_ids?.map((id) =>
          id.toString()
        ) || [""],
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
