/**
 * Tests for funnelUtils
 * Tests utility functions for conversion calculations and color coding
 */

import { describe, it, expect } from "vitest";
import {
  getConversionColorClass,
  calcConversionRate,
  calcTotalRate,
  buildStepCounts,
  calcPercentageLabelPosition,
  PHASE_THRESHOLDS,
  STEP_THRESHOLDS,
} from "../funnelUtils";
import type { OnboardingFunnelResponse } from "../../types";

describe("funnelUtils", () => {
  describe("getConversionColorClass", () => {
    it("returns green for rates >= good threshold", () => {
      expect(getConversionColorClass(95, STEP_THRESHOLDS)).toBe("text-green-300");
      expect(getConversionColorClass(100, STEP_THRESHOLDS)).toBe("text-green-300");
    });

    it("returns yellow for rates >= warning but < good threshold", () => {
      expect(getConversionColorClass(80, STEP_THRESHOLDS)).toBe("text-yellow-300");
      expect(getConversionColorClass(94, STEP_THRESHOLDS)).toBe("text-yellow-300");
    });

    it("returns red for rates < warning threshold", () => {
      expect(getConversionColorClass(79, STEP_THRESHOLDS)).toBe("text-red-300");
      expect(getConversionColorClass(0, STEP_THRESHOLDS)).toBe("text-red-300");
    });

    it("uses phase thresholds correctly", () => {
      expect(getConversionColorClass(90, PHASE_THRESHOLDS)).toBe("text-green-300");
      expect(getConversionColorClass(70, PHASE_THRESHOLDS)).toBe("text-yellow-300");
      expect(getConversionColorClass(69, PHASE_THRESHOLDS)).toBe("text-red-300");
    });
  });

  describe("calcConversionRate", () => {
    it("calculates correct conversion rate", () => {
      expect(calcConversionRate(80, 100)).toBe(80);
      expect(calcConversionRate(50, 100)).toBe(50);
      expect(calcConversionRate(100, 100)).toBe(100);
    });

    it("returns 0 when previous is 0", () => {
      expect(calcConversionRate(50, 0)).toBe(0);
    });

    it("rounds to nearest integer", () => {
      expect(calcConversionRate(33, 100)).toBe(33);
      expect(calcConversionRate(66, 100)).toBe(66);
    });
  });

  describe("calcTotalRate", () => {
    it("calculates correct percentage of total", () => {
      expect(calcTotalRate(50, 100)).toBe(50);
      expect(calcTotalRate(100, 100)).toBe(100);
      expect(calcTotalRate(25, 100)).toBe(25);
    });

    it("returns 0 when total is 0", () => {
      expect(calcTotalRate(50, 0)).toBe(0);
    });
  });

  describe("buildStepCounts", () => {
    it("builds step counts from API response", () => {
      const mockData = {
        started: 100,
        step_1: 100,
        step_2: 98,
        step_3: 95,
        step_20: 50,
      } as OnboardingFunnelResponse;

      const counts = buildStepCounts(mockData);

      expect(counts[1]).toBe(100);
      expect(counts[2]).toBe(98);
      expect(counts[3]).toBe(95);
      expect(counts[20]).toBe(50);
    });

    it("returns 0 for missing steps", () => {
      const mockData = {
        started: 100,
        step_1: 100,
      } as OnboardingFunnelResponse;

      const counts = buildStepCounts(mockData);

      expect(counts[1]).toBe(100);
      expect(counts[5]).toBe(0);
    });
  });

  describe("calcPercentageLabelPosition", () => {
    it("positions to the right for rates >= 50%", () => {
      const result = calcPercentageLabelPosition(80);
      expect(result.position).toBe("right");
    });

    it("positions to the left for rates < 50%", () => {
      const result = calcPercentageLabelPosition(30);
      expect(result.position).toBe("left");
    });

    it("clamps right position to min 15%", () => {
      const result = calcPercentageLabelPosition(100);
      expect(result.position).toBe("right");
      expect(result.value).toBeGreaterThanOrEqual(15);
    });

    it("clamps left position to min 32%", () => {
      const result = calcPercentageLabelPosition(10);
      expect(result.position).toBe("left");
      expect(result.value).toBeGreaterThanOrEqual(32);
    });
  });
});
