import { useMutation } from "@tanstack/react-query";
import {
  useDeductCredits,
  useUserCredits,
} from "../features/Credits/hooks/useCredits";
import { creditsApiService } from "../lib/credits-api";
import { useSmartModelSelection } from "./useAIPreferences";

export interface AIOperationRequest {
  ai_model?: string;
  estimated_tokens: number;
  description: string;
  operation_type: "idea_generation" | "content_improvement" | "custom";
}

export interface CostEstimateRequest {
  platforms: string[];
  content_complexity?: "simple" | "medium" | "complex";
  ai_model?: string;
}

export const useCostEstimate = () => {
  return useMutation({
    mutationFn: async (data: CostEstimateRequest) => {
      // Estimate tokens based on platforms and complexity
      const baseTokensPerPlatform = 1000;
      const complexityMultiplier = {
        simple: 1,
        medium: 1.5,
        complex: 2,
      };

      const multiplier =
        complexityMultiplier[data.content_complexity || "medium"];
      const estimatedTokens =
        data.platforms.length * baseTokensPerPlatform * multiplier;

      // Use the most cost-effective model if not specified
      const aiModel = data.ai_model || "gemini-1.5-flash";

      // Get cost estimation from backend
      return creditsApiService.calculateUsageCost({
        ai_model: aiModel,
        estimated_tokens: estimatedTokens,
        description: `Cost estimate for ${data.platforms.join(", ")} platforms`,
      });
    },
  });
};

export const useSmartCostEstimate = () => {
  const { selectForOperation } = useSmartModelSelection();

  return useMutation({
    mutationFn: async (
      data: CostEstimateRequest & { operation_type?: string }
    ) => {
      // Estimate tokens based on platforms and complexity
      const baseTokensPerPlatform = 1000;
      const complexityMultiplier = {
        simple: 1,
        medium: 1.5,
        complex: 2,
      };

      const multiplier =
        complexityMultiplier[data.content_complexity || "medium"];
      const estimatedTokens =
        data.platforms.length * baseTokensPerPlatform * multiplier;

      try {
        // Use smart model selection based on user preferences
        const optimalModel = await selectForOperation(
          data.operation_type || "text_generation",
          estimatedTokens,
          data.ai_model // Override provider if specified
        );

        // Return the cost estimate with the selected model
        return {
          estimated_cost: optimalModel.estimated_cost,
          estimated_tokens: estimatedTokens,
          selected_model: optimalModel.selected_model,
          model_config: optimalModel.model_config,
          platforms: data.platforms,
          complexity: data.content_complexity || "medium",
        };
      } catch (error) {
        // Fallback to basic estimation if smart selection fails
        const fallbackModel = data.ai_model || "gemini-1.5-flash";
        const fallbackCost = await creditsApiService.calculateUsageCost({
          ai_model: fallbackModel,
          estimated_tokens: estimatedTokens,
          description: `Fallback cost estimate for ${data.platforms.join(
            ", "
          )} platforms`,
        });

        return {
          estimated_cost: fallbackCost.estimated_cost,
          estimated_tokens: estimatedTokens,
          selected_model: fallbackModel,
          model_config: null,
          platforms: data.platforms,
          complexity: data.content_complexity || "medium",
          is_fallback: true,
          fallback_reason:
            error instanceof Error ? error.message : "Smart selection failed",
        };
      }
    },
  });
};

export const useAIOperation = () => {
  const { data: userCredits, refetch: refetchCredits } = useUserCredits();
  const deductCredits = useDeductCredits();

  const executeWithCredits = async <T>(
    operation: () => Promise<T>,
    costInfo: AIOperationRequest
  ): Promise<T> => {
    // Check credits before operation
    if (
      userCredits &&
      userCredits.balance < costInfo.estimated_tokens * 0.001
    ) {
      throw new Error(
        `Créditos insuficientes. Necessário: ${(
          costInfo.estimated_tokens * 0.001
        ).toFixed(2)}, Disponível: ${userCredits.balance.toFixed(2)}`
      );
    }

    // Execute the AI operation
    const result = await operation();

    // Deduct credits after successful operation
    await deductCredits.mutateAsync({
      ai_model: costInfo.ai_model || "gemini-1.5-flash",
      estimated_tokens: costInfo.estimated_tokens,
      description: costInfo.description,
    });

    // Refresh credits
    await refetchCredits();

    return result;
  };

  return {
    executeWithCredits,
    isDeducting: deductCredits.isPending,
  };
};

export const usePreOperationCheck = () => {
  const { data: userCredits } = useUserCredits();
  const estimateCost = useCostEstimate();

  const checkCreditsAndEstimate = async (request: CostEstimateRequest) => {
    try {
      const costEstimate = await estimateCost.mutateAsync(request);

      const hasEnoughCredits = userCredits
        ? userCredits.balance >= costEstimate.estimated_cost
        : false;

      return {
        estimatedCost: costEstimate.estimated_cost,
        hasEnoughCredits,
        currentBalance: userCredits?.balance || 0,
        shortfall: hasEnoughCredits
          ? 0
          : costEstimate.estimated_cost - (userCredits?.balance || 0),
      };
    } catch {
      throw new Error("Erro ao estimar custo da operação");
    }
  };

  return {
    checkCreditsAndEstimate,
    isLoading: estimateCost.isPending,
  };
};
