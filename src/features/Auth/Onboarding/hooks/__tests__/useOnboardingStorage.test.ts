import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useOnboardingStorage } from "../useOnboardingStorage";

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: null, isLoading: false }),
}));

// Mock profile API
vi.mock("../../../Profile/services", () => ({
  profileApi: {
    getProfile: vi.fn(),
  },
}));

const STORAGE_KEY = "postnow_onboarding_data";

describe("useOnboardingStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initial State", () => {
    it("should return default data when localStorage is empty", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      expect(result.current.data.business_name).toBe("");
      expect(result.current.data.current_step).toBe(1);
      expect(result.current.data.colors).toHaveLength(5);
      expect(result.current.isLoaded).toBe(true);
    });

    it("should have default color palette", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      expect(result.current.data.colors).toEqual([
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFBE0B",
      ]);
    });

    it("should load existing data from localStorage", () => {
      const existingData = {
        business_name: "Test Business",
        current_step: 3,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));

      const { result } = renderHook(() => useOnboardingStorage());

      expect(result.current.data.business_name).toBe("Test Business");
      expect(result.current.data.current_step).toBe(3);
    });

    it("should clear expired data from localStorage", () => {
      const expiredData = {
        business_name: "Expired Business",
        current_step: 5,
        expires_at: new Date(Date.now() - 1000).toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredData));

      const { result } = renderHook(() => useOnboardingStorage());

      expect(result.current.data.business_name).toBe("");
      expect(result.current.data.current_step).toBe(1);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("saveData", () => {
    it("should update data state", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({ business_name: "New Business" });
      });

      expect(result.current.data.business_name).toBe("New Business");
    });

    it("should persist data to localStorage", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({ business_name: "Persisted Business" });
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      expect(stored.business_name).toBe("Persisted Business");
    });

    it("should update expiration time on save", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      const beforeSave = Date.now();
      act(() => {
        result.current.saveData({ business_name: "Test" });
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const expiresAt = new Date(stored.expires_at).getTime();

      // Should expire approximately 24 hours from now
      expect(expiresAt).toBeGreaterThan(beforeSave + 23 * 60 * 60 * 1000);
    });

    it("should merge partial data with existing data", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({ business_name: "Test" });
      });

      act(() => {
        result.current.saveData({ specialization: "tech" });
      });

      expect(result.current.data.business_name).toBe("Test");
      expect(result.current.data.specialization).toBe("tech");
    });
  });

  describe("setCurrentStep", () => {
    it("should update current step", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.setCurrentStep(5);
      });

      expect(result.current.data.current_step).toBe(5);
    });

    it("should persist step to localStorage", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.setCurrentStep(10);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      expect(stored.current_step).toBe(10);
    });
  });

  describe("markAsCompleted", () => {
    it("should set completed_at timestamp", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.markAsCompleted();
      });

      expect(result.current.data.completed_at).toBeDefined();
      expect(result.current.isCompleted).toBe(true);
    });

    it("should persist completed status", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.markAsCompleted();
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      expect(stored.completed_at).toBeDefined();
    });
  });

  describe("clearData", () => {
    it("should reset data to defaults", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({
          business_name: "Test",
          current_step: 5,
        });
      });

      act(() => {
        result.current.clearData();
      });

      expect(result.current.data.business_name).toBe("");
      expect(result.current.data.current_step).toBe(1);
    });

    it("should remove data from localStorage", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({ business_name: "Test" });
      });

      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      act(() => {
        result.current.clearData();
      });

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("initializeWithData", () => {
    it("should initialize with provided data", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData({
          business_name: "Initialized Business",
          specialization: "saude",
        });
      });

      expect(result.current.data.business_name).toBe("Initialized Business");
      expect(result.current.data.specialization).toBe("saude");
    });

    it("should set current_step to 2 for edit mode", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.initializeWithData({
          business_name: "Test",
        });
      });

      expect(result.current.data.current_step).toBe(2);
    });
  });

  describe("getStep1Payload", () => {
    it("should return formatted data for API step 1", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({
          business_name: "Test Business",
          brand_personality: ["Profissional", "Inovador"],
          target_interests: ["Tecnologia", "Finanças"],
        });
      });

      const payload = result.current.getStep1Payload();

      expect(payload.business_name).toBe("Test Business");
      expect(payload.brand_personality).toBe("Profissional, Inovador");
      expect(payload.target_interests).toBe("Tecnologia, Finanças");
    });

    it("should convert arrays to comma-separated strings", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({
          brand_personality: ["A", "B", "C"],
        });
      });

      const payload = result.current.getStep1Payload();
      expect(payload.brand_personality).toBe("A, B, C");
    });
  });

  describe("getStep2Payload", () => {
    it("should return formatted data for API step 2", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.saveData({
          voice_tone: "casual",
          logo: "https://example.com/logo.png",
          colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
          visual_style_ids: ["1", "2"],
        });
      });

      const payload = result.current.getStep2Payload();

      expect(payload.voice_tone).toBe("casual");
      expect(payload.logo).toBe("https://example.com/logo.png");
      expect(payload.color_1).toBe("#FF0000");
      expect(payload.color_2).toBe("#00FF00");
      expect(payload.color_3).toBe("#0000FF");
      expect(payload.color_4).toBe("#FFFF00");
      expect(payload.color_5).toBe("#FF00FF");
      expect(payload.visual_style_ids).toEqual(["1", "2"]);
    });

    it("should use default colors when not set", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      const payload = result.current.getStep2Payload();

      expect(payload.color_1).toBe("#FF6B6B");
      expect(payload.color_2).toBe("#4ECDC4");
    });
  });

  describe("isCompleted", () => {
    it("should be false initially", () => {
      const { result } = renderHook(() => useOnboardingStorage());
      expect(result.current.isCompleted).toBe(false);
    });

    it("should be true after markAsCompleted", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      act(() => {
        result.current.markAsCompleted();
      });

      expect(result.current.isCompleted).toBe(true);
    });
  });

  describe("Data Validation (Zod)", () => {
    it("should reject invalid data from localStorage", () => {
      const invalidData = {
        business_name: 12345, // Should be string
        current_step: "invalid", // Should be number
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidData));

      const { result } = renderHook(() => useOnboardingStorage());

      // Should fall back to defaults when validation fails
      expect(result.current.data.business_name).toBe("");
      expect(result.current.data.current_step).toBe(1);
    });

    it("should handle corrupted JSON in localStorage", () => {
      localStorage.setItem(STORAGE_KEY, "not valid json {{{");

      const { result } = renderHook(() => useOnboardingStorage());

      expect(result.current.data.business_name).toBe("");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("should validate color format", () => {
      const dataWithInvalidColors = {
        colors: ["not-a-color", "#FF6B6B", "rgb(255,0,0)"],
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithInvalidColors));

      const { result } = renderHook(() => useOnboardingStorage());

      // Should use default colors due to validation failure
      expect(result.current.data.colors[0]).toBe("#FF6B6B");
    });
  });

  describe("Data Sanitization", () => {
    it("should truncate business_name longer than 100 chars", () => {
      const { result } = renderHook(() => useOnboardingStorage());
      const longName = "A".repeat(150);

      act(() => {
        result.current.saveData({ business_name: longName });
      });

      expect(result.current.data.business_name.length).toBeLessThanOrEqual(100);
    });

    it("should truncate business_description longer than 500 chars", () => {
      const { result } = renderHook(() => useOnboardingStorage());
      const longDescription = "B".repeat(600);

      act(() => {
        result.current.saveData({ business_description: longDescription });
      });

      expect(result.current.data.business_description.length).toBeLessThanOrEqual(500);
    });

    it("should limit brand_personality array to 10 items", () => {
      const { result } = renderHook(() => useOnboardingStorage());
      const manyItems = Array(15).fill("Item").map((s, i) => `${s}${i}`);

      act(() => {
        result.current.saveData({ brand_personality: manyItems });
      });

      expect(result.current.data.brand_personality.length).toBeLessThanOrEqual(10);
    });

    it("should limit target_interests array to 20 items", () => {
      const { result } = renderHook(() => useOnboardingStorage());
      const manyInterests = Array(25).fill("Interest").map((s, i) => `${s}${i}`);

      act(() => {
        result.current.saveData({ target_interests: manyInterests });
      });

      expect(result.current.data.target_interests.length).toBeLessThanOrEqual(20);
    });
  });

  describe("Storage Size Limits", () => {
    it("should not save data larger than 50KB", () => {
      const { result } = renderHook(() => useOnboardingStorage());

      // Try to save a very large logo (base64)
      const hugeData = "A".repeat(60 * 1024); // 60KB

      act(() => {
        result.current.saveData({ logo: hugeData });
      });

      // Should not save - logo should be empty or truncated
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        expect(stored.length).toBeLessThan(60 * 1024);
      }
    });
  });
});
