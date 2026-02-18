import { useCallback, useState } from "react";

type PhaseType = "negocio" | "publico" | "marca";

/** Mapeamento de steps finais de cada fase para tipo de fase */
const PHASE_END_STEPS: Record<number, PhaseType> = {
  4: "negocio",   // Step 4 é o último do Negócio
  8: "publico",   // Step 8 é o último do Público
  12: "marca",    // Step 12 é o último da Marca
};

interface UseOnboardingNavigationProps {
  /** Step atual do onboarding */
  currentStep: number;
  /** Função para alterar o step atual */
  setCurrentStep: (step: number) => void;
  /** Se está em modo de edição (não mostra transições de fase) */
  isEditMode: boolean;
}

/**
 * Hook para gerenciar navegação entre steps do onboarding
 *
 * Gerencia:
 * - Navegação direta para qualquer step
 * - Avanço/retorno entre steps
 * - Transições animadas entre fases
 *
 * @example
 * ```tsx
 * const { handleNext, handleBack, showPhaseTransition } = useOnboardingNavigation({
 *   currentStep: data.current_step,
 *   setCurrentStep,
 *   isEditMode: false,
 * });
 * ```
 */
export const useOnboardingNavigation = ({
  currentStep,
  setCurrentStep,
  isEditMode,
}: UseOnboardingNavigationProps) => {
  // Estados para transição de fase
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<PhaseType | null>(null);

  // Navegação direta para um step
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, [setCurrentStep]);

  // Avançar para próximo step
  const handleNext = useCallback(() => {
    // Verificar se está no final de uma fase (só no modo criação)
    const phaseType = PHASE_END_STEPS[currentStep];
    if (!isEditMode && phaseType) {
      setCurrentPhase(phaseType);
      setShowPhaseTransition(true);
    } else {
      goToStep(currentStep + 1);
    }
  }, [currentStep, goToStep, isEditMode]);

  // Voltar para step anterior
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  // Handler para quando a transição de fase terminar
  const handlePhaseTransitionComplete = useCallback(() => {
    setShowPhaseTransition(false);
    setCurrentPhase(null);
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  return {
    showPhaseTransition,
    currentPhase,
    goToStep,
    handleNext,
    handleBack,
    handlePhaseTransitionComplete,
  };
};
