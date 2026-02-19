/**
 * MetricCard Component
 * Displays a single KPI metric with optional trend indicator
 * Mobile-first responsive design
 */

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  /** Display title for the metric */
  title: string;
  /** Numeric value to display */
  value: number;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Tailwind color class (e.g., "text-green-600") */
  color: string;
  /** Optional percentage change compared to previous period */
  trend?: number;
  /** Click handler for selecting this metric */
  onClick?: () => void;
  /** Whether this card is currently selected */
  isSelected?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
  isSelected = false,
  isLoading = false,
}: MetricCardProps) => {
  // Formatar valor de forma compacta para números grandes
  const formatValue = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(".0", "") + "k";
    }
    return num.toLocaleString("pt-BR");
  };

  return (
    <Card
      className={cn(
        "cursor-pointer active:scale-95 transition-all duration-150",
        "hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-md bg-primary/5",
        onClick && "hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-2 lg:p-4">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center gap-1">
            <div className="h-4 w-4 bg-muted rounded-full" />
            <div className="h-4 bg-muted rounded w-8" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-0.5 lg:gap-1">
            <Icon className={cn("h-4 w-4 lg:h-6 lg:w-6", color)} />
            <p className={cn("text-base lg:text-2xl font-bold tabular-nums leading-tight", color)}>
              {formatValue(value)}
            </p>
            <p className="text-[9px] lg:text-xs text-muted-foreground leading-tight truncate w-full">
              {title}
            </p>
            {trend !== undefined && (
              <p
                className={cn(
                  "text-[8px] lg:text-xs font-medium",
                  trend >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
