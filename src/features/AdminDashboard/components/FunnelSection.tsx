/**
 * FunnelSection Component
 * Displays conversion funnel metrics (subscriptions -> onboardings -> images)
 * Mobile-first responsive design with visual funnel
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";
import type { AllMetricsData } from "../types";
import { cn } from "@/lib/utils";

export interface FunnelSectionProps {
  data: AllMetricsData;
}

export const FunnelSection = ({ data }: FunnelSectionProps) => {
  const subscriptions = data.subscriptions?.count ?? 0;
  const onboardings = data.onboardings?.count ?? 0;
  const images = data.images?.count ?? 0;

  // Calculate conversion rates
  const onboardingRate = subscriptions > 0
    ? ((onboardings / subscriptions) * 100).toFixed(0)
    : "0";
  const imageRate = onboardings > 0
    ? ((images / onboardings) * 100).toFixed(0)
    : "0";

  const steps = [
    { label: "Assinaturas", value: subscriptions, color: "bg-green-500", textColor: "text-green-600", width: "w-full" },
    { label: "Onboardings", value: onboardings, color: "bg-blue-500", textColor: "text-blue-600", width: "w-[85%]" },
    { label: "Imagens", value: images, color: "bg-purple-500", textColor: "text-purple-600", width: "w-[70%]" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {steps.map((step, index) => (
          <div key={step.label}>
            {/* Funnel bar */}
            <div className={cn("mx-auto transition-all", step.width)}>
              <div className={cn("rounded-lg p-3 flex items-center justify-between", step.color, "bg-opacity-15")}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", step.color)} />
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                <span className={cn("text-lg font-bold tabular-nums", step.textColor)}>
                  {step.value.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            {/* Arrow with conversion rate */}
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center gap-1.5 py-1 text-muted-foreground">
                <ArrowDown className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {index === 0 ? onboardingRate : imageRate}%
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Summary */}
        <div className="pt-3 mt-2 border-t flex justify-between text-center">
          <div>
            <p className="text-lg font-bold text-green-600">{onboardingRate}%</p>
            <p className="text-[10px] text-muted-foreground">Conversão 1</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600">{imageRate}%</p>
            <p className="text-[10px] text-muted-foreground">Conversão 2</p>
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-600">
              {subscriptions > 0 ? ((images / subscriptions) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
