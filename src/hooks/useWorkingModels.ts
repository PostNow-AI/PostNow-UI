import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface WorkingModel {
  provider: string;
  model: string;
  display_name: string;
  provider_name: string;
  description: string;
  estimated_cost_per_1k_tokens: number;
  status: string;
  can_afford: boolean;
  recommended?: boolean;
}

export interface WorkingModelsResponse {
  available_models: WorkingModel[];
  total_available: number;
  recommended_models: WorkingModel[];
  message: string;
}

export const useWorkingModels = () => {
  return useQuery({
    queryKey: ["working-models"],
    queryFn: async (): Promise<WorkingModelsResponse> => {
      const response = await api.get("/api/v1/ideabank/working-models/");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
