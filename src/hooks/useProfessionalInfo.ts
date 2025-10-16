import { globalOptionsApi } from "@/lib/global-options-api";
import { handleApiError } from "@/lib/utils/errorHandling";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface ProfileFormData {
  professional_name?: string | null;
  profession?: string | null;
  specialization?: string | null;
  custom_profession?: string | null;
  custom_specialization?: string | null;
}

export const useProfessionalInfo = (form: UseFormReturn<ProfileFormData>) => {
  const { watch, setValue } = form;
  const watchedValues = watch();
  const queryClient = useQueryClient();
  const [customProfessionInput, setCustomProfessionInput] = useState("");

  // Buscar dados da API
  const { data: professions = [] } = useQuery({
    queryKey: ["professions"],
    queryFn: globalOptionsApi.getProfessions,
  });

  const {
    data: specializations,
    isLoading: isLoadingSpecializations,
    error: specializationsError,
  } = useQuery({
    queryKey: ["specializations", watchedValues.profession],
    queryFn: async () => {
      if (
        watchedValues.profession &&
        watchedValues.profession !== "Outro" &&
        professions.length > 0
      ) {
        const profession = professions.find(
          (p) => p.name === watchedValues.profession
        );

        if (profession) {
          try {
            const result = await globalOptionsApi.getProfessionSpecializations(
              profession.id
            );
            return result;
          } catch (error) {
            console.error("Erro na API de especializações:", error);
            throw error;
          }
        }
      }
      return { profession: null, specializations: [] };
    },
    enabled:
      !!watchedValues.profession &&
      watchedValues.profession !== "Outro" &&
      professions.length > 0,
  });

  // Mutations para criar opções customizadas
  const createProfessionMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomProfession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professions"] });
      toast.success("Profissão criada com sucesso!");
      setCustomProfessionInput("");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao criar profissão",
        defaultDescription:
          "Não foi possível criar a profissão. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const createSpecializationMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomSpecializationForProfession,
    onSuccess: () => {
      // Invalidar queries de especializações para garantir atualização
      queryClient.invalidateQueries({ queryKey: ["specializations"] });

      // Forçar refetch das especializações da profissão atual
      if (watchedValues.profession && watchedValues.profession !== "Outro") {
        const profession = professions.find(
          (p) => p.name === watchedValues.profession
        );
        if (profession) {
          queryClient.refetchQueries({
            queryKey: ["specializations", watchedValues.profession],
          });
        }
      }

      toast.success("Especialização criada com sucesso!");
      setValue("custom_specialization", "");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro ao criar especialização",
        defaultDescription:
          "Não foi possível criar a especialização. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const handleAddCustomProfession = async () => {
    if (!customProfessionInput.trim()) return;

    try {
      await createProfessionMutation.mutateAsync({
        name: customProfessionInput.trim(),
      });
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleAddCustomSpecialization = async () => {
    const customValue = watchedValues.custom_specialization;
    if (!customValue?.trim()) return;

    if (watchedValues.profession && watchedValues.profession !== "Outro") {
      const profession = professions.find(
        (p) => p.name === watchedValues.profession
      );
      if (profession) {
        try {
          await createSpecializationMutation.mutateAsync({
            name: customValue.trim(),
            profession: profession.id,
          });
        } catch {
          // Error is handled by the mutation
        }
      }
    }
  };

  // Obter todas as profissões disponíveis
  const allAvailableProfessions = [
    ...(professions.map((p) => p.name) || []),
    "Outro",
  ];

  // Obter especializações disponíveis para a profissão selecionada
  const availableSpecializations = specializations?.specializations || [];

  // Monitorar mudanças nas dependências da query
  useEffect(() => {
    // Monitoramento silencioso das dependências
  }, [watchedValues.profession, professions.length]);

  return {
    // State
    customProfessionInput,
    setCustomProfessionInput,

    // Data
    isLoadingSpecializations,
    specializationsError,
    allAvailableProfessions,
    availableSpecializations,

    // Mutations
    createProfessionMutation,
    createSpecializationMutation,

    // Handlers
    handleAddCustomProfession,
    handleAddCustomSpecialization,
  };
};
