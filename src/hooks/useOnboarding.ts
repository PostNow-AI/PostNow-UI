import { api } from "@/lib/api";
import { globalOptionsApi } from "@/lib/global-options-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface OnboardingFormData {
  professional_name?: string;
  profession?: string;
  custom_profession?: string;
  specialization?: string;
  custom_specialization?: string;
  linkedin_url?: string;
  instagram_username?: string;
  youtube_channel?: string;
  tiktok_username?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color_1?: string;
  accent_color_2?: string;
  accent_color_3?: string;
  primary_font?: string;
  custom_primary_font?: string;
  secondary_font?: string;
  custom_secondary_font?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface OnboardingFormProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const useOnboarding = (
  form: UseFormReturn<OnboardingFormData>,
  { onComplete, onSkip }: OnboardingFormProps
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { watch, setValue } = form;
  const queryClient = useQueryClient();

  const watchedValues = watch();
  const selectedProfession = watchedValues.profession;
  const selectedSpecialization = watchedValues.specialization;
  const customProfessionInput = watchedValues.custom_profession;

  // Buscar dados da API
  const { data: professions = [] } = useQuery({
    queryKey: ["professions"],
    queryFn: globalOptionsApi.getProfessions,
  });

  const { data: fonts = { predefined: [], custom: [] } } = useQuery({
    queryKey: ["fonts"],
    queryFn: globalOptionsApi.getFonts,
  });

  const { data: specializations } = useQuery({
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

  const allAvailableFonts = [
    ...fonts.predefined.map((f: { name: string }) => f.name),
    ...fonts.custom.map((f: { name: string }) => f.name),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  // Verificar se deve mostrar campo de especialização customizada
  const shouldShowCustomSpecializationField =
    selectedProfession === "Outro" &&
    customProfessionInput &&
    customProfessionInput.trim() &&
    !professions.some((p) => p.name === customProfessionInput.trim());

  // Obter todas as profissões disponíveis
  const allAvailableProfessions = [...professions.map((p) => p.name), "Outro"];

  // Obter especializações disponíveis para a profissão selecionada
  const availableSpecializations = specializations?.specializations || [];

  // Mutations para criar opções customizadas
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
      // Invalidar queries de especializações e profissões para garantir atualização
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      queryClient.invalidateQueries({ queryKey: ["professions"] });

      // Forçar refetch das especializações
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

  // Handlers para criar opções customizadas
  const handleAddCustomProfession = () => {
    const customValue = watchedValues.custom_profession;
    if (customValue && customValue.trim()) {
      createProfessionMutation.mutate({ name: customValue.trim() });
    }
  };

  const handleAddCustomSpecialization = () => {
    const customValue = watchedValues.custom_specialization;
    if (customValue && customValue.trim()) {
      // Se é uma profissão customizada, precisamos criar a profissão primeiro
      if (selectedProfession === "Outro" && customProfessionInput) {
        // Criar profissão e depois especialização
        createProfessionMutation.mutate(
          { name: customProfessionInput.trim() },
          {
            onSuccess: (newProfession) => {
              // Agora criar a especialização
              createSpecializationMutation.mutate({
                name: customValue.trim(),
                profession: newProfession.id,
              });
            },
          }
        );
      } else {
        // Profissão já existe, criar apenas a especialização
        const profession = professions.find(
          (p) => p.name === selectedProfession
        );
        if (profession) {
          // Usar a nova API para criar especialização para qualquer profissão
          globalOptionsApi
            .createCustomSpecializationForProfession({
              name: customValue.trim(),
              profession: profession.id,
            })
            .then(() => {
              // Invalidar queries para atualizar a lista
              queryClient.invalidateQueries({ queryKey: ["specializations"] });
              queryClient.invalidateQueries({ queryKey: ["professions"] });

              // Forçar refetch das especializações
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
      // Preparar dados para envio
      const submitData = {
        ...data,
        profession:
          data.profession === "Outro"
            ? data.custom_profession
            : data.profession,
        specialization:
          data.specialization === "Outro"
            ? data.custom_specialization
            : data.specialization,
        primary_font:
          data.primary_font === "Outro"
            ? data.custom_primary_font
            : data.primary_font,
        secondary_font:
          data.secondary_font === "Outro"
            ? data.custom_secondary_font
            : data.secondary_font,
      };

      const response = await api.post(
        "/api/v1/creator-profile/onboarding/",
        submitData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast.success("Dados salvos com sucesso!");
      onComplete?.();
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao salvar dados");
      } else {
        toast.error("Erro ao salvar dados");
      }
    },
  });

  const skipMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        "/api/v1/creator-profile/onboarding/skip/"
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast.success("Onboarding pulado com sucesso!");
      onSkip?.();
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Erro ao pular onboarding"
        );
      } else {
        toast.error("Erro ao pular onboarding");
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

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await skipMutation.mutateAsync();
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyData = Object.values(watchedValues).some(
    (value) => value && value.toString().trim()
  );

  return {
    // State
    isSubmitting,

    // Data
    watchedValues,
    selectedProfession,
    selectedSpecialization,
    customProfessionInput,
    professions,
    fonts,
    specializations,
    allAvailableFonts,
    shouldShowCustomSpecializationField,
    allAvailableProfessions,
    availableSpecializations,

    // Mutations
    createProfessionMutation,
    createSpecializationMutation,
    onboardingMutation,
    skipMutation,

    // Handlers
    handleAddCustomProfession,
    handleAddCustomSpecialization,
    handleFormSubmit,
    handleSkip,

    // Computed
    hasAnyData,
  };
};
