import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface MicroStepLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  isValid: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  showBack?: boolean;
  className?: string;
}

export const MicroStepLayout = ({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  isValid,
  isLoading = false,
  nextLabel = "Continuar",
  showBack = true,
  className,
}: MicroStepLayoutProps) => {
  const percentage = (step / totalSteps) * 100;

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {/* Header fixo com progresso */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-4 px-4 py-3">
          {showBack && onBack && step > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <Progress value={percentage} className="h-1.5" />
          </div>
        </div>
      </header>

      {/* Conteúdo principal com animação */}
      <main className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Título e subtítulo */}
            <div className="mb-6 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground text-sm">{subtitle}</p>
              )}
            </div>

            {/* Conteúdo do step */}
            <div className="flex-1">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer fixo com botão de continuar */}
      <footer className="sticky bottom-0 bg-background border-t p-4 pb-safe">
        <div className="max-w-lg mx-auto w-full">
          <Button
            onClick={onNext}
            disabled={!isValid || isLoading}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Carregando...
              </span>
            ) : (
              nextLabel
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};
