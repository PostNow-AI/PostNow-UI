/**
 * EngagementSection Component
 * Displays user engagement metrics (posts breakdown)
 * Mobile-first responsive design
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Edit } from "lucide-react";
import type { AllMetricsData } from "../types";

export interface EngagementSectionProps {
  data: AllMetricsData;
}

interface EngagementMetric {
  label: string;
  shortLabel: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

export const EngagementSection = ({ data }: EngagementSectionProps) => {
  const postsTotal = data["posts-total"]?.count ?? 0;
  const postsEmail = data["posts-email"]?.count ?? 0;
  const postsManual = data["posts-manual"]?.count ?? 0;

  const metrics: EngagementMetric[] = [
    {
      label: "Posts Totais",
      shortLabel: "Total",
      value: postsTotal,
      icon: FileText,
      color: "text-indigo-600",
    },
    {
      label: "Automáticos",
      shortLabel: "Auto",
      value: postsEmail,
      icon: Mail,
      color: "text-pink-600",
    },
    {
      label: "Manuais",
      shortLabel: "Manual",
      value: postsManual,
      icon: Edit,
      color: "text-amber-600",
    },
  ];

  // Calculate percentages
  const autoPercentage = postsTotal > 0
    ? ((postsEmail / postsTotal) * 100).toFixed(1)
    : "0";
  const manualPercentage = postsTotal > 0
    ? ((postsManual / postsTotal) * 100).toFixed(1)
    : "0";

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-sm sm:text-base">Engajamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="text-center p-2 sm:p-4 rounded-lg bg-muted/50"
              >
                <Icon className={`h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 ${metric.color}`} />
                <p className={`text-base sm:text-2xl font-bold tabular-nums ${metric.color}`}>
                  {metric.value.toLocaleString("pt-BR")}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                  <span className="sm:hidden">{metric.shortLabel}</span>
                  <span className="hidden sm:inline">{metric.label}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Distribution bar */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-medium">Distribuição</p>
          <div className="flex h-3 sm:h-4 rounded-full overflow-hidden bg-muted">
            <div
              className="bg-pink-500 transition-all"
              style={{ width: `${autoPercentage}%` }}
            />
            <div
              className="bg-amber-500 transition-all"
              style={{ width: `${manualPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-pink-500" />
              Auto {autoPercentage}%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Manual {manualPercentage}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
