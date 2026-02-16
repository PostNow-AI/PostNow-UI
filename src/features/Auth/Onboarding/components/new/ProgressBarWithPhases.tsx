import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Phase {
  name: string;
  steps: number[];
}

// Fases do onboarding com seus steps
const PHASES: Phase[] = [
  { name: "Negócio", steps: [1, 2, 3, 4] },
  { name: "Público", steps: [5, 6, 7, 8] },
  { name: "Marca", steps: [9, 10, 11, 12] },
  { name: "Finalizar", steps: [13, 14] },
];

interface ProgressBarWithPhasesProps {
  currentStep: number;
  totalSteps: number;
  showPhaseNames?: boolean;
  className?: string;
}

export const ProgressBarWithPhases = ({
  currentStep,
  totalSteps,
  showPhaseNames = false,
  className,
}: ProgressBarWithPhasesProps) => {
  const percentage = (currentStep / totalSteps) * 100;

  // Determina qual fase está ativa e quais estão completas
  const getCurrentPhaseIndex = () => {
    for (let i = 0; i < PHASES.length; i++) {
      if (PHASES[i].steps.includes(currentStep)) {
        return i;
      }
    }
    return PHASES.length - 1;
  };

  const currentPhaseIndex = getCurrentPhaseIndex();

  const isPhaseComplete = (phaseIndex: number) => {
    const phase = PHASES[phaseIndex];
    const lastStepOfPhase = Math.max(...phase.steps);
    return currentStep > lastStepOfPhase;
  };

  const isPhaseActive = (phaseIndex: number) => {
    return phaseIndex === currentPhaseIndex;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Barra de progresso principal */}
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Indicadores de fase */}
      <div className="flex justify-between mt-2">
        {PHASES.map((phase, index) => {
          const complete = isPhaseComplete(index);
          const active = isPhaseActive(index);

          return (
            <div
              key={phase.name}
              className="flex flex-col items-center gap-1"
            >
              {/* Círculo/Checkmark */}
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.1 : 1,
                  backgroundColor: complete
                    ? "hsl(var(--primary))"
                    : active
                    ? "hsl(var(--primary) / 0.2)"
                    : "hsl(var(--muted))",
                }}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                  complete && "text-primary-foreground",
                  active && "ring-2 ring-primary/30"
                )}
              >
                {complete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3 h-3" />
                  </motion.div>
                ) : (
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Nome da fase (opcional) */}
              {showPhaseNames && (
                <span
                  className={cn(
                    "text-[10px] transition-colors",
                    complete || active
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {phase.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
