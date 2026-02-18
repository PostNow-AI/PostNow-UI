import confetti from "canvas-confetti";
import { useCallback } from "react";

// Cores da marca PostNow
const BRAND_COLORS = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#7C3AED", "#6D28D9"];

interface CelebrationOptions {
  intensity?: "subtle" | "medium" | "full";
}

export const useCelebration = () => {
  /**
   * Dispara confetti sutil - para completar steps intermediários
   */
  const celebrateSubtle = useCallback(() => {
    confetti({
      particleCount: 25,
      spread: 55,
      origin: { y: 0.7 },
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
      scalar: 0.85,
      gravity: 1.0,
      drift: 0,
      ticks: 180,
    });
  }, []);

  /**
   * Dispara confetti médio - para completar fases importantes
   */
  const celebrateMedium = useCallback(() => {
    const count = 30;
    const defaults = {
      origin: { y: 0.6 },
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
    };

    confetti({
      ...defaults,
      particleCount: count,
      spread: 60,
      scalar: 0.9,
    });

    // Segundo burst com delay
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: count / 2,
        spread: 80,
        scalar: 0.7,
      });
    }, 150);
  }, []);

  /**
   * Dispara confetti completo - para conclusão do onboarding
   */
  const celebrateFull = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
    };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  /**
   * Celebra baseado na intensidade
   */
  const celebrate = useCallback(
    (options: CelebrationOptions = {}) => {
      const { intensity = "subtle" } = options;

      switch (intensity) {
        case "subtle":
          celebrateSubtle();
          break;
        case "medium":
          celebrateMedium();
          break;
        case "full":
          celebrateFull();
          break;
      }
    },
    [celebrateSubtle, celebrateMedium, celebrateFull]
  );

  return {
    celebrate,
    celebrateSubtle,
    celebrateMedium,
    celebrateFull,
  };
};
