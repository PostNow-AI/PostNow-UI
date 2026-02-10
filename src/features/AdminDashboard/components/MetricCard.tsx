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
  const formattedValue = value.toLocaleString("pt-BR");

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
      <CardContent className="p-3 sm:pt-6 sm:p-6">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-3 sm:h-4 bg-muted rounded w-16 sm:w-20 mb-2" />
            <div className="h-6 sm:h-8 bg-muted rounded w-12 sm:w-16" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-sm text-muted-foreground truncate">
                {title}
              </p>
              <p className={cn("text-xl sm:text-3xl font-bold tabular-nums", color)}>
                {formattedValue}
              </p>
              {trend !== undefined && (
                <p
                  className={cn(
                    "text-[10px] sm:text-xs font-medium",
                    trend >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
                </p>
              )}
            </div>
            <Icon className={cn("h-5 w-5 sm:h-8 sm:w-8 opacity-70 flex-shrink-0", color)} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
