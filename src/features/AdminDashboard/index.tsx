/**
 * AdminDashboard Feature
 * Main dashboard page for admin analytics visualization
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  { type: "images", label: "Imagens Geradas", color: "text-purple-600", iconName: "Image" },
  { type: "emails-sent", label: "Emails Enviados", color: "text-orange-600", iconName: "Send" },
  { type: "emails-opened", label: "Emails Abertos", color: "text-teal-600", iconName: "MailOpen" },
  { type: "posts-total", label: "Posts Totais", color: "text-indigo-600", iconName: "FileText" },
  { type: "posts-email", label: "Posts Automáticos", color: "text-pink-600", iconName: "Mail" },
  { type: "posts-manual", label: "Posts Manuais", color: "text-amber-600", iconName: "Edit" },
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de Métricas</h1>
          <p className="text-muted-foreground">
            Visão geral do comportamento dos usuários
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={refetchAll}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <PeriodSelector value={days} onChange={setDays} disabled={isFetching} />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedConfig?.label ?? "Métrica"} - Últimos {days} dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MetricChart
            data={data[selectedMetric]?.timeline ?? []}
            color={chartColor}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Detail Sections */}
      <Tabs defaultValue="conversao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversao">Funil de Conversão</TabsTrigger>
          <TabsTrigger value="engajamento">Engajamento</TabsTrigger>
          <TabsTrigger value="emails">Performance de Email</TabsTrigger>
        </TabsList>

        <TabsContent value="conversao">
          <FunnelSection data={data} />
        </TabsContent>

        <TabsContent value="engajamento">
          <EngagementSection data={data} />
        </TabsContent>

        <TabsContent value="emails">
          <EmailSection data={data} />
        </TabsContent>
      </Tabs>

      {/* Footer note */}
      {data.subscriptions?.note && (
        <p className="text-xs text-muted-foreground text-center">
          {data.subscriptions.note}
        </p>
      )}
    </div>
  );
};

export default AdminDashboard;
