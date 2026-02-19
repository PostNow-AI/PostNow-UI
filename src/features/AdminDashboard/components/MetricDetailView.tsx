/**
 * MetricDetailView Component
 * Full-screen view showing detailed chart for a selected metric
 *
 * Features:
 * - Large chart visualization
 * - Horizontal swipe to navigate between metrics
 * - Position indicator (dots)
 * - Back button to return to grid view
 * - Trend comparison display
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowLeft, Users, UserPlus, Image, Mail, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AllMetricsData } from "../types";
import { MetricChart } from "./MetricChart";
import { cn } from "@/lib/utils";
import type { GeneralMetricType } from "./GeneralView";

interface MetricConfig {
  type: GeneralMetricType;
  label: string;
  icon: LucideIcon;
  color: string;
  hexColor: string;
}

const metricConfigs: MetricConfig[] = [
  { type: "subscriptions", label: "Assinaturas", icon: Users, color: "text-green-600", hexColor: "#16a34a" },
  { type: "onboardings", label: "Onboardings", icon: UserPlus, color: "text-blue-600", hexColor: "#2563eb" },
  { type: "images", label: "Imagens", icon: Image, color: "text-purple-600", hexColor: "#9333ea" },
  { type: "emails-sent", label: "Emails", icon: Mail, color: "text-orange-600", hexColor: "#ea580c" },
  { type: "posts-total", label: "Posts", icon: FileText, color: "text-teal-600", hexColor: "#0d9488" },
];

export interface MetricDetailViewProps {
  data: AllMetricsData;
  initialMetric: GeneralMetricType;
  periodLabel: string;
  onBack?: () => void;
  onMetricChange?: (metric: GeneralMetricType) => void;
}

const SWIPE_THRESHOLD = 50;

export const MetricDetailView = ({
  data,
  initialMetric,
  periodLabel: _periodLabel,
  onBack,
  onMetricChange,
}: MetricDetailViewProps) => {
  const initialIndex = metricConfigs.findIndex((m) => m.type === initialMetric);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [direction, setDirection] = useState(0);

  // Notify parent when metric changes
  const updateIndex = (newIndex: number) => {
    setCurrentIndex(newIndex);
    onMetricChange?.(metricConfigs[newIndex].type);
  };

  const currentConfig = metricConfigs[currentIndex];
  const metricData = data[currentConfig.type];

  // Calculate trend
  const timelineValues = metricData?.timeline.map((t) => t.count) ?? [];
  const currentValue = timelineValues[timelineValues.length - 1] ?? 0;
  const previousValue = timelineValues[Math.floor(timelineValues.length / 2)] ?? currentValue;
  const trendPercent = previousValue > 0
    ? ((currentValue - previousValue) / previousValue) * 100
    : 0;

  const TrendIcon = trendPercent > 0 ? TrendingUp : trendPercent < 0 ? TrendingDown : Minus;
  const trendColor = trendPercent > 0 ? "text-green-600" : trendPercent < 0 ? "text-red-600" : "text-muted-foreground";

  const goToNext = useCallback(() => {
    setDirection(1);
    // Wrap around: if at last, go to first
    const nextIndex = currentIndex >= metricConfigs.length - 1 ? 0 : currentIndex + 1;
    updateIndex(nextIndex);
  }, [currentIndex]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    // Wrap around: if at first, go to last
    const prevIndex = currentIndex <= 0 ? metricConfigs.length - 1 : currentIndex - 1;
    updateIndex(prevIndex);
  }, [currentIndex]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;

      // Check if swipe is significant enough
      if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 500) {
        if (offset.x > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    },
    [goToNext, goToPrev]
  );

  const Icon = currentConfig.icon;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden touch-pan-y"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col"
        >
          {/* Header with metric info */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3">
              {/* Back button - only show if onBack is provided */}
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="h-9 w-9"
                  aria-label="Voltar"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "p-2 rounded-lg",
                  currentConfig.color.replace("text-", "bg-").replace("600", "500/20")
                )}>
                  <Icon className={cn("h-5 w-5", currentConfig.color)} />
                </div>
                <span className={cn("text-lg font-semibold", currentConfig.color)}>
                  {currentConfig.label}
                </span>
              </div>

              {/* Position indicator (dots) */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Posição da métrica">
                {metricConfigs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      updateIndex(idx);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      idx === currentIndex
                        ? "bg-primary w-4"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    role="tab"
                    aria-selected={idx === currentIndex}
                    aria-label={`Ir para ${metricConfigs[idx].label}`}
                  />
                ))}
              </div>
            </div>

            {/* Value and trend */}
            <div className={cn("mt-3", onBack ? "ml-12" : "ml-0")}>
              <p className={cn("text-3xl font-bold tabular-nums", currentConfig.color)}>
                {(metricData?.count ?? 0).toLocaleString("pt-BR")}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendIcon className={cn("h-4 w-4", trendColor)} />
                <span className={cn("text-sm font-medium", trendColor)}>
                  {trendPercent >= 0 ? "+" : ""}{trendPercent.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  vs período anterior
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 px-4 pb-4">
            <MetricChart
              data={metricData?.timeline ?? []}
              color={currentConfig.hexColor}
              height={280}
              showGrid={true}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe hint - outside animation */}
      <p className="text-center text-xs text-muted-foreground pb-2">
        ← Deslize para mudar métrica →
      </p>
    </motion.div>
  );
};
