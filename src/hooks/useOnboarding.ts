import { api } from "@/lib/api";
import { globalOptionsApi } from "@/lib/global-options-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface OnboardingFormData {
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

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface OnboardingFormProps {
  onComplete: () => void;
}

export const useOnboarding = (
  form: UseFormReturn<OnboardingFormData>,
  { onComplete }: OnboardingFormProps
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { watch, setValue } = form;
  const queryClient = useQueryClient();

  const watchedValues = watch();
  const selectedProfession = watchedValues.profession;
  const selectedSpecialization = watchedValues.specialization;
  const customProfessionInput = watchedValues.custom_profession;

  // Fetch data from API
  const { data: professions = [] } = useQuery({
    queryKey: ["professions"],
    queryFn: globalOptionsApi.getProfessions,
  });

  const { data: specializations, isLoading: isLoadingSpecializations } =
    useQuery({
      queryKey: ["specializations", selectedProfession],
      queryFn: async () => {
        if (selectedProfession && selectedProfession !== "Outro") {
          const profession = professions.find(
            (p) => p.name === selectedProfession
          );
          if (profession) {
            const result = await globalOptionsApi.getProfessionSpecializations(
              profession.id
            );
            return result;
          }
        }
        return { profession: null, specializations: [] };
      },
      enabled: !!selectedProfession && selectedProfession !== "Outro",
    });

  // Check if should show custom specialization field
  const shouldShowCustomSpecializationField =
    selectedProfession === "Outro" &&
    customProfessionInput &&
    customProfessionInput.trim() &&
    !professions.some((p) => p.name === customProfessionInput.trim());

  // Get all available professions
  const allAvailableProfessions = [...professions.map((p) => p.name)];

  // Get available specializations for selected profession
  const availableSpecializations = specializations?.specializations || [];

  // Mutations for creating custom options
  const createProfessionMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomProfession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professions"] });
      toast.success("Profissão criada com sucesso!");
      setValue("custom_profession", "");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Erro ao criar profissão");
    },
  });

  const createSpecializationMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomSpecialization,
    onSuccess: () => {
      // Invalidate queries for specializations and professions to ensure update
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      queryClient.invalidateQueries({ queryKey: ["professions"] });

      // Force refetch of specializations
      if (selectedProfession && selectedProfession !== "Outro") {
        const profession = professions.find(
          (p) => p.name === selectedProfession
        );
        if (profession) {
          queryClient.refetchQueries({
            queryKey: ["specializations", selectedProfession],
          });
        }
      }

      toast.success("Especialização criada com sucesso!");
      setValue("custom_specialization", "");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Erro ao criar especialização"
      );
    },
  });

  // Handlers for creating custom options
  const handleAddCustomProfession = () => {
    const customValue = watchedValues.custom_profession;
    if (customValue && customValue.trim()) {
      createProfessionMutation.mutate({ name: customValue.trim() });
    }
  };

  const handleAddCustomSpecialization = () => {
    const customValue = watchedValues.custom_specialization;
    if (customValue && customValue.trim()) {
      // If it's a custom profession, need to create profession first
      if (selectedProfession === "Outro" && customProfessionInput) {
        // Create profession and then specialization
        createProfessionMutation.mutate(
          { name: customProfessionInput.trim() },
          {
            onSuccess: (newProfession) => {
              // Now create the specialization
              createSpecializationMutation.mutate({
                name: customValue.trim(),
                profession: newProfession.id,
              });
            },
          }
        );
      } else {
        // Profession already exists, create only specialization
        const profession = professions.find(
          (p) => p.name === selectedProfession
        );
        if (profession) {
          // Use the new API to create specialization for any profession
          globalOptionsApi
            .createCustomSpecializationForProfession({
              name: customValue.trim(),
              profession: profession.id,
            })
            .then(() => {
              // Invalidate queries to update the list
              queryClient.invalidateQueries({ queryKey: ["specializations"] });
              queryClient.invalidateQueries({ queryKey: ["professions"] });

              // Force refetch of specializations
              if (selectedProfession && selectedProfession !== "Outro") {
                queryClient.refetchQueries({
                  queryKey: ["specializations", selectedProfession],
                });
              }

              toast.success("Especialização criada com sucesso!");
              setValue("custom_specialization", "");
            })
            .catch((error) => {
              toast.error(
                error.response?.data?.message || "Erro ao criar especialização"
              );
            });
        }
      }
    }
  };

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      // Step 1: Personal Info
      const step1Data = {
        professional_name: data.professional_name,
        profession:
          data.profession === "Outro"
            ? data.custom_profession
            : data.profession,
        instagram_handle: data.instagram_username, // Backend expects instagram_handle
        whatsapp_number: data.whatsapp_number,
      };

      // Step 2: Business Info
      const step2Data = {
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

      // Step 3: Branding Info
      const step3Data = {
        voice_tone: data.voice_tone_personality, // Backend expects voice_tone
        logo: data.logo_image_url, // Backend expects logo
        color_1: data.color_1,
        color_2: data.color_2,
        color_3: data.color_3,
        color_4: data.color_4,
        color_5: data.color_5,
      };

      // Submit all steps sequentially
      await api.put("/api/v1/creator-profile/onboarding/step1/", step1Data);
      await api.put("/api/v1/creator-profile/onboarding/step2/", step2Data);
      const step3Response = await api.put(
        "/api/v1/creator-profile/onboarding/step3/",
        step3Data
      );

      window.location.reload();

      return step3Response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Perfil configurado com sucesso!");
      onComplete();
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
    // State
    isSubmitting,

    // Data
    watchedValues,
    selectedProfession,
    selectedSpecialization,
    customProfessionInput,
    professions,
    specializations,
    shouldShowCustomSpecializationField,
    allAvailableProfessions,
    availableSpecializations,

    // Mutations
    createProfessionMutation,
    createSpecializationMutation,
    onboardingMutation,
    isLoadingSpecializations,
    // Handlers
    handleAddCustomProfession,
    handleAddCustomSpecialization,
    handleFormSubmit,
  };
};
