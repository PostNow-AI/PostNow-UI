import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * Indicador de progresso simplificado para telas de autenticação
 * Mostra que o usuário está nas etapas finais do onboarding
 */
export const AuthProgressIndicator = ({
  currentStep,
  totalSteps,
  className,
}: AuthProgressIndicatorProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Texto indicador */}
      <p className="text-xs text-muted-foreground text-center mb-2">
        Etapa {currentStep} de {totalSteps}
      </p>

      {/* Barra de progresso */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
