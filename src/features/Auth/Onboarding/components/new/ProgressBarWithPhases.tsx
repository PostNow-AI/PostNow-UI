import { memo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Phase {
  name: string;
  shortName: string;
  steps: number[];
  position: number; // Posição do marcador na barra (0-100%)
}

// 3 fases do onboarding (baseado em PHASE_END_STEPS do OnboardingNew.tsx)
// - Negócio: steps 1-4 (completa após step 4, ou seja, quando currentStep >= 5)
// - Público: steps 5-8 (completa após step 8, ou seja, quando currentStep >= 9)
// - Marca: steps 9-12 (completa após step 12, ou seja, quando currentStep >= 13)
const PHASES: Phase[] = [
  { name: "Negócio", shortName: "Neg", steps: [1, 2, 3, 4], position: 33 },
  { name: "Público", shortName: "Púb", steps: [5, 6, 7, 8], position: 66 },
  { name: "Marca", shortName: "Mar", steps: [9, 10, 11, 12], position: 100 },
];

// Total de steps do onboarding (até Cores = step 12)
const TOTAL_ONBOARDING_STEPS = 12;

interface ProgressBarWithPhasesProps {
  currentStep: number;
  totalSteps: number;
  showPhaseNames?: boolean;
  className?: string;
}

export const ProgressBarWithPhases = memo(({
  currentStep,
  totalSteps: _totalSteps,
  showPhaseNames = true,
  className,
}: ProgressBarWithPhasesProps) => {
  const prevStepRef = useRef(currentStep);
  const [recentlyCompletedPhase, setRecentlyCompletedPhase] = useState<string | null>(null);

  // Calcula a porcentagem da barra baseado no step atual
  // A barra preenche ATÉ o marcador da fase atual
  const getProgressPercentage = (step: number): number => {
    if (step <= 0) return 0;
    if (step >= TOTAL_ONBOARDING_STEPS) return 100;

    // Steps 1-4 (Negócio): progresso de 0% a 33%
    if (step <= 4) {
      const progressInPhase = step / 4; // 0.25 to 1
      return progressInPhase * 33; // 8.25% to 33%
    }

    // Steps 5-8 (Público): progresso de 33% a 66%
    if (step <= 8) {
      const progressInPhase = (step - 4) / 4; // 0.25 to 1
      return 33 + progressInPhase * 33; // ~41% to 66%
    }

    // Steps 9-12 (Marca): progresso de 66% a 100%
    const progressInPhase = (step - 8) / 4; // 0.25 to 1
    return 66 + progressInPhase * 34; // ~74.5% to 100%
  };

  const percentage = getProgressPercentage(currentStep);
  const prevPercentage = getProgressPercentage(currentStep - 1);

  // Estado do círculo de uma fase
  const getPhaseState = (phase: Phase): "complete" | "active" | "inactive" => {
    const lastStepOfPhase = Math.max(...phase.steps);
    const firstStepOfPhase = Math.min(...phase.steps);

    // Completa: passou do último step da fase
    if (currentStep > lastStepOfPhase) return "complete";

    // Ativa: está em algum step da fase
    if (currentStep >= firstStepOfPhase && currentStep <= lastStepOfPhase) return "active";

    // Inativa: ainda não chegou na fase
    return "inactive";
  };

  // Detecta quando uma fase foi recém-completada
  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      for (const phase of PHASES) {
        const lastStepOfPhase = Math.max(...phase.steps);
        const wasInPhase = phase.steps.includes(prevStepRef.current);
        const justCompleted = wasInPhase && currentStep > lastStepOfPhase;

        if (justCompleted) {
          setRecentlyCompletedPhase(phase.name);
          const timer = setTimeout(() => setRecentlyCompletedPhase(null), 1500);
          prevStepRef.current = currentStep;
          return () => clearTimeout(timer);
        }
      }
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);

  return (
    <div className={cn("w-full relative pr-4", className)}>
      {/* Barra de fundo - pr-4 para dar espaço ao texto "Marca" */}
      <div className="relative h-2 bg-muted rounded-full overflow-visible">
        {/* Barra de progresso preenchida */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: `${Math.max(0, prevPercentage)}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Marcadores de fase */}
        {PHASES.map((phase) => {
          const state = getPhaseState(phase);
          const isRecentlyCompleted = recentlyCompletedPhase === phase.name;

          return (
            <div
              key={phase.name}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${phase.position}%` }}
            >
              {/* Marcador circular */}
              <motion.div
                initial={false}
                animate={{
                  scale: state === "active" ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative"
              >
                {/* Glow animation quando fase é recém-completada */}
                <AnimatePresence>
                  {isRecentlyCompleted && (
                    <>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [1, 1.8, 2.2], opacity: [0.6, 0.3, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-primary"
                        style={{ zIndex: -1 }}
                      />
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [1, 1.5, 1.8], opacity: [0.4, 0.2, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                        className="absolute inset-0 rounded-full bg-primary"
                        style={{ zIndex: -1 }}
                      />
                    </>
                  )}
                </AnimatePresence>

                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    state === "complete" && "bg-primary border-primary text-primary-foreground",
                    state === "active" && "bg-background border-primary",
                    state === "inactive" && "bg-muted border-muted-foreground/30"
                  )}
                >
                  {state === "complete" && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Label da fase */}
              {showPhaseNames && (
                <>
                  {/* Nome completo em telas >= 360px */}
                  <span
                    className={cn(
                      "absolute top-6 text-[10px] font-medium whitespace-nowrap transition-colors duration-300 hidden min-[360px]:block",
                      state === "complete" && "text-primary",
                      state === "active" && "text-foreground",
                      state === "inactive" && "text-muted-foreground"
                    )}
                  >
                    {phase.name}
                  </span>
                  {/* Nome curto em telas < 360px */}
                  <span
                    className={cn(
                      "absolute top-6 text-[9px] font-medium whitespace-nowrap transition-colors duration-300 min-[360px]:hidden",
                      state === "complete" && "text-primary",
                      state === "active" && "text-foreground",
                      state === "inactive" && "text-muted-foreground"
                    )}
                  >
                    {phase.shortName}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Espaço para os labels abaixo da barra */}
      {showPhaseNames && <div className="h-4" />}
    </div>
  );
});

ProgressBarWithPhases.displayName = "ProgressBarWithPhases";

/**
 * Hook para obter informações da fase atual
 */
export const usePhaseInfo = (currentStep: number) => {
  const getCurrentPhase = () => {
    for (let i = 0; i < PHASES.length; i++) {
      if (PHASES[i].steps.includes(currentStep)) {
        return { index: i, ...PHASES[i] };
      }
    }
    return { index: PHASES.length - 1, ...PHASES[PHASES.length - 1] };
  };

  const phase = getCurrentPhase();
  const isLastStepOfPhase = currentStep === Math.max(...phase.steps);
  const isFirstStepOfPhase = currentStep === Math.min(...phase.steps);

  return {
    phaseName: phase.name,
    phaseIndex: phase.index,
    isLastStepOfPhase,
    isFirstStepOfPhase,
    totalPhases: PHASES.length,
  };
};
