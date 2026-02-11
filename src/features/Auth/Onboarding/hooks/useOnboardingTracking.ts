/**
 * useOnboardingTracking Hook
 * Tracks user progress through the 20-step onboarding funnel.
 *
 * Steps are grouped into 5 phases:
 * - Phase 1 (Welcome): 1-3 (Welcome, Business Name, Contact Info)
 * - Phase 2 (Business): 4-8 (Niche, Description, Purpose, Personality, Products)
 * - Phase 3 (Audience): 9-12 (Target Audience, Interests, Location, Competitors)
 * - Phase 4 (Visual): 13-17 (Voice Tone, Visual Style, Logo, Colors, Preview)
 * - Phase 5 (Auth): 18-20 (Profile Ready, Signup, Paywall)
 */

import { useCallback, useRef, useEffect } from "react";
import { api } from "@/lib/api";

const SESSION_STORAGE_KEY = "onboarding_session_id";

/**
 * Generate a unique session ID for tracking
 */
const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `ob_${timestamp}_${randomPart}`;
};

/**
 * Get or create a session ID stored in localStorage
 */
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Clear the session ID (e.g., after completing onboarding)
 */
const clearSessionId = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const useOnboardingTracking = () => {
  const sessionIdRef = useRef<string>(getOrCreateSessionId());
  const trackedStepsRef = useRef<Set<number>>(new Set());

  // Track when a step is visited
  const trackStepVisit = useCallback(async (stepNumber: number) => {
    // Skip if already tracked in this session
    if (trackedStepsRef.current.has(stepNumber)) {
      return;
    }

    try {
      await api.post("/api/v1/creator-profile/onboarding/track/", {
        session_id: sessionIdRef.current,
        step_number: stepNumber,
        completed: false,
      });
      trackedStepsRef.current.add(stepNumber);
    } catch (error) {
      // Silently fail - tracking should not block user flow
      console.warn("[OnboardingTracking] Failed to track step visit:", error);
    }
  }, []);

  // Track when a step is completed (user proceeds to next step)
  const trackStepComplete = useCallback(async (stepNumber: number) => {
    try {
      await api.post("/api/v1/creator-profile/onboarding/track/", {
        session_id: sessionIdRef.current,
        step_number: stepNumber,
        completed: true,
      });
    } catch (error) {
      // Silently fail - tracking should not block user flow
      console.warn("[OnboardingTracking] Failed to track step completion:", error);
    }
  }, []);

  // Track both visit and completion in one call (convenience method)
  const trackStep = useCallback(async (stepNumber: number, completed = false) => {
    if (completed) {
      await trackStepComplete(stepNumber);
    } else {
      await trackStepVisit(stepNumber);
    }
  }, [trackStepVisit, trackStepComplete]);

  // Clear tracking when onboarding is complete
  const clearTracking = useCallback(() => {
    clearSessionId();
    trackedStepsRef.current.clear();
    sessionIdRef.current = generateSessionId();
  }, []);

  // Get current session ID
  const getSessionId = useCallback(() => {
    return sessionIdRef.current;
  }, []);

  return {
    trackStep,
    trackStepVisit,
    trackStepComplete,
    clearTracking,
    getSessionId,
    sessionId: sessionIdRef.current,
  };
};

export default useOnboardingTracking;
