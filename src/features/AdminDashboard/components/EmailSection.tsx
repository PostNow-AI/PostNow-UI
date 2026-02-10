/**
 * EmailSection Component
 * Displays email performance metrics (sent vs opened)
 * Mobile-first responsive design
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MailOpen, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import type { AllMetricsData } from "../types";
import { cn } from "@/lib/utils";

export interface EmailSectionProps {
  data: AllMetricsData;
}

export const EmailSection = ({ data }: EmailSectionProps) => {
  const emailsSent = data["emails-sent"]?.count ?? 0;
  const emailsOpened = data["emails-opened"]?.count ?? 0;

  // Calculate open rate
  const openRate = emailsSent > 0
    ? ((emailsOpened / emailsSent) * 100).toFixed(1)
    : "0";
  const openRateNum = parseFloat(openRate);

  // Determine performance level
  const getPerformanceLevel = (rate: number) => {
    if (rate >= 30) return { label: "Excelente", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 };
    if (rate >= 20) return { label: "Bom", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 };
    if (rate >= 10) return { label: "Médio", color: "text-yellow-600", bg: "bg-yellow-50", icon: MinusCircle };
    return { label: "Baixo", color: "text-red-600", bg: "bg-red-50", icon: AlertCircle };
  };

  const performance = getPerformanceLevel(openRateNum);
  const StatusIcon = performance.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Performance de Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main rate display */}
        <div className={cn("rounded-xl p-4 text-center", performance.bg, "dark:bg-opacity-20")}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <StatusIcon className={cn("h-5 w-5", performance.color)} />
            <span className={cn("text-sm font-semibold", performance.color)}>
              {performance.label}
            </span>
          </div>
          <p className={cn("text-4xl font-bold tabular-nums", performance.color)}>
            {openRate}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Taxa de Abertura
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Benchmark: 20-25%
          </p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Send className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm font-bold text-orange-600 tabular-nums">
                {emailsSent.toLocaleString("pt-BR")}
              </p>
              <p className="text-[10px] text-muted-foreground">Enviados</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <MailOpen className="h-4 w-4 text-teal-600" />
            <div>
              <p className="text-sm font-bold text-teal-600 tabular-nums">
                {emailsOpened.toLocaleString("pt-BR")}
              </p>
              <p className="text-[10px] text-muted-foreground">Abertos</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-teal-500 transition-all"
            style={{ width: `${Math.min(openRateNum, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
