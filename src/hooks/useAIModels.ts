import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AIModel, CostEstimate, IdeaGenerationConfig } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useAIModels = () => {
  const {
    data: models,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ai-models"],
    queryFn: async (): Promise<AIModel[]> => {
      const response = await api.get(
        `${API_BASE_URL}/api/v1/ideabank/ai-models/`
      );
      return response.data;
    },
  });

  return { models, isLoading, error };
};

export const useCostEstimate = () => {
  const mutation = useMutation({
    mutationFn: async (config: IdeaGenerationConfig): Promise<CostEstimate> => {
      const response = await api.post(
        `${API_BASE_URL}/api/v1/ideabank/estimate-cost/`,
        { config } // Envolver em um objeto config para corresponder ao backend
      );
      return response.data;
    },
  });

  return mutation;
};

export const useIdeaGeneration = () => {
  const mutation = useMutation({
    mutationFn: async (config: IdeaGenerationConfig) => {
      const response = await api.post(
        `${API_BASE_URL}/api/v1/ideabank/generate-ideas/`,
        config
      );
      return response.data;
    },
  });

  return mutation;
};
