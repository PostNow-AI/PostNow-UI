/**
 * EmailSection Component
 * Displays email performance metrics (sent vs opened)
 * Mobile-first responsive design
 * Supports both card mode (default) and fullscreen mode
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MailOpen, CheckCircle2, AlertCircle, MinusCircle, Mail } from "lucide-react";
import type { AllMetricsData } from "../types";
import { cn } from "@/lib/utils";

export interface EmailSectionProps {
  data: AllMetricsData;
  /** When true, renders without card wrapper for full-screen display */
  fullscreen?: boolean;
}

export const EmailSection = ({ data, fullscreen = false }: EmailSectionProps) => {
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

  const content = (
    <div className={cn("space-y-4", fullscreen && "max-w-sm mx-auto w-full")}>
      {/* Main rate display */}
      <div className={cn(
        "rounded-xl text-center",
        performance.bg,
        "dark:bg-opacity-20",
        fullscreen ? "p-6" : "p-4"
      )}>
        <div className={cn(
          "flex items-center justify-center gap-2",
          fullscreen ? "mb-3" : "mb-2"
        )}>
          <StatusIcon className={cn(performance.color, fullscreen ? "h-6 w-6" : "h-5 w-5")} />
          <span className={cn("font-semibold", performance.color, fullscreen ? "text-base" : "text-sm")}>
            {performance.label}
          </span>
        </div>
        <p className={cn("font-bold tabular-nums", performance.color, fullscreen ? "text-6xl" : "text-4xl")}>
          {openRate}%
        </p>
        <p className={cn("text-muted-foreground mt-1", fullscreen ? "text-sm" : "text-xs")}>
          Taxa de Abertura
        </p>
        <p className={cn("text-muted-foreground mt-1", fullscreen ? "text-xs" : "text-[10px]")}>
          Benchmark: 20-25%
        </p>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn(
          "flex items-center gap-2 rounded-lg bg-muted/50",
          fullscreen ? "p-4" : "p-2"
        )}>
          <Send className={cn("text-orange-600", fullscreen ? "h-5 w-5" : "h-4 w-4")} />
          <div>
            <p className={cn("font-bold text-orange-600 tabular-nums", fullscreen ? "text-lg" : "text-sm")}>
              {emailsSent.toLocaleString("pt-BR")}
            </p>
            <p className={cn("text-muted-foreground", fullscreen ? "text-xs" : "text-[10px]")}>Enviados</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-2 rounded-lg bg-muted/50",
          fullscreen ? "p-4" : "p-2"
        )}>
          <MailOpen className={cn("text-teal-600", fullscreen ? "h-5 w-5" : "h-4 w-4")} />
          <div>
            <p className={cn("font-bold text-teal-600 tabular-nums", fullscreen ? "text-lg" : "text-sm")}>
              {emailsOpened.toLocaleString("pt-BR")}
            </p>
            <p className={cn("text-muted-foreground", fullscreen ? "text-xs" : "text-[10px]")}>Abertos</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={cn("rounded-full bg-muted overflow-hidden", fullscreen ? "h-3" : "h-2")}>
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-teal-500 transition-all"
          style={{ width: `${Math.min(openRateNum, 100)}%` }}
        />
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="flex-1 flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <Mail className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-semibold">Performance de Email</h2>
        </div>
        {/* Content centered */}
        <div className="flex-1 flex flex-col justify-center">
          {content}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Performance de Email</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
