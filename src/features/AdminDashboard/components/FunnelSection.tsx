/**
 * FunnelSection Component
 * Displays the Onboarding 2.0 funnel with 20 steps grouped into 5 phases
 * All steps are always visible - click on phase header for details
 *
 * Refactored to follow SOLID and DRY principles:
 * - SRP: Uses PhaseHeader, StepRow, PercentageLabel sub-components
 * - DRY: Uses utility functions from utils/funnelUtils.ts
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dashboardApiService } from "@/lib/dashboard-api";
import { PhaseDetailsView } from "./PhaseDetailsView";
import { PhaseHeader, StepRow } from "./funnel";
import {
  buildStepCounts,
  calcConversionRate,
  calcTotalRate,
} from "../utils";
import type { PeriodDays, OnboardingFunnelResponse } from "../types";
import { FUNNEL_PHASES } from "../types";

export interface FunnelSectionProps {
  days: PeriodDays;
  fullscreen?: boolean;
}

interface FunnelContentProps {
  data: OnboardingFunnelResponse;
  onPhaseClick: (phaseId: number) => void;
}

/**
 * FunnelContent - Renders the funnel visualization
 * Extracted for better separation of concerns
 */
const FunnelContent = ({ data, onPhaseClick }: FunnelContentProps) => {
  const stepCounts = buildStepCounts(data);
  const totalStart = stepCounts[1] || 1;

  return (
    <div className="space-y-0.5">
      {FUNNEL_PHASES.map((phase, phaseIdx) => {
        // Calculate conversion from previous phase
        const firstStepCount = stepCounts[phase.steps[0]] || 0;
        const prevPhaseLastStep =
          phaseIdx > 0
            ? FUNNEL_PHASES[phaseIdx - 1].steps[
                FUNNEL_PHASES[phaseIdx - 1].steps.length - 1
              ]
            : null;
        const prevCount = prevPhaseLastStep
          ? stepCounts[prevPhaseLastStep]
          : firstStepCount;
        const phaseConversion = calcConversionRate(firstStepCount, prevCount);
        const headerTotalRate = calcTotalRate(firstStepCount, totalStart);

        return (
          <div key={phase.id}>
            {/* Phase header */}
            <PhaseHeader
              phase={phase}
              headerTotalRate={headerTotalRate}
              phaseConversion={phaseConversion}
              isFirstPhase={phaseIdx === 0}
              onPhaseClick={() => onPhaseClick(phase.id)}
            />

            {/* Steps within this phase */}
            <div className="space-y-px">
              {phase.steps.map((stepNum, stepIdx) => {
                const stepCount = stepCounts[stepNum] || 0;
                const prevStepCount =
                  stepIdx === 0
                    ? phaseIdx === 0
                      ? stepCount
                      : stepCounts[
                          FUNNEL_PHASES[phaseIdx - 1].steps[
                            FUNNEL_PHASES[phaseIdx - 1].steps.length - 1
                          ]
                        ] || 0
                    : stepCounts[phase.steps[stepIdx - 1]] || 0;
                const stepRate = calcConversionRate(stepCount, prevStepCount);
                const isFirstStep = phaseIdx === 0 && stepIdx === 0;
                const displayRate = isFirstStep ? 100 : stepRate;

                return (
                  <StepRow
                    key={stepNum}
                    stepNum={stepNum}
                    stepCount={stepCount}
                    stepRate={stepRate}
                    displayRate={displayRate}
                    isFirstStep={isFirstStep}
                    phaseColor={phase.color}
                    onPhaseClick={() => onPhaseClick(phase.id)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Total conversion rate */}
      <div className="flex items-center justify-center pt-0.5">
        <span className="font-semibold tabular-nums text-[9px] text-muted-foreground">
          Total: {calcConversionRate(stepCounts[20], stepCounts[1])}%
        </span>
      </div>
    </div>
  );
};

/**
 * FunnelSection - Main component with data fetching and state management
 */
export const FunnelSection = ({
  days,
  fullscreen = false,
}: FunnelSectionProps) => {
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

  const content = <FunnelContent data={data} onPhaseClick={handlePhaseClick} />;

  if (fullscreen) {
    return (
      <div className="flex-1 flex flex-col p-3">
        <div className="flex-1 max-w-md mx-auto w-full">{content}</div>
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
