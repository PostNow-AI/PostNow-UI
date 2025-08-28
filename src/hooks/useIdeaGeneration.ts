import { GENERATION_STEPS } from "@/constants/ideaGeneration";
import {
  ideaBankService,
  type IdeaGenerationFormData,
} from "@/lib/services/ideaBankService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useCostEstimate } from "./useAIOperations";
import { useUserCredits } from "./useCredits";

export interface GeneratedIdea {
  id: number;
  title: string;
  description: string;
  content: string;
  platform: string;
  content_type: string;
  status: string;
  variation_type?: string;
  headline?: string;
  copy?: string;
  cta?: string;
  hashtags?: string[];
  visual_description?: string;
  color_composition?: string;
}

export interface GenerationProgress {
  percentage: number;
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  elapsedTime: number;
}

export interface GenerationState {
  ideas: GeneratedIdea[];
  isGenerating: boolean;
  progress: GenerationProgress | null;
  status: "idle" | "generating" | "complete" | "error";
  error: string | null;
}

const INITIAL_STATE: GenerationState = {
  ideas: [],
  isGenerating: false,
  progress: null,
  status: "idle",
  error: null,
};

export const useIdeaGeneration = () => {
  const [generationState, setGenerationState] =
    useState<GenerationState>(INITIAL_STATE);
  const queryClient = useQueryClient();
  const estimateCost = useCostEstimate();
  const { data: userCredits, refetch: refetchCredits } = useUserCredits();

  // Get available options
  const { data: options } = useQuery({
    queryKey: ["idea-options"],
    queryFn: ideaBankService.getIdeaOptions,
  });

  // Generate ideas mutation with progress tracking
  const generateIdeasMutation = useMutation({
    mutationFn: async (data: IdeaGenerationFormData) => {
      setGenerationState((prev) => ({
        ...prev,
        status: "generating",
        error: null,
      }));

      // Simulate progress updates (since backend doesn't stream)
      const progressInterval = setInterval(() => {
        setGenerationState((prev) => {
          if (!prev.progress) {
            return {
              ...prev,
              progress: {
                percentage: 0,
                currentStep: 0,
                totalSteps: 8,
                currentStepName: GENERATION_STEPS[0],
                elapsedTime: 0,
              },
            };
          }

          const newStep = Math.min(
            prev.progress.currentStep + 1,
            prev.progress.totalSteps
          );
          const newPercentage = Math.round(
            (newStep / prev.progress.totalSteps) * 100
          );

          return {
            ...prev,
            progress: {
              ...prev.progress,
              percentage: newPercentage,
              currentStep: newStep,
              currentStepName:
                GENERATION_STEPS[newStep - 1] || "Processando...",
              elapsedTime: prev.progress.elapsedTime + 1,
            },
          };
        });
      }, 800);

      try {
        const response = await ideaBankService.generateIdeas(data);

        clearInterval(progressInterval);
        setGenerationState((prev) => ({
          ...prev,
          status: "complete",
          progress: prev.progress
            ? {
                ...prev.progress,
                percentage: 100,
                currentStep: prev.progress.totalSteps,
                currentStepName: "Concluído!",
              }
            : null,
        }));

        return response;
      } catch (error) {
        clearInterval(progressInterval);
        setGenerationState((prev) => ({
          ...prev,
          status: "error",
          error: error instanceof Error ? error.message : "Erro desconhecido",
        }));
        throw error;
      }
    },
    onSuccess: (data) => {
      setGenerationState((prev) => ({
        ...prev,
        ideas: data.ideas,
        isGenerating: false,
      }));
      toast.success("Campanha e ideia com 3 variações gerada com sucesso!");
      // Refresh credits after successful generation
      refetchCredits();
      // Refresh the campaigns-with-ideas query to show the new campaign
      queryClient.invalidateQueries({ queryKey: ["campaigns-with-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["campaign-stats"] });
    },
    onError: (error: unknown) => {
      setGenerationState((prev) => ({
        ...prev,
        isGenerating: false,
      }));
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao gerar ideias";
      toast.error(errorMessage);
    },
  });

  const handleGenerateIdeas = async (formData: IdeaGenerationFormData) => {
    try {
      // Estimate cost before generating
      const costEstimate = await estimateCost.mutateAsync({
        platforms: formData.platforms,
        content_complexity: "medium",
      });

      // Check if user has enough credits
      if (userCredits && userCredits.balance < costEstimate.estimated_cost) {
        toast.error(
          `Créditos insuficientes. Necessário: ${costEstimate.estimated_cost.toFixed(
            2
          )}, Disponível: ${userCredits.balance.toFixed(2)}`
        );
        return;
      }

      setGenerationState((prev) => ({ ...prev, isGenerating: true }));
      generateIdeasMutation.mutate(formData);
    } catch {
      toast.error("Erro ao estimar custo. Tente novamente.");
    }
  };

  const handleClose = () => {
    setGenerationState(INITIAL_STATE);
  };

  const handleBack = () => {
    setGenerationState((prev) => ({ ...prev, ideas: [] }));
  };

  return {
    generationState,
    options,
    handleGenerateIdeas,
    handleClose,
    handleBack,
    isGenerating: generationState.isGenerating,
  };
};
