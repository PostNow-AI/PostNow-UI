import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { CostEstimate, IdeaGenerationConfig } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
