/**
 * Funnel Utility Functions
 * Applies DRY principle - centralizes conversion calculations and color logic
 */

import type { OnboardingFunnelResponse } from "../types";

/**
 * Thresholds for color coding conversion rates
 */
export interface ColorThresholds {
  good: number;  // >= this = green
  warning: number; // >= this = yellow, below = red
}

export const PHASE_THRESHOLDS: ColorThresholds = { good: 90, warning: 70 };
export const STEP_THRESHOLDS: ColorThresholds = { good: 95, warning: 80 };

/**
 * Get the appropriate color class based on conversion rate
 * @param rate - The conversion rate (0-100)
 * @param thresholds - The thresholds for color coding
 * @param variant - 'light' for headers (300), 'normal' for steps (300)
 */
export const getConversionColorClass = (
  rate: number,
  thresholds: ColorThresholds = STEP_THRESHOLDS,
  variant: "light" | "normal" = "normal"
): string => {
  const shade = variant === "light" ? "300" : "300";

  if (rate >= thresholds.good) {
    return `text-green-${shade}`;
  }
  if (rate >= thresholds.warning) {
    return `text-yellow-${shade}`;
  }
  return `text-red-${shade}`;
};

/**
 * Calculate conversion rate between two values
 * @param current - Current step/phase count
 * @param previous - Previous step/phase count
 * @returns Conversion rate as percentage (0-100)
 */
export const calcConversionRate = (current: number, previous: number): number => {
  if (previous <= 0) return 0;
  return Math.round((current / previous) * 100);
};

/**
 * Calculate percentage of total (from step 1)
 * @param current - Current count
 * @param total - Total count (step 1)
 * @returns Percentage of total (0-100)
 */
export const calcTotalRate = (current: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.round((current / total) * 100);
};

/**
 * Build step counts object from API response
 * @param data - Onboarding funnel API response
 * @returns Record mapping step number to count
 */
export const buildStepCounts = (data: OnboardingFunnelResponse): Record<number, number> => {
  const stepCounts: Record<number, number> = {};
  for (let i = 1; i <= 20; i++) {
    const key = `step_${i}` as keyof OnboardingFunnelResponse;
    stepCounts[i] = (data[key] as number) || 0;
  }
  return stepCounts;
};

/**
 * Calculate the position for the large percentage label
 * Positions the label in the majority color area, near the transition
 * @param totalRate - The total rate percentage (0-100)
 * @returns Position style object
 */
export const calcPercentageLabelPosition = (
  totalRate: number
): { position: "left" | "right"; value: number } => {
  const PADDING = 3; // Visual padding from transition (in %)

  if (totalRate >= 50) {
    // Inside colored area - position by RIGHT edge of text
    const rightPosition = 100 - totalRate + PADDING;
    const finalRight = Math.max(15, Math.min(rightPosition, 68));
    return { position: "right", value: finalRight };
  } else {
    // Inside red area - position by LEFT edge of text
    const leftPosition = totalRate + PADDING;
    const finalLeft = Math.max(32, Math.min(leftPosition, 80));
    return { position: "left", value: finalLeft };
  }
};
