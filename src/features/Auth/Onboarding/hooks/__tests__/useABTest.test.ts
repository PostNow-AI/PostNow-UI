import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useABTest, useExperimentVariant, ONBOARDING_EXPERIMENTS } from "../useABTest";

const STORAGE_KEY = "postnow_ab_tests";

describe("useABTest", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getVariant", () => {
    it("should return null for non-existent experiment", () => {
      const { result } = renderHook(() => useABTest());

      let variant: string | null = null;
      act(() => {
        variant = result.current.getVariant("experimento_inexistente");
      });

      expect(variant).toBeNull();
    });

    it("should return null for inactive experiment", () => {
      const { result } = renderHook(() => useABTest());

      let variant: string | null = null;
      act(() => {
        // onboarding_step_count is inactive by default
        variant = result.current.getVariant("onboarding_step_count");
      });

      expect(variant).toBeNull();
    });

    it("should return a valid variant for active experiment", () => {
      const { result } = renderHook(() => useABTest());

      let variant: string | null = null;
      act(() => {
        variant = result.current.getVariant("onboarding_celebration_intensity");
      });

      const experiment = ONBOARDING_EXPERIMENTS.find(
        (e) => e.id === "onboarding_celebration_intensity"
      );
      expect(experiment?.variants).toContain(variant);
    });

    it("should return the same variant on subsequent calls", () => {
      const { result } = renderHook(() => useABTest());

      let variant1: string | null = null;
      let variant2: string | null = null;

      act(() => {
        variant1 = result.current.getVariant("onboarding_celebration_intensity");
      });

      act(() => {
        variant2 = result.current.getVariant("onboarding_celebration_intensity");
      });

      expect(variant1).toBe(variant2);
    });

    it("should persist assignment to localStorage", async () => {
      const { result } = renderHook(() => useABTest());

      act(() => {
        result.current.getVariant("onboarding_celebration_intensity");
      });

      // Wait for useEffect to sync to localStorage
      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        expect(stored).not.toBeNull();

        const parsed = JSON.parse(stored!);
        expect(parsed.onboarding_celebration_intensity).toBeDefined();
        expect(parsed.onboarding_celebration_intensity.variant).toBeDefined();
      });
    });

    it("should restore assignment from localStorage", () => {
      // Pre-populate localStorage
      const presetAssignment = {
        onboarding_celebration_intensity: {
          experimentId: "onboarding_celebration_intensity",
          variant: "full",
          assignedAt: Date.now(),
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presetAssignment));

      const { result } = renderHook(() => useABTest());

      let variant: string | null = null;
      act(() => {
        variant = result.current.getVariant("onboarding_celebration_intensity");
      });

      expect(variant).toBe("full");
    });
  });

  describe("forceVariant", () => {
    it("should force a specific variant", async () => {
      const { result } = renderHook(() => useABTest());

      act(() => {
        result.current.forceVariant("onboarding_celebration_intensity", "subtle");
      });

      await waitFor(() => {
        let variant: string | null = null;
        variant = result.current.getVariant("onboarding_celebration_intensity");
        expect(variant).toBe("subtle");
      });
    });

    it("should ignore invalid variant", async () => {
      const { result } = renderHook(() => useABTest());

      // First get a valid variant
      let originalVariant: string | null = null;
      act(() => {
        originalVariant = result.current.getVariant("onboarding_celebration_intensity");
      });

      act(() => {
        result.current.forceVariant("onboarding_celebration_intensity", "variante_invalida");
      });

      // Should keep the original variant
      await waitFor(() => {
        const variant = result.current.getVariant("onboarding_celebration_intensity");
        expect(variant).toBe(originalVariant);
      });
    });

    it("should ignore non-existent experiment", async () => {
      const { result } = renderHook(() => useABTest());

      act(() => {
        result.current.forceVariant("experimento_inexistente", "test");
      });

      // Should not cause error and should not have assignment
      await waitFor(() => {
        expect(result.current.assignments.experimento_inexistente).toBeUndefined();
      });
    });
  });

  describe("clearAssignments", () => {
    it("should clear all assignments", async () => {
      const { result } = renderHook(() => useABTest());

      // Create some assignments
      act(() => {
        result.current.getVariant("onboarding_celebration_intensity");
        result.current.getVariant("onboarding_preview_position");
      });

      act(() => {
        result.current.clearAssignments();
      });

      await waitFor(() => {
        expect(Object.keys(result.current.assignments).length).toBe(0);
      });

      // localStorage should be cleared or empty
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        expect(JSON.parse(stored)).toEqual({});
      }
    });
  });

  describe("trackConversion", () => {
    it("should not throw for existing assignment", async () => {
      const { result } = renderHook(() => useABTest());

      // Create assignment
      act(() => {
        result.current.getVariant("onboarding_celebration_intensity");
      });

      // Wait for assignment to be saved in state
      await waitFor(() => {
        expect(result.current.assignments.onboarding_celebration_intensity).toBeDefined();
      });

      // Track conversion - should not throw
      expect(() => {
        act(() => {
          result.current.trackConversion("onboarding_celebration_intensity", "completed");
        });
      }).not.toThrow();
    });

    it("should silently ignore conversion for non-existent assignment", () => {
      const { result } = renderHook(() => useABTest());

      // Should not throw
      expect(() => {
        act(() => {
          result.current.trackConversion("experimento_inexistente", "completed");
        });
      }).not.toThrow();
    });

    it("should accept custom properties", async () => {
      const { result } = renderHook(() => useABTest());

      act(() => {
        result.current.getVariant("onboarding_celebration_intensity");
      });

      // Wait for assignment to be saved in state
      await waitFor(() => {
        expect(result.current.assignments.onboarding_celebration_intensity).toBeDefined();
      });

      // Should not throw with custom properties
      expect(() => {
        act(() => {
          result.current.trackConversion("onboarding_celebration_intensity", "completed", {
            step: 13,
            duration: 5000,
          });
        });
      }).not.toThrow();
    });
  });

  describe("assignments", () => {
    it("should return empty object initially", () => {
      const { result } = renderHook(() => useABTest());

      expect(result.current.assignments).toEqual({});
    });

    it("should return assignments after getVariant", async () => {
      const { result } = renderHook(() => useABTest());

      act(() => {
        result.current.getVariant("onboarding_celebration_intensity");
      });

      await waitFor(() => {
        expect(result.current.assignments.onboarding_celebration_intensity).toBeDefined();
      });
    });
  });
});

describe("useExperimentVariant", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return variant for active experiment", () => {
    const { result } = renderHook(() =>
      useExperimentVariant("onboarding_celebration_intensity")
    );

    const experiment = ONBOARDING_EXPERIMENTS.find(
      (e) => e.id === "onboarding_celebration_intensity"
    );
    expect(experiment?.variants).toContain(result.current);
  });

  it("should return null for inactive experiment", () => {
    const { result } = renderHook(() =>
      useExperimentVariant("onboarding_step_count")
    );

    expect(result.current).toBeNull();
  });

  it("should return null for non-existent experiment", () => {
    const { result } = renderHook(() =>
      useExperimentVariant("experimento_inexistente")
    );

    expect(result.current).toBeNull();
  });
});

describe("ONBOARDING_EXPERIMENTS", () => {
  it("should have experiments defined", () => {
    expect(ONBOARDING_EXPERIMENTS.length).toBeGreaterThan(0);
  });

  it("each experiment should have valid structure", () => {
    ONBOARDING_EXPERIMENTS.forEach((experiment) => {
      expect(experiment.id).toBeDefined();
      expect(experiment.name).toBeDefined();
      expect(experiment.variants.length).toBeGreaterThan(0);
      expect(typeof experiment.active).toBe("boolean");
    });
  });

  it("weights should sum to approximately 100", () => {
    ONBOARDING_EXPERIMENTS.forEach((experiment) => {
      if (experiment.weights) {
        const sum = experiment.weights.reduce((a, b) => a + b, 0);
        expect(sum).toBeGreaterThanOrEqual(99);
        expect(sum).toBeLessThanOrEqual(101);
      }
    });
  });
});
