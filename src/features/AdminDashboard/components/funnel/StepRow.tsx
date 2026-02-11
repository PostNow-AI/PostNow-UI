/**
 * StepRow Component
 * Displays a single step row in the funnel
 * Single Responsibility: Only handles step row display
 */

import { cn } from "@/lib/utils";
import { getConversionColorClass, STEP_THRESHOLDS } from "../../utils";
import { STEP_NAMES_PT } from "../../types";

export interface StepRowProps {
  stepNum: number;
  stepCount: number;
  stepRate: number;
  displayRate: number;
  isFirstStep: boolean;
  phaseColor: string;
  onPhaseClick: () => void;
}

export const StepRow = ({
  stepNum,
  stepCount,
  stepRate,
  displayRate,
  isFirstStep,
  phaseColor,
  onPhaseClick,
}: StepRowProps) => {
  const rateColorClass = getConversionColorClass(stepRate, STEP_THRESHOLDS);

  return (
    <div
      className="relative flex items-center h-4 overflow-hidden cursor-pointer hover:opacity-80 active:scale-[0.995] transition-all"
      onClick={onPhaseClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPhaseClick()}
    >
      {/* Drop/loss portion (right side) */}
      <div className="absolute inset-0 bg-red-500/20" />

      {/* Conversion portion (left side) - width = % vs previous step */}
      <div
        className={cn("absolute inset-y-0 left-0 opacity-30", phaseColor)}
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
        {/* Percentage on the right */}
        {!isFirstStep ? (
          <span
            className={cn(
              "tabular-nums text-[11px] w-9 text-right font-semibold",
              rateColorClass
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
};

export default StepRow;
