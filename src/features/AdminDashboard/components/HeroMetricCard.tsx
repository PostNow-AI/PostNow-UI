/**
 * HeroMetricCard Component
 * Large prominent card for the primary KPI with sparkline trend
 * Mobile-first design following dashboard best practices
 */

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TimelinePoint } from "../types";
import { cn } from "@/lib/utils";

export interface HeroMetricCardProps {
  /** Display title */
  title: string;
  /** Main value */
  value: number;
  /** Timeline data for sparkline */
  timeline: TimelinePoint[];
  /** Icon to display */
  icon: LucideIcon;
  /** Color class */
  color: string;
  /** Period label */
  periodLabel: string;
}

/** Simple sparkline SVG component */
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const height = 32;
  const width = 120;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
      {/* Dot on last point */}
      {data.length > 0 && (
        <circle
          cx={width - padding}
          cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
};

export const HeroMetricCard = ({
  title,
  value,
  timeline,
  icon: Icon,
  color,
  periodLabel,
}: HeroMetricCardProps) => {
  // Calculate trend from timeline
  const timelineValues = timeline.map((t) => t.count);
  const currentValue = timelineValues[timelineValues.length - 1] ?? 0;
  const previousValue = timelineValues[Math.floor(timelineValues.length / 2)] ?? currentValue;

  const trendPercent = previousValue > 0
    ? ((currentValue - previousValue) / previousValue) * 100
    : 0;

  const TrendIcon = trendPercent > 0 ? TrendingUp : trendPercent < 0 ? TrendingDown : Minus;
  const trendColor = trendPercent > 0 ? "text-green-600" : trendPercent < 0 ? "text-red-600" : "text-muted-foreground";

  // Color mapping for sparkline
  const colorMap: Record<string, string> = {
    "text-green-600": "#16a34a",
    "text-blue-600": "#2563eb",
    "text-purple-600": "#9333ea",
    "text-orange-600": "#ea580c",
    "text-teal-600": "#0d9488",
    "text-indigo-600": "#4f46e5",
    "text-pink-600": "#db2777",
    "text-amber-600": "#d97706",
  };

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Icon + Info */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={cn("p-2 sm:p-3 rounded-xl bg-background/80 shadow-sm", color.replace("text-", "bg-").replace("600", "100"))}>
              <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", color)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className={cn("text-3xl sm:text-4xl font-bold tabular-nums tracking-tight", color)}>
                {value.toLocaleString("pt-BR")}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
                <span className={cn("text-xs font-medium", trendColor)}>
                  {trendPercent >= 0 ? "+" : ""}{trendPercent.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs {periodLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Sparkline */}
          <div className="hidden sm:block">
            <Sparkline data={timelineValues} color={colorMap[color] || "#6366f1"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
