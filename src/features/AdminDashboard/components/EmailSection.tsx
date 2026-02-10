/**
 * EmailSection Component
 * Displays email performance metrics (sent vs opened)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MailOpen, TrendingUp } from "lucide-react";
import type { AllMetricsData } from "../types";

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
    if (rate >= 30) return { label: "Excelente", color: "text-green-600" };
    if (rate >= 20) return { label: "Bom", color: "text-blue-600" };
    if (rate >= 10) return { label: "Médio", color: "text-yellow-600" };
    return { label: "Baixo", color: "text-red-600" };
  };

  const performance = getPerformanceLevel(openRateNum);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance de Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Send className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {emailsSent.toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground">Emails Enviados</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/20">
              <MailOpen className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">
                {emailsOpened.toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground">Emails Abertos</p>
            </div>
          </div>
        </div>

        {/* Open rate indicator */}
        <div className="p-6 rounded-lg border bg-card text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className={`h-5 w-5 ${performance.color}`} />
            <span className={`text-sm font-medium ${performance.color}`}>
              {performance.label}
            </span>
          </div>
          <p className="text-4xl font-bold">{openRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Taxa de Abertura</p>
          <p className="text-xs text-muted-foreground mt-2">
            Benchmark do mercado: 20-25%
          </p>
        </div>

        {/* Visual progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span className="text-muted-foreground">
              {emailsOpened.toLocaleString("pt-BR")} de{" "}
              {emailsSent.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-teal-500 transition-all"
              style={{ width: `${Math.min(openRateNum, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
