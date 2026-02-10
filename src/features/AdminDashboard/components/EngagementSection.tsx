/**
 * EngagementSection Component
 * Displays user engagement metrics (posts breakdown)
 * Mobile-first responsive design with donut chart visualization
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Edit } from "lucide-react";
import type { AllMetricsData } from "../types";
import { cn } from "@/lib/utils";

export interface EngagementSectionProps {
  data: AllMetricsData;
}

export const EngagementSection = ({ data }: EngagementSectionProps) => {
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

  // SVG donut chart
  const size = 80;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
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
                <p className="text-lg font-bold tabular-nums">{postsTotal}</p>
                <p className="text-[9px] text-muted-foreground">posts</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-pink-600" />
                <span className="text-xs">Automáticos</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-pink-600 tabular-nums">{postsEmail}</span>
                <span className="text-xs text-muted-foreground ml-1">({autoPercentage}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-amber-600" />
                <span className="text-xs">Manuais</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-amber-600 tabular-nums">{postsManual}</span>
                <span className="text-xs text-muted-foreground ml-1">({manualPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution bar */}
        <div className="mt-4 h-2 rounded-full overflow-hidden bg-muted flex">
          <div
            className="bg-pink-500 transition-all"
            style={{ width: `${autoPercentage}%` }}
          />
          <div
            className="bg-amber-500 transition-all"
            style={{ width: `${manualPercentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
