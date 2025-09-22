import {
  CostEstimateDisplay,
  CreditBalanceDisplay,
  CreditGuard,
} from "@/components/credits/CreditGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIOperation, useCostEstimate } from "@/hooks/useAIOperations";
import { useUserCredits } from "@/hooks/useCredits";
import {
  ideaBankService,
  type IdeaGenerationFormData,
} from "@/lib/services/ideaBankService";
import { handleCampaignGenerationError } from "@/lib/utils/aiErrorHandling";
import { Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface AIGenerationExampleProps {
  platforms: string[];
  formData: IdeaGenerationFormData;
}

export const AIGenerationExample: React.FC<AIGenerationExampleProps> = ({
  platforms,
  formData,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const { data: userCredits } = useUserCredits();
  const estimateCost = useCostEstimate();
  const { executeWithCredits } = useAIOperation();

  // Step 1: Estimate cost before showing generation button
  const handleEstimateCost = async () => {
    try {
      const result = await estimateCost.mutateAsync({
        platforms,
        content_complexity: "medium",
        ai_model: "gemini-1.5-flash", // Default to most cost-effective model
      });

      setEstimatedCost(result.estimated_cost);
      toast.success(
        `Custo estimado: ${result.estimated_cost.toFixed(2)} créditos`
      );
    } catch {
      toast.error("Erro ao estimar custo");
    }
  };

  // Step 2: Execute AI operation with credit validation and deduction
  const handleGenerate = async () => {
    if (!estimatedCost) {
      toast.error("Primeiro estime o custo da operação");
      return;
    }

    setIsGenerating(true);

    try {
      // Use the credit-aware operation wrapper
      const result = await executeWithCredits(
        // The actual AI operation
        () => ideaBankService.generateIdeas(formData),
        // Credit information
        {
          ai_model: "gemini-1.5-flash",
          estimated_tokens: Math.round(estimatedCost * 1000), // Convert credits back to tokens
          description: `Geração de ideias para ${platforms.join(", ")}`,
          operation_type: "idea_generation",
        }
      );

      toast.success("Ideias geradas com sucesso!");
    } catch (error) {
      const errorResult = handleCampaignGenerationError(error);

      // Special handling for credit insufficient errors to show upgrade option
      if (
        errorResult.errorType === "api_error" &&
        errorResult.description.includes("insuficient")
      ) {
        toast.error(errorResult.title, {
          description: errorResult.description,
          action: {
            label: "Comprar Créditos",
            onClick: () => (window.location.href = "/credits"),
          },
        });
      } else {
        toast.error(errorResult.title, {
          description: errorResult.description,
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Geração de Ideias com IA</span>
          <CreditBalanceDisplay />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Step 1: Cost Estimation */}
        <div>
          <Button
            onClick={handleEstimateCost}
            disabled={estimateCost.isPending}
            variant="outline"
            className="w-full"
          >
            {estimateCost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Estimando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Estimar Custo
              </>
            )}
          </Button>

          <p className="text-sm text-gray-600 mt-2">
            Plataformas: {platforms.join(", ")}
          </p>
        </div>

        {/* Step 2: Cost Display */}
        {estimatedCost !== null && userCredits && (
          <CostEstimateDisplay
            estimatedCost={estimatedCost}
            userBalance={userCredits.balance}
          />
        )}

        {/* Step 3: Generation with Credit Guard */}
        {estimatedCost !== null && (
          <CreditGuard
            requiredCredits={estimatedCost}
            onInsufficientCredits={() => {
              toast.info("Redirecionando para compra de créditos...");
              setTimeout(() => {
                window.location.href = "/credits";
              }, 1000);
            }}
          >
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando ideias...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Ideias ({estimatedCost.toFixed(2)} créditos)
                </>
              )}
            </Button>
          </CreditGuard>
        )}

        {/* Help text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Primeiro estime o custo da operação</p>
          <p>• Verifique se você tem créditos suficientes</p>
          <p>• Os créditos são debitados apenas após sucesso</p>
          <p>• Use o modelo mais econômico quando possível</p>
        </div>
      </CardContent>
    </Card>
  );
};
