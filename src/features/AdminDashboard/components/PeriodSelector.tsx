/**
 * PeriodSelector Component
 * Tab-based selector for choosing the time period for metrics
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
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 1, label: "24h" },
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: 180, label: "180 dias" },
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
      <TabsList>
        {PERIOD_OPTIONS.map((option) => (
          <TabsTrigger
            key={option.value}
            value={String(option.value)}
            disabled={disabled}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
