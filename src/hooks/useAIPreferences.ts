import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface AIModelPreferences {
  id: number;
  preferred_provider: "google" | "openai" | "anthropic" | "auto";
  budget_preference: "economy" | "balanced" | "performance" | "custom";
  max_cost_per_operation: number;
  preferred_models: Record<string, string>;
  auto_select_cheapest: boolean;
  allow_fallback: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModelRecommendation {
  model_name: string;
  provider: string;
  estimated_cost: number;
  quality_score: number;
  value_score: number;
  reasons: string[];
  is_recommended: boolean;
}

export interface ModelRecommendationRequest {
  operation_type?: string;
  estimated_tokens?: number;
}

export interface OptimalModelRequest {
  estimated_tokens: number;
  operation_type?: string;
  preferred_provider?: string;
}

export interface OptimalModelResponse {
  selected_model: string;
  model_config: {
    name: string;
    provider: string;
    cost_per_token: number;
    is_active: boolean;
  };
  estimated_cost: number;
  estimated_tokens: number;
  operation_type: string;
}

// API functions
const aiPreferencesApi = {
  getPreferences: async (): Promise<AIModelPreferences> => {
    const response = await api.get("/api/v1/credits/ai-preferences/");
    return response.data.data;
  },

  updatePreferences: async (
    preferences: Partial<AIModelPreferences>
  ): Promise<AIModelPreferences> => {
    const response = await api.put(
      "/api/v1/credits/ai-preferences/",
      preferences
    );
    return response.data.data;
  },

  getRecommendations: async (
    request: ModelRecommendationRequest
  ): Promise<{
    recommendations: ModelRecommendation[];
    optimal_model: string;
    operation_type: string;
    estimated_tokens: number;
  }> => {
    const response = await api.post("/api/v1/credits/ai-recommendations/", {
      operation_type: request.operation_type || "text_generation",
      estimated_tokens: request.estimated_tokens || 1000,
    });
    return response.data.data;
  },

  selectOptimalModel: async (
    request: OptimalModelRequest
  ): Promise<OptimalModelResponse> => {
    const response = await api.post(
      "/api/v1/credits/ai-select-optimal/",
      request
    );
    return response.data.data;
  },
};

// Hooks
export const useAIPreferences = () => {
  return useQuery({
    queryKey: ["ai-preferences"],
    queryFn: aiPreferencesApi.getPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateAIPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<AIModelPreferences>) =>
      aiPreferencesApi.updatePreferences(preferences),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["ai-preferences"] });
      queryClient.invalidateQueries({ queryKey: ["ai-recommendations"] });
    },
  });
};

export const useModelRecommendations = () => {
  return useMutation({
    mutationFn: (request: ModelRecommendationRequest) =>
      aiPreferencesApi.getRecommendations(request),
  });
};

export const useOptimalModelSelection = () => {
  return useMutation({
    mutationFn: (request: OptimalModelRequest) =>
      aiPreferencesApi.selectOptimalModel(request),
  });
};

// Convenience hooks for common scenarios
export const useSmartModelSelection = () => {
  const getOptimalModel = useOptimalModelSelection();
  const { data: preferences } = useAIPreferences();

  const selectForOperation = async (
    operationType: string = "text_generation",
    estimatedTokens: number = 1000,
    overrideProvider?: string
  ) => {
    return getOptimalModel.mutateAsync({
      operation_type: operationType,
      estimated_tokens: estimatedTokens,
      preferred_provider: overrideProvider || preferences?.preferred_provider,
    });
  };

  return {
    selectForOperation,
    isSelecting: getOptimalModel.isPending,
    error: getOptimalModel.error,
  };
};

export const useBudgetAwareSelection = () => {
  const { data: preferences } = useAIPreferences();
  const getRecommendations = useModelRecommendations();

  const getAffordableModels = async (
    operationType: string = "text_generation",
    estimatedTokens: number = 1000
  ) => {
    const result = await getRecommendations.mutateAsync({
      operation_type: operationType,
      estimated_tokens: estimatedTokens,
    });

    // Filter by budget preference
    const maxCost = preferences?.max_cost_per_operation || 5.0;
    const budgetPref = preferences?.budget_preference || "balanced";

    const filteredRecommendations = result.recommendations.filter(
      (rec) => rec.estimated_cost <= maxCost
    );

    // Sort by budget preference
    if (budgetPref === "economy") {
      filteredRecommendations.sort(
        (a, b) => a.estimated_cost - b.estimated_cost
      );
    } else if (budgetPref === "performance") {
      filteredRecommendations.sort((a, b) => b.quality_score - a.quality_score);
    } else {
      // balanced - sort by value score
      filteredRecommendations.sort((a, b) => b.value_score - a.value_score);
    }

    return {
      ...result,
      recommendations: filteredRecommendations,
      budget_info: {
        max_cost: maxCost,
        preference: budgetPref,
        affordable_count: filteredRecommendations.length,
      },
    };
  };

  return {
    getAffordableModels,
    isLoading: getRecommendations.isPending,
    error: getRecommendations.error,
  };
};
