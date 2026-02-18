import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useOnboardingTracking } from "../useOnboardingTracking";

// Mock the api module
const mockPost = vi.fn();
const mockGetAccessToken = vi.fn();

vi.mock("@/lib/api", () => ({
  api: {
    post: (...args: any[]) => mockPost(...args),
  },
  cookieUtils: {
    getAccessToken: () => mockGetAccessToken(),
  },
}));

const SESSION_STORAGE_KEY = "onboarding_session_id";

describe("useOnboardingTracking", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPost.mockClear();
    mockGetAccessToken.mockClear();
    mockPost.mockResolvedValue({});
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Session ID Management", () => {
    it("should generate a session ID on first use", () => {
      const { result } = renderHook(() => useOnboardingTracking());

      expect(result.current.sessionId).toBeDefined();
      expect(result.current.sessionId).toMatch(/^ob_[a-z0-9]+_[a-z0-9]+$/);
    });

    it("should persist session ID to localStorage", () => {
      renderHook(() => useOnboardingTracking());

      const storedId = localStorage.getItem(SESSION_STORAGE_KEY);
      expect(storedId).toBeDefined();
      expect(storedId).toMatch(/^ob_[a-z0-9]+_[a-z0-9]+$/);
    });

    it("should reuse existing session ID from localStorage", () => {
      const existingId = "ob_existing_session123";
      localStorage.setItem(SESSION_STORAGE_KEY, existingId);

      const { result } = renderHook(() => useOnboardingTracking());

      expect(result.current.sessionId).toBe(existingId);
    });

    it("should return session ID via getSessionId", () => {
      const { result } = renderHook(() => useOnboardingTracking());

      const sessionId = result.current.getSessionId();
      expect(sessionId).toBe(result.current.sessionId);
    });
  });

  describe("trackStepVisit", () => {
    it("should call API with correct payload when authenticated", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/creator-profile/onboarding/track/",
        {
          session_id: result.current.sessionId,
          step_number: 5,
          completed: false,
        }
      );
    });

    it("should not call API when not authenticated", async () => {
      mockGetAccessToken.mockReturnValue(null);

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      expect(mockPost).not.toHaveBeenCalled();
    });

    it("should only track each step once per session", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    it("should track different steps independently", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      await act(async () => {
        await result.current.trackStepVisit(6);
      });

      expect(mockPost).toHaveBeenCalledTimes(2);
    });

    it("should silently handle API errors", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");
      mockPost.mockRejectedValue(new Error("Network error"));
      const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      expect(consoleWarn).toHaveBeenCalled();
      consoleWarn.mockRestore();
    });
  });

  describe("trackStepComplete", () => {
    it("should call API with completed=true when authenticated", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepComplete(5);
      });

      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/creator-profile/onboarding/track/",
        {
          session_id: result.current.sessionId,
          step_number: 5,
          completed: true,
        }
      );
    });

    it("should not call API when not authenticated", async () => {
      mockGetAccessToken.mockReturnValue(null);

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepComplete(5);
      });

      expect(mockPost).not.toHaveBeenCalled();
    });

    it("should allow tracking same step multiple times", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStepComplete(5);
      });

      await act(async () => {
        await result.current.trackStepComplete(5);
      });

      expect(mockPost).toHaveBeenCalledTimes(2);
    });
  });

  describe("trackStep", () => {
    it("should call trackStepVisit when completed is false", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStep(5, false);
      });

      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/creator-profile/onboarding/track/",
        expect.objectContaining({
          step_number: 5,
          completed: false,
        })
      );
    });

    it("should call trackStepComplete when completed is true", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStep(5, true);
      });

      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/creator-profile/onboarding/track/",
        expect.objectContaining({
          step_number: 5,
          completed: true,
        })
      );
    });

    it("should default to visit tracking when completed not specified", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      await act(async () => {
        await result.current.trackStep(5);
      });

      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/creator-profile/onboarding/track/",
        expect.objectContaining({
          completed: false,
        })
      );
    });
  });

  describe("clearTracking", () => {
    it("should remove session ID from localStorage", () => {
      const { result } = renderHook(() => useOnboardingTracking());

      // Ensure session exists
      expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeDefined();

      act(() => {
        result.current.clearTracking();
      });

      expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    });

    it("should generate new session ID after clearing", () => {
      const { result } = renderHook(() => useOnboardingTracking());

      const originalId = result.current.sessionId;

      act(() => {
        result.current.clearTracking();
      });

      // After clearing, the internal ref gets a new ID
      const newId = result.current.getSessionId();
      expect(newId).not.toBe(originalId);
    });

    it("should reset tracked steps allowing re-tracking", async () => {
      mockGetAccessToken.mockReturnValue("valid-token");

      const { result } = renderHook(() => useOnboardingTracking());

      // Track step 5
      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      expect(mockPost).toHaveBeenCalledTimes(1);

      // Clear tracking
      act(() => {
        result.current.clearTracking();
      });

      mockPost.mockClear();

      // Track step 5 again - should work now
      await act(async () => {
        await result.current.trackStepVisit(5);
      });

      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });
});
