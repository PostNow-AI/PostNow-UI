/**
 * AdminDashboard Feature
 * Main dashboard page for admin analytics visualization
 * Mobile-first layout with screen-based navigation
 *
 * Features:
 * - 4-tab navigation: Geral, Funil, Engaj, Email
 * - Full-screen views without scroll
 * - Drill-down from metric cards to detailed charts
 * - Swipe navigation between metrics in detail view
 *
 * Design based on best practices:
 * - Bottom navigation for tab selection (green zone - easy to reach)
 * - Content fills available space
 * - Touch targets minimum 48x48px (using 56px for comfort)
 */

import { useState } from "react";
import { RefreshCw } from "lucide-react";
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
  DashboardSkeleton,
  DashboardError,
  FunnelSection,
  EngagementSection,
  EmailSection,
} from "./components";
import { BottomNav, type DashboardTab } from "./components/BottomNav";
import { MetricDetailView } from "./components/MetricDetailView";
import { SubscriptionDetailsSheet } from "./components/SubscriptionDetailsSheet";
import { LoginDetailsSheet } from "./components/LoginDetailsSheet";
import type { GeneralMetricType } from "./components/GeneralView";
import type { PeriodDays } from "./types";

/** Period options for the selector */
const PERIOD_OPTIONS: { value: PeriodDays; label: string }[] = [
  { value: 1, label: "24h" },
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: 180, label: "6 meses" },
];

export const AdminDashboard = () => {
  const [days, setDays] = useState<PeriodDays>(30);
  const [activeTab, setActiveTab] = useState<DashboardTab>("geral");
  const [selectedMetric, setSelectedMetric] = useState<GeneralMetricType>("subscriptions");
  const [subscriptionSheetOpen, setSubscriptionSheetOpen] = useState(false);
  const [loginSheetOpen, setLoginSheetOpen] = useState(false);

  const { data, isLoading, isError, isFetching, refetchAll } = useAllDashboardMetrics(days);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardError onRetry={refetchAll} />;
  }

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === days)?.label ?? `${days}d`;

  // Render active screen content
  const renderContent = () => {
    switch (activeTab) {
      case "geral":
        // Show chart directly with swipe navigation
        return (
          <MetricDetailView
            data={data}
            initialMetric={selectedMetric}
            periodLabel={periodLabel}
            onMetricChange={setSelectedMetric}
          />
        );
      case "funil":
        return (
          <FunnelSection
            days={days}
            fullscreen
          />
        );
      case "engaj":
        return <EngagementSection data={data} fullscreen />;
      case "email":
        return <EmailSection data={data} fullscreen />;
      default:
        return (
          <MetricDetailView
            data={data}
            initialMetric={selectedMetric}
            periodLabel={periodLabel}
            onMetricChange={setSelectedMetric}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-3">
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
      </header>

      {/* Main Content Area - fills available space */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Detail Sheets */}
      <SubscriptionDetailsSheet
        open={subscriptionSheetOpen}
        onOpenChange={setSubscriptionSheetOpen}
        days={days}
      />
      <LoginDetailsSheet
        open={loginSheetOpen}
        onOpenChange={setLoginSheetOpen}
        days={days}
      />
    </div>
  );
};

export default AdminDashboard;
