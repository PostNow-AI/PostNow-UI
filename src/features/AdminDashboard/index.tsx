/**
 * AdminDashboard Feature
 * Main dashboard page for admin analytics visualization
 * Mobile-first single-column layout with progressive enhancement
 *
 * Design based on best practices:
 * - Single column on mobile, scroll vertical
 * - Hero metric at top with sparkline
 * - Quick stats row (scrollable on mobile)
 * - Detail cards below
 *
 * Sources:
 * - Toptal Mobile Dashboard UI Best Practices
 * - PatternFly Dashboard Design Guidelines
 * - Stripe Dashboard Mobile App patterns
 */

import { useState } from "react";
import {
  Users,
  UserPlus,
  Image,
  Send,
  MailOpen,
  FileText,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllDashboardMetrics } from "./hooks/useDashboardMetrics";
import {
  MetricChart,
  DashboardSkeleton,
  DashboardError,
  FunnelSection,
  EngagementSection,
  EmailSection,
  HeroMetricCard,
  QuickStatsRow,
} from "./components";
import type { QuickStat } from "./components";
import type { PeriodDays, MetricType } from "./types";

/** Period options for the selector */
const PERIOD_OPTIONS: { value: PeriodDays; label: string }[] = [
  { value: 1, label: "24h" },
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: 180, label: "6 meses" },
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

  // Build quick stats for the row
  const quickStats: QuickStat[] = [
    {
      label: "Onboardings",
      value: data.onboardings?.count ?? 0,
      icon: UserPlus,
      color: "text-blue-600",
      onClick: () => setSelectedMetric("onboardings"),
      isSelected: selectedMetric === "onboardings",
    },
    {
      label: "Imagens",
      value: data.images?.count ?? 0,
      icon: Image,
      color: "text-purple-600",
      onClick: () => setSelectedMetric("images"),
      isSelected: selectedMetric === "images",
    },
    {
      label: "Emails",
      value: data["emails-sent"]?.count ?? 0,
      icon: Send,
      color: "text-orange-600",
      onClick: () => setSelectedMetric("emails-sent"),
      isSelected: selectedMetric === "emails-sent",
    },
    {
      label: "Posts",
      value: data["posts-total"]?.count ?? 0,
      icon: FileText,
      color: "text-indigo-600",
      onClick: () => setSelectedMetric("posts-total"),
      isSelected: selectedMetric === "posts-total",
    },
  ];

  // Get selected metric info for chart
  const getMetricInfo = (type: MetricType): { label: string; color: string; icon: LucideIcon } => {
    const map: Record<MetricType, { label: string; color: string; icon: LucideIcon }> = {
      subscriptions: { label: "Assinaturas", color: "text-green-600", icon: Users },
      onboardings: { label: "Onboardings", color: "text-blue-600", icon: UserPlus },
      images: { label: "Imagens", color: "text-purple-600", icon: Image },
      "emails-sent": { label: "Emails Enviados", color: "text-orange-600", icon: Send },
      "emails-opened": { label: "Emails Abertos", color: "text-teal-600", icon: MailOpen },
      "posts-total": { label: "Posts", color: "text-indigo-600", icon: FileText },
      "posts-email": { label: "Posts Auto", color: "text-pink-600", icon: Send },
      "posts-manual": { label: "Posts Manual", color: "text-amber-600", icon: FileText },
    };
    return map[type];
  };

  const selectedInfo = getMetricInfo(selectedMetric);
  const chartColor = colorToHex[selectedInfo.color] || "#6366f1";
  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === days)?.label ?? `${days}d`;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-3 max-w-2xl mx-auto lg:max-w-6xl">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v) as PeriodDays)}>
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={refetchAll}
              disabled={isFetching}
              className="h-9 w-9"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Single column mobile, enhanced desktop */}
      <div className="p-3 space-y-4 max-w-2xl mx-auto lg:max-w-6xl">
        {/* Hero Metric - Main KPI */}
        <div
          className="cursor-pointer"
          onClick={() => setSelectedMetric("subscriptions")}
        >
          <HeroMetricCard
            title="Assinaturas"
            value={data.subscriptions?.count ?? 0}
            timeline={data.subscriptions?.timeline ?? []}
            icon={Users}
            color="text-green-600"
            periodLabel={periodLabel}
          />
        </div>

        {/* Quick Stats Row - Scrollable on mobile */}
        <QuickStatsRow stats={quickStats} />

        {/* Chart Card - Full width, prominent */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: chartColor }}
              />
              {selectedInfo.label}
              <span className="text-muted-foreground font-normal">
                - {periodLabel}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <MetricChart
              data={data[selectedMetric]?.timeline ?? []}
              color={chartColor}
              height={180}
            />
          </CardContent>
        </Card>

        {/* Detail Sections - Stack on mobile, grid on desktop */}
        <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
          <FunnelSection data={data} />
          <EngagementSection data={data} />
          <EmailSection data={data} />
        </div>

        {/* Footer note */}
        {data.subscriptions?.note && (
          <p className="text-[10px] text-muted-foreground text-center py-2">
            {data.subscriptions.note}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
