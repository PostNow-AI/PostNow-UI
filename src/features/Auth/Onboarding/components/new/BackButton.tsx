import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "icon" | "text" | "icon-text";
  label?: string;
}

/**
 * Botão de voltar padronizado para o onboarding
 * - variant="icon": apenas ícone (padrão no MicroStepLayout)
 * - variant="text": apenas texto
 * - variant="icon-text": ícone + texto
 */
export const BackButton = ({
  onClick,
  className,
  variant = "text",
  label = "Voltar",
}: BackButtonProps) => {
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "p-2 -ml-2 rounded-full hover:bg-muted transition-colors",
          className
        )}
        aria-label={label}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    );
  }

  if (variant === "icon-text") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        {label}
      </button>
    );
  }

  // variant="text" (default)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
    >
      {label}
    </button>
  );
};
