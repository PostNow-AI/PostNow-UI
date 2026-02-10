/**
 * FunnelSection Component
 * Displays conversion funnel metrics (subscriptions -> onboardings -> images)
 * Mobile-first responsive design
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AllMetricsData } from "../types";

export interface FunnelSectionProps {
  data: AllMetricsData;
}

interface FunnelStep {
  label: string;
  shortLabel: string;
  value: number;
  color: string;
}

export const FunnelSection = ({ data }: FunnelSectionProps) => {
  const subscriptions = data.subscriptions?.count ?? 0;
  const onboardings = data.onboardings?.count ?? 0;
  const images = data.images?.count ?? 0;

  const steps: FunnelStep[] = [
    { label: "Assinaturas", shortLabel: "Assinar", value: subscriptions, color: "bg-green-500" },
    { label: "Onboardings", shortLabel: "Onboard", value: onboardings, color: "bg-blue-500" },
    { label: "Imagens", shortLabel: "Imagens", value: images, color: "bg-purple-500" },
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
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-sm sm:text-base">Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Funnel visualization */}
        <div className="space-y-3 sm:space-y-4">
          {steps.map((step, index) => (
            <div key={step.label} className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium">
                  <span className="sm:hidden">{step.shortLabel}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {step.value.toLocaleString("pt-BR")}
                </span>
              </div>
              <Progress
                value={(step.value / maxValue) * 100}
                className="h-2 sm:h-3"
              />
              {index < steps.length - 1 && (
                <div className="text-[10px] sm:text-xs text-muted-foreground text-right">
                  {index === 0 && `→ ${onboardingRate}%`}
                  {index === 1 && `→ ${imageRate}%`}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t">
          <div className="text-center p-2 sm:p-0">
            <p className="text-lg sm:text-2xl font-bold text-green-600">{onboardingRate}%</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Assinar → Onboard
            </p>
          </div>
          <div className="text-center p-2 sm:p-0">
            <p className="text-lg sm:text-2xl font-bold text-purple-600">{imageRate}%</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Onboard → Imagem
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
