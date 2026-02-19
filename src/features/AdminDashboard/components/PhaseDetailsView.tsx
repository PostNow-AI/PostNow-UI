/**
 * PhaseDetailsView Component
 * Shows detailed view of a specific phase with all its steps
 * This is a full-screen view that replaces the funnel view
 */

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Users, TrendingDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboardApiService } from "@/lib/dashboard-api";
import type { PeriodDays, OnboardingFunnelResponse } from "../types";
import { FUNNEL_PHASES, STEP_NAMES_PT } from "../types";

export interface PhaseDetailsViewProps {
  phaseId: number;
  days: PeriodDays;
  onBack: () => void;
}

export const PhaseDetailsView = ({
  phaseId,
  days,
  onBack,
}: PhaseDetailsViewProps) => {
  const phase = FUNNEL_PHASES.find((p) => p.id === phaseId);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "onboarding-funnel", days],
    queryFn: () => dashboardApiService.getOnboardingFunnel(days),
    staleTime: 5 * 60 * 1000,
  });

  if (!phase) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Fase não encontrada
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Erro ao carregar dados
      </div>
    );
  }

  // Build step counts
  const stepCounts: Record<number, number> = {};
  for (let i = 1; i <= 20; i++) {
    const key = `step_${i}` as keyof OnboardingFunnelResponse;
    stepCounts[i] = (data[key] as number) || 0;
  }

  // Calculate phase statistics
  const firstStepCount = stepCounts[phase.steps[0]] || 0;
  const lastStepCount = stepCounts[phase.steps[phase.steps.length - 1]] || 0;
  const phaseDropOff = firstStepCount - lastStepCount;
  const phaseRetention = firstStepCount > 0
    ? Math.round((lastStepCount / firstStepCount) * 100)
    : 0;

  // Calculate rate between two values
  const calcRate = (current: number, previous: number) =>
    previous > 0 ? Math.round((current / previous) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col p-3">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div className={cn("w-3 h-3 rounded-sm", phase.color)} />
          <h2 className="text-sm font-semibold">{phase.name}</h2>
        </div>
      </div>

      {/* Phase Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-muted/30 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Users className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-wide">Entraram</span>
          </div>
          <div className="text-lg font-bold">
            {firstStepCount.toLocaleString("pt-BR")}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <TrendingDown className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-wide">Desistiram</span>
          </div>
          <div className="text-lg font-bold text-red-500">
            {phaseDropOff.toLocaleString("pt-BR")}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Clock className="h-3 w-3" />
            <span className="text-[9px] uppercase tracking-wide">Retenção</span>
          </div>
          <div className={cn(
            "text-lg font-bold",
            phaseRetention >= 80 ? "text-green-500" :
            phaseRetention >= 60 ? "text-yellow-500" : "text-red-500"
          )}>
            {phaseRetention}%
          </div>
        </div>
      </div>

      {/* Steps Detail List */}
      <div className="flex-1 space-y-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
          Sub-etapas desta fase
        </div>

        {phase.steps.map((stepNum, stepIdx) => {
          const stepCount = stepCounts[stepNum] || 0;
          const prevStepCount = stepIdx === 0
            ? firstStepCount
            : stepCounts[phase.steps[stepIdx - 1]] || 0;
          const stepRate = calcRate(stepCount, prevStepCount);
          const dropOff = prevStepCount - stepCount;

          // For first step, show 100%
          const isFirstStep = stepIdx === 0;
          const displayRate = isFirstStep ? 100 : stepRate;

          return (
            <div
              key={stepNum}
              className="relative rounded-lg overflow-hidden"
            >
              {/* Background layers */}
              <div className="absolute inset-0 bg-red-500/15" />
              <div
                className={cn("absolute inset-y-0 left-0 opacity-25", phase.color)}
                style={{ width: `${displayRate}%` }}
              />

              {/* Content */}
              <div className="relative p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {STEP_NAMES_PT[stepNum]}
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {stepCount.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Etapa {stepNum}</span>
                  <div className="flex items-center gap-3">
                    {!isFirstStep && (
                      <>
                        <span className="text-red-400">
                          -{dropOff.toLocaleString("pt-BR")} desistiram
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            stepRate >= 95
                              ? "text-green-500"
                              : stepRate >= 80
                                ? "text-yellow-500"
                                : "text-red-500"
                          )}
                        >
                          {stepRate}% conversão
                        </span>
                      </>
                    )}
                    {isFirstStep && (
                      <span className="text-muted-foreground">
                        Início da fase
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase conversion summary */}
      <div className="mt-3 pt-2 border-t border-border/50 text-center">
        <span className="text-xs text-muted-foreground">
          Taxa de conversão da fase:{" "}
          <span className={cn(
            "font-semibold",
            phaseRetention >= 80 ? "text-green-500" :
            phaseRetention >= 60 ? "text-yellow-500" : "text-red-500"
          )}>
            {phaseRetention}%
          </span>
          {" "}({firstStepCount} → {lastStepCount})
        </span>
      </div>
    </div>
  );
};

export default PhaseDetailsView;
