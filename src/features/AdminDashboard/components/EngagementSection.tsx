/**
 * EngagementSection Component
 * Displays user engagement metrics (posts breakdown)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Edit } from "lucide-react";
import type { AllMetricsData } from "../types";

export interface EngagementSectionProps {
  data: AllMetricsData;
}

interface EngagementMetric {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

export const EngagementSection = ({ data }: EngagementSectionProps) => {
  const postsTotal = data["posts-total"]?.count ?? 0;
  const postsEmail = data["posts-email"]?.count ?? 0;
  const postsManual = data["posts-manual"]?.count ?? 0;

  const metrics: EngagementMetric[] = [
    {
      label: "Posts Totais",
      value: postsTotal,
      icon: FileText,
      color: "text-indigo-600",
      description: "Total de posts criados no período",
    },
    {
      label: "Posts Automáticos",
      value: postsEmail,
      icon: Mail,
      color: "text-pink-600",
      description: "Posts criados via email/automação",
    },
    {
      label: "Posts Manuais",
      value: postsManual,
      icon: Edit,
      color: "text-amber-600",
      description: "Posts criados manualmente pelos usuários",
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
      <CardHeader>
        <CardTitle>Engajamento de Conteúdo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="text-center p-4 rounded-lg bg-muted/50"
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
                <p className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Distribution bar */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Distribuição de Posts</p>
          <div className="flex h-4 rounded-full overflow-hidden bg-muted">
            <div
              className="bg-pink-500 transition-all"
              style={{ width: `${autoPercentage}%` }}
              title={`Automáticos: ${autoPercentage}%`}
            />
            <div
              className="bg-amber-500 transition-all"
              style={{ width: `${manualPercentage}%` }}
              title={`Manuais: ${manualPercentage}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-pink-500" />
              Automáticos ({autoPercentage}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Manuais ({manualPercentage}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
