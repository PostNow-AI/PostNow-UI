/**
 * PercentageLabel Component
 * Displays the large percentage label positioned near the color transition
 * Single Responsibility: Only handles percentage label display and positioning
 */

import { cn } from "@/lib/utils";
import { calcPercentageLabelPosition } from "../../utils";

export interface PercentageLabelProps {
  rate: number;
  colorClass: string;
}

export const PercentageLabel = ({ rate, colorClass }: PercentageLabelProps) => {
  const { position, value } = calcPercentageLabelPosition(rate);

  return (
    <span
      className={cn(
        "absolute text-sm font-bold tabular-nums drop-shadow-md",
        colorClass
      )}
      style={position === "right" ? { right: `${value}%` } : { left: `${value}%` }}
    >
      {rate}%
    </span>
  );
};

export default PercentageLabel;
