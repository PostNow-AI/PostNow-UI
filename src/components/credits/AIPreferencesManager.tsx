import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useAIPreferences,
  useModelRecommendations,
  useUpdateAIPreferences,
  type AIModelPreferences,
} from "@/hooks/useAIPreferences";
import { Brain, DollarSign, Loader2, Settings, Zap } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export const AIPreferencesManager: React.FC = () => {
  const { data: preferences, isLoading } = useAIPreferences();
  const updatePreferences = useUpdateAIPreferences();
  const getRecommendations = useModelRecommendations();

  const [formData, setFormData] = useState<Partial<AIModelPreferences>>({});
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Update form data when preferences load
  React.useEffect(() => {
    if (preferences && Object.keys(formData).length === 0) {
      setFormData(preferences);
    }
  }, [preferences, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePreferences.mutateAsync(formData);
      toast.success("Preferências atualizadas com sucesso!");
    } catch {
      toast.error("Erro ao atualizar preferências");
    }
  };

  const handleGetRecommendations = async () => {
    try {
      const result = await getRecommendations.mutateAsync({
        operation_type: "text_generation",
        estimated_tokens: 1000,
      });

      setShowRecommendations(true);
      toast.success(
        `${result.recommendations.length} recomendações encontradas`
      );
    } catch {
      toast.error("Erro ao obter recomendações");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando preferências...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferências de IA
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Provider Preference */}
            <div className="space-y-2">
              <Label
                htmlFor="preferred_provider"
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Provedor Preferido
              </Label>
              <Select
                value={formData.preferred_provider || "auto"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    preferred_provider: value as
                      | "auto"
                      | "google"
                      | "openai"
                      | "anthropic",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um provedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    Automático (Melhor custo-benefício)
                  </SelectItem>
                  <SelectItem value="google">Google (Gemini)</SelectItem>
                  <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget Preference */}
            <div className="space-y-2">
              <Label
                htmlFor="budget_preference"
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Preferência de Orçamento
              </Label>
              <Select
                value={formData.budget_preference || "balanced"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    budget_preference: value as
                      | "economy"
                      | "balanced"
                      | "performance"
                      | "custom",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma preferência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">
                    Economia (Sempre o mais barato)
                  </SelectItem>
                  <SelectItem value="balanced">
                    Balanceado (Custo-benefício)
                  </SelectItem>
                  <SelectItem value="performance">
                    Performance (Qualidade máxima)
                  </SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Cost Per Operation */}
            <div className="space-y-2">
              <Label htmlFor="max_cost" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Custo Máximo por Operação (créditos)
              </Label>
              <Input
                id="max_cost"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.max_cost_per_operation || 5.0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    max_cost_per_operation: parseFloat(e.target.value) || 5.0,
                  }))
                }
              />
            </div>

            {/* Auto Select Cheapest */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Selecionar Automaticamente o Mais Barato</Label>
                <p className="text-sm text-gray-600">
                  Sempre escolher o modelo mais econômico disponível
                </p>
              </div>
              <Switch
                checked={formData.auto_select_cheapest || false}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    auto_select_cheapest: checked,
                  }))
                }
              />
            </div>

            {/* Allow Fallback */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Fallback</Label>
                <p className="text-sm text-gray-600">
                  Usar modelos alternativos se o preferido não estiver
                  disponível
                </p>
              </div>
              <Switch
                checked={formData.allow_fallback || false}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, allow_fallback: checked }))
                }
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={updatePreferences.isPending}
                className="flex-1"
              >
                {updatePreferences.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Preferências"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleGetRecommendations}
                disabled={getRecommendations.isPending}
              >
                {getRecommendations.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Ver Recomendações"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recommendations Display */}
      {showRecommendations && getRecommendations.data && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Recomendações de Modelos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Optimal Model */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">
                  🏆 Modelo Recomendado
                </h3>
                <p className="text-green-700">
                  <strong>{getRecommendations.data.optimal_model}</strong>
                </p>
              </div>

              {/* All Recommendations */}
              <div className="space-y-3">
                <h3 className="font-semibold">Todas as Recomendações</h3>
                {getRecommendations.data.recommendations.map((rec) => (
                  <div
                    key={rec.model_name}
                    className={`p-3 rounded-lg border ${
                      rec.is_recommended
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {rec.model_name} ({rec.provider})
                        </h4>
                        <div className="text-sm text-gray-600 mt-1">
                          {rec.reasons.join(" • ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {rec.estimated_cost.toFixed(3)} créditos
                        </div>
                        <div className="text-xs text-gray-500">
                          Qualidade: {rec.quality_score}/10
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
