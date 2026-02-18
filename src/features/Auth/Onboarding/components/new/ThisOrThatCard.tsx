import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { QuizOption } from "../../constants/personalityQuizData";

interface ThisOrThatCardProps {
  option: QuizOption;
  isSelected: boolean;
  onClick: () => void;
  direction: "left" | "right";
  disabled?: boolean;
}

/**
 * Card de escolha binária para o quiz "This or That"
 *
 * Design:
 * - Frase de exemplo em destaque (itálico, aspas)
 * - Label da característica embaixo (menor, bold)
 * - Estado selecionado: borda primary + glow sutil
 * - Animação de hover/tap
 */
export const ThisOrThatCard = ({
  option,
  isSelected,
  onClick,
  direction,
  disabled = false,
}: ThisOrThatCardProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        opacity: { duration: 0.2 }
      }}
      className={cn(
        "relative flex-1 flex flex-col items-center justify-between p-6 rounded-2xl",
        "border-2 transition-all duration-200",
        "min-h-[200px] text-center",
        isSelected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 ring-2 ring-primary/30"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-pressed={isSelected}
      aria-label={`Selecionar: ${option.label}. Exemplo: ${option.example}`}
    >
      {/* Frase de exemplo - centralizada verticalmente */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl italic text-foreground leading-relaxed">
          "{option.example}"
        </p>
      </div>

      {/* Label da característica */}
      <span className={cn(
        "text-base font-bold uppercase tracking-wider shrink-0 pt-2",
        isSelected ? "text-primary" : "text-muted-foreground"
      )}>
        {option.label}
      </span>

      {/* Indicador de seleção */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};
