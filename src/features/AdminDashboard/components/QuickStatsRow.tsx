/**
 * QuickStatsRow Component
 * Horizontal scrollable row of secondary metrics
 * Mobile-first with touch-friendly cards
 */

import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickStat {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export interface QuickStatsRowProps {
  stats: QuickStat[];
}

export const QuickStatsRow = ({ stats }: QuickStatsRowProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:gap-3 scrollbar-hide">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            onClick={stat.onClick}
            className={cn(
              "flex-shrink-0 w-[120px] sm:w-auto cursor-pointer transition-all",
              "hover:shadow-md active:scale-95",
              stat.isSelected && "ring-2 ring-primary bg-primary/5"
            )}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
                <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
              </div>
              <p className={cn("text-xl sm:text-2xl font-bold tabular-nums mt-1", stat.color)}>
                {stat.value.toLocaleString("pt-BR")}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
