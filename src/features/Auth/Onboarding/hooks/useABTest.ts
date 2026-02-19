import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Configuração de um experimento A/B
 */
export interface ABTestExperiment {
  /** ID único do experimento */
  id: string;
  /** Nome descritivo */
  name: string;
  /** Variantes disponíveis */
  variants: string[];
  /** Peso de cada variante (deve somar 100) */
  weights?: number[];
  /** Se o experimento está ativo */
  active: boolean;
}

/**
 * Resultado de um experimento
 */
export interface ABTestResult {
  experimentId: string;
  variant: string;
  assignedAt: number;
}

// Chave do localStorage para armazenar atribuições
const STORAGE_KEY = "postnow_ab_tests";

/**
 * Experimentos ativos do onboarding
 */
export const ONBOARDING_EXPERIMENTS: ABTestExperiment[] = [
  {
    id: "onboarding_celebration_intensity",
    name: "Intensidade das celebrações",
    variants: ["subtle", "medium", "full"],
    weights: [33, 34, 33],
    active: true,
  },
  {
    id: "onboarding_preview_position",
    name: "Posição do preview",
    variants: ["right", "bottom", "hidden"],
    weights: [40, 40, 20],
    active: true,
  },
  {
    id: "onboarding_step_count",
    name: "Quantidade de steps",
    variants: ["full", "simplified"],
    weights: [50, 50],
    active: false, // Desativado por padrão
  },
];

/**
 * Obtém ou cria atribuições de experimentos do localStorage
 */
const getStoredAssignments = (): Record<string, ABTestResult> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Salva atribuições no localStorage
 */
const saveAssignments = (assignments: Record<string, ABTestResult>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch {
    // Ignore storage errors
  }
};

/**
 * Seleciona uma variante baseada nos pesos
 */
const selectVariant = (variants: string[], weights?: number[]): string => {
  const normalizedWeights = weights || variants.map(() => 100 / variants.length);

  const random = Math.random() * 100;
  let cumulative = 0;

  for (let i = 0; i < variants.length; i++) {
    cumulative += normalizedWeights[i];
    if (random < cumulative) {
      return variants[i];
    }
  }

  return variants[variants.length - 1];
};

/**
 * Hook para gerenciar experimentos A/B
 *
 * @example
 * const { getVariant, trackConversion } = useABTest();
 *
 * const celebrationVariant = getVariant("onboarding_celebration_intensity");
 * // "subtle" | "medium" | "full"
 *
 * // Quando o usuário completa o onboarding:
 * trackConversion("onboarding_celebration_intensity", "completed");
 */
export const useABTest = () => {
  const [assignments, setAssignments] = useState<Record<string, ABTestResult>>(() =>
    getStoredAssignments()
  );

  // Sincronizar com localStorage
  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  /**
   * Obtém a variante atribuída para um experimento
   * Se não houver atribuição, cria uma nova
   */
  const getVariant = useCallback(
    (experimentId: string): string | null => {
      const experiment = ONBOARDING_EXPERIMENTS.find((e) => e.id === experimentId);

      // Experimento não existe ou não está ativo
      if (!experiment || !experiment.active) {
        return null;
      }

      // Já tem atribuição
      if (assignments[experimentId]) {
        return assignments[experimentId].variant;
      }

      // Criar nova atribuição
      const variant = selectVariant(experiment.variants, experiment.weights);
      const result: ABTestResult = {
        experimentId,
        variant,
        assignedAt: Date.now(),
      };

      setAssignments((prev) => ({
        ...prev,
        [experimentId]: result,
      }));

      return variant;
    },
    [assignments]
  );

  /**
   * Rastreia conversão/evento para analytics
   * Integrar com seu sistema de analytics (Mixpanel, Amplitude, etc)
   */
  const trackConversion = useCallback(
    (experimentId: string, eventName: string, _properties?: Record<string, unknown>) => {
      const assignment = assignments[experimentId];
      if (!assignment) return;

      // TODO: Integrar com analytics
      // const eventData = {
      //   experiment_id: experimentId,
      //   variant: assignment.variant,
      //   event: eventName,
      //   assigned_at: assignment.assignedAt,
      //   ..._properties,
      // };
      // analytics.track("ab_test_conversion", eventData);

      // Log for debugging (remove in production)
      console.debug("AB Test conversion:", experimentId, eventName, assignment.variant);
    },
    [assignments]
  );

  /**
   * Força uma variante específica (útil para testes)
   */
  const forceVariant = useCallback((experimentId: string, variant: string) => {
    const experiment = ONBOARDING_EXPERIMENTS.find((e) => e.id === experimentId);
    if (!experiment || !experiment.variants.includes(variant)) return;

    const result: ABTestResult = {
      experimentId,
      variant,
      assignedAt: Date.now(),
    };

    setAssignments((prev) => ({
      ...prev,
      [experimentId]: result,
    }));
  }, []);

  /**
   * Limpa todas as atribuições (útil para testes)
   */
  const clearAssignments = useCallback(() => {
    setAssignments({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Retorna todas as atribuições atuais
   */
  const getAllAssignments = useMemo(() => assignments, [assignments]);

  return {
    getVariant,
    trackConversion,
    forceVariant,
    clearAssignments,
    assignments: getAllAssignments,
  };
};

/**
 * Hook simplificado para obter variante de um experimento específico
 *
 * @example
 * const variant = useExperimentVariant("onboarding_celebration_intensity");
 */
export const useExperimentVariant = (experimentId: string): string | null => {
  const { getVariant } = useABTest();
  return useMemo(() => getVariant(experimentId), [getVariant, experimentId]);
};
