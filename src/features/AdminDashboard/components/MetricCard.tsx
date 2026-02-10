/**
 * MetricCard Component
 * Displays a single KPI metric with optional trend indicator
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
        "cursor-pointer hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-primary shadow-md",
        onClick && "hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-20 mb-2" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className={cn("text-3xl font-bold", color)}>{formattedValue}</p>
              {trend !== undefined && (
                <p
                  className={cn(
                    "text-xs font-medium",
                    trend >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}% vs
                  período anterior
                </p>
              )}
            </div>
            <Icon className={cn("h-8 w-8 opacity-80", color)} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
