import { creatorProfileApi } from "@/lib/creator-profile-api";
import {
  profileCompletionSchema,
  type ProfileCompletionData,
} from "@/types/profile-completion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UseOptionalOnboardingProps {
  onComplete: () => void;
}

export const useOptionalOnboarding = ({
  onComplete,
}: UseOptionalOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);

  // Form setup
  const form = useForm<ProfileCompletionData>({
    resolver: zodResolver(profileCompletionSchema),
    mode: "onSubmit",
    shouldFocusError: false,
    shouldUnregister: false,
    delayError: 500,
    defaultValues: {
      theme_diversity: 5,
      expertise_areas: [],
      current_tools: [],
      preferred_hours: [],
    },
  });

  const { register, setValue, watch, handleSubmit } = form;

  // Reset submit flag when step changes
  React.useEffect(() => {
    if (isSubmitAllowed) {
      setIsSubmitAllowed(false);
    }
  }, [currentStep, isSubmitAllowed]);

  // Fetch choices and suggestions
  const { data: choices, isLoading: choicesLoading } = useQuery({
    queryKey: ["profile-choices"],
    queryFn: creatorProfileApi.getChoices,
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["profile-suggestions"],
    queryFn: creatorProfileApi.getSuggestions,
  });

  // Submit optional data mutation
  const optionalMutation = useMutation({
    mutationFn: creatorProfileApi.updateProfile,
    onSuccess: (data) => {
      setIsSubmitAllowed(false);

      toast.success("Perfil aprimorado!", {
        description: `${data.profile.completeness_percentage}% do perfil completo`,
      });

      setTimeout(() => {
        onComplete();
      }, 1000);
    },
    onError: (error: unknown) => {
      setIsSubmitAllowed(false);

      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "Erro ao atualizar perfil";
        toast.error("Erro na atualização", {
          description: message,
        });
      }
    },
  });

  // Handle expertise management
  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      const currentAreas = watch("expertise_areas") || [];
      if (!currentAreas.includes(expertiseInput.trim())) {
        setValue("expertise_areas", [...currentAreas, expertiseInput.trim()]);
      }
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (area: string) => {
    const currentAreas = watch("expertise_areas") || [];
    setValue(
      "expertise_areas",
      currentAreas.filter((a) => a !== area)
    );
  };

  // Handle tools management
  const handleAddTool = () => {
    if (toolsInput.trim()) {
      const currentTools = watch("current_tools") || [];
      if (!currentTools.includes(toolsInput.trim())) {
        setValue("current_tools", [...currentTools, toolsInput.trim()]);
      }
      setToolsInput("");
    }
  };

  const handleRemoveTool = (tool: string) => {
    const currentTools = watch("current_tools") || [];
    setValue(
      "current_tools",
      currentTools.filter((t) => t !== tool)
    );
  };

  // Handle preferred hours toggle
  const handleToggleHour = (hour: string) => {
    const currentHours = watch("preferred_hours") || [];
    if (currentHours.includes(hour)) {
      setValue(
        "preferred_hours",
        currentHours.filter((h) => h !== hour)
      );
    } else {
      setValue("preferred_hours", [...currentHours, hour]);
    }
  };

  // Handle form submission
  const onSubmit = (data: ProfileCompletionData) => {
    if (currentStep !== 4) {
      return;
    }
    optionalMutation.mutate(data);
  };

  // Navigation
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / 4) * 100;
  const isLoading = choicesLoading || suggestionsLoading;

  return {
    // Form
    form,
    register,
    setValue,
    watch,
    handleSubmit,
    onSubmit,

    // State
    currentStep,
    setCurrentStep,
    expertiseInput,
    setExpertiseInput,
    toolsInput,
    setToolsInput,
    isSubmitAllowed,
    setIsSubmitAllowed,

    // Data
    choices,
    suggestions,

    // Loading states
    isLoading,

    // Mutation
    optionalMutation,

    // Handlers
    handleAddExpertise,
    handleRemoveExpertise,
    handleAddTool,
    handleRemoveTool,
    handleToggleHour,
    handleNext,
    handlePrevious,

    // Computed
    progress,
  };
};
