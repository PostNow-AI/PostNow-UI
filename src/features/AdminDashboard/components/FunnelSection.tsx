/**
 * FunnelSection Component
 * Displays the Onboarding 2.0 funnel with 20 steps grouped into 5 phases
 * All steps are always visible - click on phase header for details
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dashboardApiService } from "@/lib/dashboard-api";
import { PhaseDetailsView } from "./PhaseDetailsView";
import type { PeriodDays, OnboardingFunnelResponse } from "../types";
import { FUNNEL_PHASES, STEP_NAMES_PT } from "../types";

export interface FunnelSectionProps {
  days: PeriodDays;
  fullscreen?: boolean;
}

interface FunnelContentProps {
  data: OnboardingFunnelResponse;
  fullscreen?: boolean;
  onPhaseClick: (phaseId: number) => void;
}

const FunnelContent = ({
  data,
  onPhaseClick,
}: FunnelContentProps) => {
  // Build step counts object
  const stepCounts: Record<number, number> = {};
  for (let i = 1; i <= 20; i++) {
    const key = `step_${i}` as keyof OnboardingFunnelResponse;
    stepCounts[i] = (data[key] as number) || 0;
  }

  // Total from step 1 (for calculating % of total)
  const totalStart = stepCounts[1] || 1;

  // Calculate conversion rate between two values
  const calcRate = (current: number, previous: number) =>
    previous > 0 ? Math.round((current / previous) * 100) : 0;

  // Calculate % of total (from step 1)
  const calcTotalRate = (current: number) =>
    totalStart > 0 ? Math.round((current / totalStart) * 100) : 0;

  return (
    <div className="space-y-0.5">
      {FUNNEL_PHASES.map((phase, phaseIdx) => {
        // Calculate conversion from previous phase
        const firstStepCount = stepCounts[phase.steps[0]] || 0;
        const prevPhaseLastStep = phaseIdx > 0
          ? FUNNEL_PHASES[phaseIdx - 1].steps[FUNNEL_PHASES[phaseIdx - 1].steps.length - 1]
          : null;
        const prevCount = prevPhaseLastStep ? stepCounts[prevPhaseLastStep] : firstStepCount;
        const phaseConversion = calcRate(firstStepCount, prevCount);

        // Bar width = % of total (from step 1)
        const headerTotalRate = calcTotalRate(firstStepCount);

        return (
          <div key={phase.id}>
            {/* Phase header - CLICKABLE BUTTON with gradient */}
            <div
              className="relative rounded-t-sm h-5 overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.995] transition-all"
              onClick={() => onPhaseClick(phase.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onPhaseClick(phase.id)}
            >
              {/* Drop/loss portion (right side) */}
              <div className="absolute inset-0 bg-red-500/40" />

              {/* Conversion portion (left side) - width = % of TOTAL */}
              <div
                className={cn("absolute inset-y-0 left-0", phase.color)}
                style={{ width: `${headerTotalRate}%` }}
              />

              {/* Content */}
              <div className="relative flex items-center h-full px-2">
                {/* Phase name on the left */}
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-semibold text-white drop-shadow-sm uppercase tracking-wide">
                    {phase.name}
                  </span>
                  <ChevronRight className="h-3 w-3 text-white/70" />
                </div>

                {/* Large percentage - in majority color, near transition with equal visual padding */}
                {(() => {
                  const PADDING = 3; // Visual padding from transition (in %)
                  // Light color for each phase for good contrast
                  const phaseColors: Record<number, string> = {
                    1: "text-blue-200",
                    2: "text-purple-200",
                    3: "text-indigo-200",
                    4: "text-pink-200",
                    5: "text-green-200",
                  };
                  const textColorClass = phaseColors[phase.id] || "text-white";

                  if (headerTotalRate >= 50) {
                    // Inside colored area - position by RIGHT edge of text
                    const rightPosition = 100 - headerTotalRate + PADDING;
                    const finalRight = Math.max(15, Math.min(rightPosition, 68));
                    return (
                      <span
                        className={cn("absolute text-sm font-bold tabular-nums drop-shadow-md", textColorClass)}
                        style={{ right: `${finalRight}%` }}
                      >
                        {headerTotalRate}%
                      </span>
                    );
                  } else {
                    // Inside red area - position by LEFT edge of text
                    const leftPosition = headerTotalRate + PADDING;
                    const finalLeft = Math.max(32, Math.min(leftPosition, 80));
                    return (
                      <span
                        className={cn("absolute text-sm font-bold tabular-nums drop-shadow-md", textColorClass)}
                        style={{ left: `${finalLeft}%` }}
                      >
                        {headerTotalRate}%
                      </span>
                    );
                  }
                })()}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Conversion percentage on the right */}
                {phaseIdx > 0 && (
                  <span className={cn(
                    "text-[11px] font-semibold drop-shadow-md",
                    phaseConversion >= 90 ? "text-green-300" :
                    phaseConversion >= 70 ? "text-yellow-300" : "text-red-300"
                  )}>
                    {phaseConversion}%
                  </span>
                )}
              </div>
            </div>

            {/* All steps within this phase - CLICKABLE, opens phase details */}
            <div className="space-y-px">
              {phase.steps.map((stepNum, stepIdx) => {
                const stepCount = stepCounts[stepNum] || 0;
                const prevStepCount = stepIdx === 0
                  ? (phaseIdx === 0 ? stepCount : stepCounts[FUNNEL_PHASES[phaseIdx - 1].steps[FUNNEL_PHASES[phaseIdx - 1].steps.length - 1]] || 0)
                  : stepCounts[phase.steps[stepIdx - 1]] || 0;
                const stepRate = calcRate(stepCount, prevStepCount);

                // For first step of first phase, show full bar (100%)
                const isFirstStep = phaseIdx === 0 && stepIdx === 0;
                const displayRate = isFirstStep ? 100 : stepRate;

                return (
                  <div
                    key={stepNum}
                    className="relative flex items-center h-4 overflow-hidden cursor-pointer hover:opacity-80 active:scale-[0.995] transition-all"
                    onClick={() => onPhaseClick(phase.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onPhaseClick(phase.id)}
                  >
                    {/* Drop/loss portion (right side) */}
                    <div className="absolute inset-0 bg-red-500/20" />

                    {/* Conversion portion (left side) - width = % vs previous step */}
                    <div
                      className={cn("absolute inset-y-0 left-0 opacity-30", phase.color)}
                      style={{ width: `${displayRate}%` }}
                    />

                    {/* Content */}
                    <div className="relative flex items-center w-full px-2 text-[10px]">
                      {/* Count on the left */}
                      <span className="font-semibold tabular-nums text-[11px] text-left w-10">
                        {stepCount.toLocaleString("pt-BR")}
                      </span>
                      {/* Step name in the middle */}
                      <span className="text-muted-foreground truncate flex-1 ml-1">
                        {STEP_NAMES_PT[stepNum]}
                      </span>
                      {/* Percentage on the right - same style as headers */}
                      {!isFirstStep ? (
                        <span
                          className={cn(
                            "tabular-nums text-[11px] w-9 text-right font-semibold",
                            stepRate >= 95
                              ? "text-green-300"
                              : stepRate >= 80
                                ? "text-yellow-300"
                                : "text-red-300"
                          )}
                        >
                          {stepRate}%
                        </span>
                      ) : (
                        <span className="w-9" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Total conversion rate */}
      <div className="flex items-center justify-center pt-0.5">
        <span className="font-semibold tabular-nums text-[9px] text-muted-foreground">
          Total: {calcRate(stepCounts[20], stepCounts[1])}%
        </span>
      </div>
    </div>
  );
};

export const FunnelSection = ({ days, fullscreen = false }: FunnelSectionProps) => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "onboarding-funnel", days],
    queryFn: () => dashboardApiService.getOnboardingFunnel(days),
    staleTime: 5 * 60 * 1000,
  });

  const handlePhaseClick = (phaseId: number) => {
    setSelectedPhase(phaseId);
  };

  const handleBack = () => {
    setSelectedPhase(null);
  };

  // If a phase is selected, show the detail view
  if (selectedPhase !== null && fullscreen) {
    return (
      <PhaseDetailsView
        phaseId={selectedPhase}
        days={days}
        onBack={handleBack}
      />
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          fullscreen ? "flex-1" : "py-12"
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground",
          fullscreen ? "flex-1" : "py-12"
        )}
      >
        Erro ao carregar dados do funil
      </div>
    );
  }

  const content = (
    <FunnelContent
      data={data}
      onPhaseClick={handlePhaseClick}
    />
  );

  if (fullscreen) {
    return (
      <div className="flex-1 flex flex-col p-3">
        <div className="flex-1 max-w-md mx-auto w-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Funil do Onboarding</span>
          <span className="text-xs font-normal text-muted-foreground">
            {data.started.toLocaleString("pt-BR")} sessões
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{content}</CardContent>
    </Card>
  );
};

export default FunnelSection;
