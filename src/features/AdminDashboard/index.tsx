/**
 * AdminDashboard Feature
 * Main dashboard page for admin analytics visualization
 * Mobile-first responsive design
 */

import { useState } from "react";
import {
  Users,
  UserPlus,
  Image,
  Send,
  MailOpen,
  FileText,
  Mail,
  Edit,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAllDashboardMetrics } from "./hooks/useDashboardMetrics";
import {
  MetricCard,
  MetricChart,
  PeriodSelector,
  DashboardSkeleton,
  DashboardError,
  FunnelSection,
  EngagementSection,
  EmailSection,
} from "./components";
import type { PeriodDays, MetricType, MetricConfig } from "./types";

/** Icon mapping for metric types */
const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  UserPlus,
  Image,
  Send,
  MailOpen,
  FileText,
  Mail,
  Edit,
};

/** Configuration for all dashboard metrics */
const METRICS_CONFIG: MetricConfig[] = [
  { type: "subscriptions", label: "Assinaturas", color: "text-green-600", iconName: "Users" },
  { type: "onboardings", label: "Onboardings", color: "text-blue-600", iconName: "UserPlus" },
  { type: "images", label: "Imagens", color: "text-purple-600", iconName: "Image" },
  { type: "emails-sent", label: "Enviados", color: "text-orange-600", iconName: "Send" },
  { type: "emails-opened", label: "Abertos", color: "text-teal-600", iconName: "MailOpen" },
  { type: "posts-total", label: "Posts", color: "text-indigo-600", iconName: "FileText" },
  { type: "posts-email", label: "Automáticos", color: "text-pink-600", iconName: "Mail" },
  { type: "posts-manual", label: "Manuais", color: "text-amber-600", iconName: "Edit" },
];

/** Map Tailwind text color to hex for charts */
const colorToHex: Record<string, string> = {
  "text-green-600": "#16a34a",
  "text-blue-600": "#2563eb",
  "text-purple-600": "#9333ea",
  "text-orange-600": "#ea580c",
  "text-teal-600": "#0d9488",
  "text-indigo-600": "#4f46e5",
  "text-pink-600": "#db2777",
  "text-amber-600": "#d97706",
};

export const AdminDashboard = () => {
  const [days, setDays] = useState<PeriodDays>(30);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("subscriptions");

  const { data, isLoading, isError, isFetching, refetchAll } = useAllDashboardMetrics(days);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardError onRetry={refetchAll} />;
  }

  const selectedConfig = METRICS_CONFIG.find((m) => m.type === selectedMetric);
  const chartColor = selectedConfig ? colorToHex[selectedConfig.color] : "#6366f1";

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <PeriodSelector value={days} onChange={setDays} disabled={isFetching} />
          <Button
            variant="outline"
            size="icon"
            onClick={refetchAll}
            disabled={isFetching}
            className="h-9 w-9 shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Layout Principal: Métricas + Gráfico lado a lado em desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-4 mb-4">
        {/* Coluna Esquerda: KPIs em grid compacto */}
        <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
          {METRICS_CONFIG.map((config) => {
            const Icon = ICON_MAP[config.iconName];
            return (
              <MetricCard
                key={config.type}
                title={config.label}
                value={data[config.type]?.count ?? 0}
                icon={Icon}
                color={config.color}
                onClick={() => setSelectedMetric(config.type)}
                isSelected={selectedMetric === config.type}
                isLoading={isFetching}
              />
            );
          })}
        </div>

        {/* Coluna Direita: Gráfico */}
        <Card className="min-h-[280px]">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartColor }}
              />
              {selectedConfig?.label} - últimos {days} dias
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <MetricChart
              data={data[selectedMetric]?.timeline ?? []}
              color={chartColor}
              height={220}
            />
          </CardContent>
        </Card>
      </div>

      {/* Seções de Detalhe em grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FunnelSection data={data} />
        <EngagementSection data={data} />
        <EmailSection data={data} />
      </div>

      {/* Footer note */}
      {data.subscriptions?.note && (
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-4">
          {data.subscriptions.note}
        </p>
      )}
    </div>
  );
};

export default AdminDashboard;
