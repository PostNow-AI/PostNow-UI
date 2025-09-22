import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { onboardingSchema } from "../constants/onboardingSchema";
import {
  submitOnboardingStep1,
  submitOnboardingStep2,
  submitOnboardingStep3,
} from "../services";
import type { OnboardingFormData } from "../types";
import { useProfessions } from "./useProfessions";
import { useSpecializations } from "./useSpecializations";

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      whatsapp_number: "+55",
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
          "specialization",
          "business_location",
          "business_description",
        ];
        break;
      case 3:
        fieldsToValidate = ["voice_tone_personality"];
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
  const { watch } = form;
  const queryClient = useQueryClient();

  const watchedValues = watch();
  const selectedProfession = watchedValues.profession;

  const professions = useProfessions();

  const { specializations, isLoadingSpecializations } = useSpecializations(
    professions,
    selectedProfession
  );

  // Get all available professions
  const allAvailableProfessions = [...professions.map((p) => p.name)];

  // Get available specializations for selected profession
  const availableSpecializations = specializations?.specializations || [];

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      await submitOnboardingStep1(data);
      await submitOnboardingStep2(data);
      await submitOnboardingStep3(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Perfil configurado com sucesso!");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao salvar dados");
      } else {
        toast.error("Erro ao salvar dados");
      }
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
    allAvailableProfessions,
    availableSpecializations,
    handleFormSubmit,
    isLoadingSpecializations,
    form,
    currentStep,
    handleNextStep,
    handlePrevStep,
  };
};
