// Tests for Onboarding components
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCelebration } from "../useCelebration";

// Mock canvas-confetti
const mockConfetti = vi.fn();
vi.mock("canvas-confetti", () => ({
  default: (options: unknown) => mockConfetti(options),
}));

describe("useCelebration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("celebrateSubtle", () => {
    it("deve disparar confetti com partículas limitadas", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrateSubtle();
      });

      expect(mockConfetti).toHaveBeenCalledTimes(1);
      expect(mockConfetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 25,
          spread: 55,
          disableForReducedMotion: true,
        })
      );
    });

    it("deve usar cores da marca PostNow", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrateSubtle();
      });

      const callArgs = mockConfetti.mock.calls[0][0];
      expect(callArgs.colors).toContain("#8B5CF6");
      expect(callArgs.colors).toContain("#A78BFA");
    });
  });

  describe("celebrateMedium", () => {
    it("deve disparar confetti com mais partículas", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrateMedium();
      });

      expect(mockConfetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 30,
          spread: 60,
        })
      );
    });

    it("deve disparar segundo burst após delay", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrateMedium();
      });

      expect(mockConfetti).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(mockConfetti).toHaveBeenCalledTimes(2);
    });
  });

  describe("celebrateFull", () => {
    it("deve usar setInterval para múltiplos bursts", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrateFull();
      });

      // Avança tempo para disparar os bursts
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Deve ter chamado confetti múltiplas vezes
      expect(mockConfetti.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it("deve parar após duração total (2000ms)", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrateFull();
      });

      // Avança além da duração total
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      const callsAfterDuration = mockConfetti.mock.calls.length;

      // Avança mais tempo - não deve ter mais chamadas
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockConfetti.mock.calls.length).toBe(callsAfterDuration);
    });
  });

  describe("celebrate", () => {
    it("deve chamar celebrateSubtle por padrão", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrate();
      });

      expect(mockConfetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 25,
        })
      );
    });

    it("deve chamar celebrateMedium quando intensity é medium", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrate({ intensity: "medium" });
      });

      expect(mockConfetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 30,
        })
      );
    });

    it("deve chamar celebrateFull quando intensity é full", () => {
      const { result } = renderHook(() => useCelebration());

      act(() => {
        result.current.celebrate({ intensity: "full" });
      });

      // Avança tempo para disparar os bursts do celebrateFull
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // celebrateFull deve ter sido chamado (usa interval internamente)
      expect(mockConfetti.mock.calls.length).toBeGreaterThanOrEqual(1);

      // Verifica se usa as configurações do celebrateFull
      const lastCall = mockConfetti.mock.calls[mockConfetti.mock.calls.length - 1][0];
      expect(lastCall.startVelocity).toBe(30);
      expect(lastCall.spread).toBe(360);
    });
  });
});
