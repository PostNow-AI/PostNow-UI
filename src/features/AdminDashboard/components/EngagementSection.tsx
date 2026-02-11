/**
 * EngagementSection Component
 * Displays user engagement metrics (posts breakdown)
 * Mobile-first responsive design with donut chart visualization
 * Supports both card mode (default) and fullscreen mode
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mail, Edit } from "lucide-react";
import type { AllMetricsData } from "../types";
import { cn } from "@/lib/utils";

export interface EngagementSectionProps {
  data: AllMetricsData;
  /** When true, renders without card wrapper for full-screen display */
  fullscreen?: boolean;
}

export const EngagementSection = ({ data, fullscreen = false }: EngagementSectionProps) => {
  const postsTotal = data["posts-total"]?.count ?? 0;
  const postsEmail = data["posts-email"]?.count ?? 0;
  const postsManual = data["posts-manual"]?.count ?? 0;

  // Calculate percentages
  const autoPercentage = postsTotal > 0
    ? ((postsEmail / postsTotal) * 100).toFixed(1)
    : "0";
  const manualPercentage = postsTotal > 0
    ? ((postsManual / postsTotal) * 100).toFixed(1)
    : "0";

  const autoPercent = parseFloat(autoPercentage);
  const manualPercent = parseFloat(manualPercentage);

  // SVG donut chart - larger in fullscreen
  const size = fullscreen ? 140 : 80;
  const strokeWidth = fullscreen ? 16 : 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const content = (
    <>
      <div className={cn(
        "flex items-center",
        fullscreen ? "flex-col gap-6" : "gap-4"
      )}>
        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="rotate-[-90deg]">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted"
            />
            {/* Auto segment (pink) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#db2777"
              strokeWidth={strokeWidth}
              strokeDasharray={`${(autoPercent / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Manual segment (amber) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#d97706"
              strokeWidth={strokeWidth}
              strokeDasharray={`${(manualPercent / 100) * circumference} ${circumference}`}
              strokeDashoffset={-((autoPercent / 100) * circumference)}
              strokeLinecap="round"
            />
          </svg>
          {/* Center value */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className={cn("font-bold tabular-nums", fullscreen ? "text-3xl" : "text-lg")}>{postsTotal}</p>
              <p className={cn("text-muted-foreground", fullscreen ? "text-sm" : "text-[9px]")}>posts</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={cn("space-y-3", fullscreen ? "w-full max-w-xs" : "flex-1 space-y-2")}>
          <div className={cn(
            "flex items-center justify-between",
            fullscreen && "p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20"
          )}>
            <div className="flex items-center gap-2">
              <Mail className={cn("text-pink-600", fullscreen ? "h-5 w-5" : "h-4 w-4")} />
              <span className={cn(fullscreen ? "text-sm font-medium" : "text-xs")}>Automáticos</span>
            </div>
            <div className="text-right">
              <span className={cn("font-bold text-pink-600 tabular-nums", fullscreen ? "text-lg" : "text-sm")}>{postsEmail}</span>
              <span className={cn("text-muted-foreground ml-1", fullscreen ? "text-sm" : "text-xs")}>({autoPercentage}%)</span>
            </div>
          </div>
          <div className={cn(
            "flex items-center justify-between",
            fullscreen && "p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20"
          )}>
            <div className="flex items-center gap-2">
              <Edit className={cn("text-amber-600", fullscreen ? "h-5 w-5" : "h-4 w-4")} />
              <span className={cn(fullscreen ? "text-sm font-medium" : "text-xs")}>Manuais</span>
            </div>
            <div className="text-right">
              <span className={cn("font-bold text-amber-600 tabular-nums", fullscreen ? "text-lg" : "text-sm")}>{postsManual}</span>
              <span className={cn("text-muted-foreground ml-1", fullscreen ? "text-sm" : "text-xs")}>({manualPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution bar */}
      <div className={cn(
        "rounded-full overflow-hidden bg-muted flex",
        fullscreen ? "mt-8 h-3 max-w-xs mx-auto w-full" : "mt-4 h-2"
      )}>
        <div
          className="bg-pink-500 transition-all"
          style={{ width: `${autoPercentage}%` }}
        />
        <div
          className="bg-amber-500 transition-all"
          style={{ width: `${manualPercentage}%` }}
        />
      </div>
    </>
  );

  if (fullscreen) {
    return (
      <div className="flex-1 flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
            <MessageSquare className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-lg font-semibold">Engajamento</h2>
        </div>
        {/* Content centered */}
        <div className="flex-1 flex flex-col justify-center items-center">
          {content}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
