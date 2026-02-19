/**
 * GeneralView Component
 * Grid of metric cards with sparklines for the dashboard overview
 *
 * Features:
 * - 2x3 responsive grid of metric cards
 * - Each card shows value, trend, and sparkline
 * - Clickable cards to drill-down into detailed view
 * - Full screen layout without scroll
 */

import { Card } from "@/components/ui/card";
import { Users, UserPlus, Image, Mail, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AllMetricsData, TimelinePoint } from "../types";
import { cn } from "@/lib/utils";

/** Simple sparkline SVG component */
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const height = 24;
  const width = 80;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="overflow-visible flex-shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
    </svg>
  );
};

export type GeneralMetricType = "subscriptions" | "onboardings" | "images" | "emails-sent" | "posts-total";

interface MetricCardConfig {
  type: GeneralMetricType;
  label: string;
  icon: LucideIcon;
  color: string;
  hexColor: string;
}

const metricConfigs: MetricCardConfig[] = [
  { type: "subscriptions", label: "Assinaturas", icon: Users, color: "text-green-600", hexColor: "#16a34a" },
  { type: "onboardings", label: "Onboardings", icon: UserPlus, color: "text-blue-600", hexColor: "#2563eb" },
  { type: "images", label: "Imagens", icon: Image, color: "text-purple-600", hexColor: "#9333ea" },
  { type: "emails-sent", label: "Emails", icon: Mail, color: "text-orange-600", hexColor: "#ea580c" },
  { type: "posts-total", label: "Posts", icon: FileText, color: "text-teal-600", hexColor: "#0d9488" },
];

export interface GeneralViewProps {
  data: AllMetricsData;
  onMetricClick: (metric: GeneralMetricType) => void;
}

interface MetricCardProps {
  config: MetricCardConfig;
  value: number;
  timeline: TimelinePoint[];
  onClick: () => void;
}

const MetricCard = ({ config, value, timeline, onClick }: MetricCardProps) => {
  const Icon = config.icon;
  const timelineValues = timeline.map((t) => t.count);

  // Calculate trend from timeline (current vs midpoint)
  const currentValue = timelineValues[timelineValues.length - 1] ?? 0;
  const previousValue = timelineValues[Math.floor(timelineValues.length / 2)] ?? currentValue;
  const trendPercent = previousValue > 0
    ? ((currentValue - previousValue) / previousValue) * 100
    : 0;

  const TrendIcon = trendPercent > 0 ? TrendingUp : trendPercent < 0 ? TrendingDown : Minus;
  const trendColor = trendPercent > 0 ? "text-green-600" : trendPercent < 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <Card
      className={cn(
        "p-3 cursor-pointer",
        "transition-all duration-200",
        "hover:shadow-md hover:border-primary/30",
        "active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Left: Icon + Label */}
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn(
            "p-1.5 rounded-lg flex-shrink-0",
            config.color.replace("text-", "bg-").replace("600", "100")
          )}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {config.label}
          </span>
        </div>
      </div>

      {/* Value + Trend */}
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className={cn("text-2xl font-bold tabular-nums leading-none", config.color)}>
            {value.toLocaleString("pt-BR")}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <TrendIcon className={cn("h-3 w-3", trendColor)} />
            <span className={cn("text-xs font-medium", trendColor)}>
              {trendPercent >= 0 ? "+" : ""}{trendPercent.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <Sparkline data={timelineValues} color={config.hexColor} />
      </div>
    </Card>
  );
};

export const GeneralView = ({ data, onMetricClick }: GeneralViewProps) => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="grid grid-cols-2 gap-3 content-center flex-1">
        {metricConfigs.map((config) => {
          const metricData = data[config.type];
          return (
            <MetricCard
              key={config.type}
              config={config}
              value={metricData?.count ?? 0}
              timeline={metricData?.timeline ?? []}
              onClick={() => onMetricClick(config.type)}
            />
          );
        })}
      </div>
    </div>
  );
};
