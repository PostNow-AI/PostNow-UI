/**
 * PeriodSelector Component
 * Tab-based selector for choosing the time period for metrics
 * Mobile-first with horizontal scroll
 */

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PeriodDays } from "../types";

export interface PeriodSelectorProps {
  /** Currently selected period */
  value: PeriodDays;
  /** Callback when period changes */
  onChange: (days: PeriodDays) => void;
  /** Disable interaction */
  disabled?: boolean;
}

interface PeriodOption {
  value: PeriodDays;
  label: string;
  shortLabel: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 1, label: "24h", shortLabel: "24h" },
  { value: 7, label: "7 dias", shortLabel: "7d" },
  { value: 30, label: "30 dias", shortLabel: "30d" },
  { value: 90, label: "90 dias", shortLabel: "90d" },
  { value: 180, label: "6 meses", shortLabel: "6m" },
];

export const PeriodSelector = ({
  value,
  onChange,
  disabled = false,
}: PeriodSelectorProps) => {
  const handleValueChange = (newValue: string) => {
    onChange(Number(newValue) as PeriodDays);
  };

  return (
    <Tabs value={String(value)} onValueChange={handleValueChange}>
      <TabsList className="h-9">
        {PERIOD_OPTIONS.map((option) => (
          <TabsTrigger
            key={option.value}
            value={String(option.value)}
            disabled={disabled}
            className="text-xs px-2 lg:px-3 data-[state=active]:text-primary"
          >
            {option.shortLabel}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
