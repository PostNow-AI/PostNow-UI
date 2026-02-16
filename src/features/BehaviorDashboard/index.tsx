import { Card } from "@/components/ui/card";
import {
  FileText,
  Image,
  Mail,
  MailOpen,
  PenTool,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { DashboardGrid } from "./components/DashboardGrid";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { MetricCard } from "./components/MetricCard";
import { DEFAULT_DAYS, METRIC_DESCRIPTIONS, METRIC_LABELS } from "./constants";
import { useDashboardMetrics } from "./hooks/useDashboardMetrics";

export const BehaviorDashboard = () => {
  const [selectedDays, setSelectedDays] = useState(DEFAULT_DAYS);
  const metrics = useDashboardMetrics(selectedDays);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard de Comportamento
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe as métricas principais de comportamento dos usuários
          </p>
        </div>
        <DateRangeFilter value={selectedDays} onChange={setSelectedDays} />
      </div>

      {/* Metrics Grid */}
      <DashboardGrid>
        <MetricCard
          title={METRIC_LABELS.subscriptions}
          description={METRIC_DESCRIPTIONS.subscriptions}
          icon={TrendingUp}
          data={metrics.subscriptions.data}
          isLoading={metrics.subscriptions.isLoading}
          error={metrics.subscriptions.error}
          showChart
          chartColor="#10b981"
        />
        <MetricCard
          title={METRIC_LABELS.onboardings}
          description={METRIC_DESCRIPTIONS.onboardings}
          icon={Users}
          data={metrics.onboardings.data}
          isLoading={metrics.onboardings.isLoading}
          error={metrics.onboardings.error}
          showChart
          chartColor="#3b82f6"
        />
        <MetricCard
          title={METRIC_LABELS.images}
          description={METRIC_DESCRIPTIONS.images}
          icon={Image}
          data={metrics.images.data}
          isLoading={metrics.images.isLoading}
          error={metrics.images.error}
          showChart
          chartColor="#8b5cf6"
        />
        <MetricCard
          title={METRIC_LABELS.emailsSent}
          description={METRIC_DESCRIPTIONS.emailsSent}
          icon={Mail}
          data={metrics.emailsSent.data}
          isLoading={metrics.emailsSent.isLoading}
          error={metrics.emailsSent.error}
          showChart
          chartColor="#f59e0b"
        />
        <MetricCard
          title={METRIC_LABELS.emailsOpened}
          description={METRIC_DESCRIPTIONS.emailsOpened}
          icon={MailOpen}
          data={metrics.emailsOpened.data}
          isLoading={metrics.emailsOpened.isLoading}
          error={metrics.emailsOpened.error}
          showChart
          chartColor="#ef4444"
        />
        <MetricCard
          title={METRIC_LABELS.postsTotal}
          description={METRIC_DESCRIPTIONS.postsTotal}
          icon={FileText}
          data={metrics.postsTotal.data}
          isLoading={metrics.postsTotal.isLoading}
          error={metrics.postsTotal.error}
          showChart
          chartColor="#06b6d4"
        />
        <MetricCard
          title={METRIC_LABELS.postsEmail}
          description={METRIC_DESCRIPTIONS.postsEmail}
          icon={Zap}
          data={metrics.postsEmail.data}
          isLoading={metrics.postsEmail.isLoading}
          error={metrics.postsEmail.error}
          showChart
          chartColor="#84cc16"
        />
        <MetricCard
          title={METRIC_LABELS.postsManual}
          description={METRIC_DESCRIPTIONS.postsManual}
          icon={PenTool}
          data={metrics.postsManual.data}
          isLoading={metrics.postsManual.isLoading}
          error={metrics.postsManual.error}
          showChart
          chartColor="#ec4899"
        />
      </DashboardGrid>

      {/* Info Card */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Informações importantes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Todas as métricas excluem usuários administradores do sistema
            </li>
            <li>
              A métrica de "E-mails Abertos" pode apresentar valores menores que
              o real devido a recursos de privacidade dos clientes de e-mail
            </li>
            <li>
              Os dados são atualizados em tempo real com cache de 5 minutos
            </li>
            <li>
              Gráficos mostram a evolução diária da métrica no período
              selecionado
            </li>
            <li>
              Em dispositivos móveis, toque no ícone de expandir para ver o
              gráfico em tela cheia
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default BehaviorDashboard;
