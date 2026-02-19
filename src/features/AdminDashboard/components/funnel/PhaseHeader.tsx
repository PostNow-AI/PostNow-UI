/**
 * PhaseHeader Component
 * Displays the phase header row in the funnel
 * Single Responsibility: Only handles phase header display
 */

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getConversionColorClass, PHASE_THRESHOLDS } from "../../utils";
import { PercentageLabel } from "./PercentageLabel";
import type { FunnelPhase } from "../../types";

export interface PhaseHeaderProps {
  phase: FunnelPhase;
  headerTotalRate: number;
  phaseConversion: number;
  isFirstPhase: boolean;
  onPhaseClick: () => void;
}

export const PhaseHeader = ({
  phase,
  headerTotalRate,
  phaseConversion,
  isFirstPhase,
  onPhaseClick,
}: PhaseHeaderProps) => {
  const conversionColorClass = getConversionColorClass(phaseConversion, PHASE_THRESHOLDS);

  return (
    <div
      className="relative rounded-t-sm h-5 overflow-hidden cursor-pointer hover:opacity-90 active:scale-[0.995] transition-all"
      onClick={onPhaseClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onPhaseClick()}
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

        {/* Large percentage - positioned at color transition */}
        <PercentageLabel
          rate={headerTotalRate}
          colorClass={phase.lightTextColor}
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Conversion percentage on the right */}
        {!isFirstPhase && (
          <span
            className={cn(
              "text-[11px] font-semibold drop-shadow-md",
              conversionColorClass
            )}
          >
            {phaseConversion}%
          </span>
        )}
      </div>
    </div>
  );
};

export default PhaseHeader;
