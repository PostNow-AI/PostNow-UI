/**
 * FunnelSection Component
 * Displays conversion funnel metrics (subscriptions -> onboardings -> images)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AllMetricsData } from "../types";

export interface FunnelSectionProps {
  data: AllMetricsData;
}

interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

export const FunnelSection = ({ data }: FunnelSectionProps) => {
  const subscriptions = data.subscriptions?.count ?? 0;
  const onboardings = data.onboardings?.count ?? 0;
  const images = data.images?.count ?? 0;

  const steps: FunnelStep[] = [
    { label: "Assinaturas", value: subscriptions, color: "bg-green-500" },
    { label: "Onboardings Completos", value: onboardings, color: "bg-blue-500" },
    { label: "Imagens Geradas", value: images, color: "bg-purple-500" },
  ];

  const maxValue = Math.max(...steps.map((s) => s.value), 1);

  // Calculate conversion rates
  const onboardingRate = subscriptions > 0
    ? ((onboardings / subscriptions) * 100).toFixed(1)
    : "0";
  const imageRate = onboardings > 0
    ? ((images / onboardings) * 100).toFixed(1)
    : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Funnel visualization */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{step.label}</span>
                <span className="text-muted-foreground">
                  {step.value.toLocaleString("pt-BR")}
                </span>
              </div>
              <Progress
                value={(step.value / maxValue) * 100}
                className="h-3"
              />
              {index < steps.length - 1 && (
                <div className="text-xs text-muted-foreground text-right">
                  {index === 0 && `Taxa de conversão: ${onboardingRate}%`}
                  {index === 1 && `Taxa de geração: ${imageRate}%`}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{onboardingRate}%</p>
            <p className="text-xs text-muted-foreground">
              Assinatura → Onboarding
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{imageRate}%</p>
            <p className="text-xs text-muted-foreground">
              Onboarding → Geração
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
