import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "postnow_onboarding_data";

export interface OnboardingPreviewData {
  business_name?: string;
  specialization?: string;
  business_description?: string;
  voice_tone?: string;
  colors?: string[];
  logo?: string;
}

const getPreviewData = (): OnboardingPreviewData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return {};
};

/**
 * Hook reativo que monitora mudanças nos dados do onboarding
 * Atualiza automaticamente quando o localStorage muda
 * @param enabled - Se false, não faz polling (otimização para steps iniciais)
 */
export const useOnboardingPreviewData = (enabled: boolean = true) => {
  const [data, setData] = useState<OnboardingPreviewData>(getPreviewData);

  const refresh = useCallback(() => {
    setData(getPreviewData());
  }, []);

  useEffect(() => {
    // Se desabilitado, não faz nada
    if (!enabled) return;

    // Evento 'storage' só dispara em outras abas
    // Para a mesma aba, usamos polling leve
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        refresh();
      }
    };

    // Polling a cada 300ms para capturar mudanças na mesma aba
    // Otimizado: só atualiza se houver diferença real
    let lastValue = localStorage.getItem(STORAGE_KEY);
    const interval = setInterval(() => {
      const currentValue = localStorage.getItem(STORAGE_KEY);
      if (currentValue !== lastValue) {
        lastValue = currentValue;
        refresh();
      }
    }, 300);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [refresh, enabled]);

  return data;
};
