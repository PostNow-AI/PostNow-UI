import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useCallback, memo, useMemo } from "react";
import { ProgressBarWithPhases } from "./ProgressBarWithPhases";
import { useOnboardingA11y } from "../../hooks/useOnboardingA11y";

// Seletor para elementos focáveis
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'a[href]',
].join(',');

interface MicroStepLayoutProps {
  /** Número do step atual (1-indexed) */
  step: number;
  /** Total de steps no fluxo */
  totalSteps: number;
  /** Título principal do step */
  title: string;
  /** Subtítulo/descrição opcional */
  subtitle?: string;
  /** Componente para exibir à direita do título */
  titleRight?: ReactNode;
  /** Conteúdo do step */
  children: ReactNode;
  /** Handler para avançar ao próximo step */
  onNext: () => void;
  /** Handler para voltar ao step anterior */
  onBack?: () => void;
  /** Se o step está válido (habilita botão de continuar) */
  isValid: boolean;
  /** Se está carregando (mostra spinner no botão) */
  isLoading?: boolean;
  /** Label do botão de ação (default: "Continuar") */
  nextLabel?: string;
  /** Se mostra botão de voltar (default: true) */
  showBack?: boolean;
  /** Classes CSS adicionais */
  className?: string;
  /** Usa barra de progresso com fases e checkmarks */
  showPhases?: boolean;
  /** Componente de preview customizado para mostrar no header */
  preview?: ReactNode;
}

/**
 * Layout base para micro-steps do onboarding
 *
 * Características:
 * - Header com progresso e botão voltar
 * - Área de conteúdo animada
 * - Footer fixo com botão de ação
 * - Focus trap para acessibilidade
 * - Suporte a atalhos de teclado (Ctrl+Enter, Escape)
 * - Anúncios para screen readers
 *
 * @example
 * ```tsx
 * <MicroStepLayout
 *   step={3}
 *   totalSteps={12}
 *   title="Qual seu nicho?"
 *   subtitle="Selecione sua área de atuação"
 *   onNext={handleNext}
 *   onBack={handleBack}
 *   isValid={selectedNiche !== ''}
 * >
 *   <NicheSelector value={selectedNiche} onChange={setSelectedNiche} />
 * </MicroStepLayout>
 * ```
 */
export const MicroStepLayout = memo(({
  step,
  totalSteps,
  title,
  subtitle,
  titleRight,
  children,
  onNext,
  onBack,
  isValid,
  isLoading = false,
  nextLabel = "Continuar",
  showBack = true,
  className,
  showPhases = true,
  preview,
}: MicroStepLayoutProps) => {
  const percentage = (step / totalSteps) * 100;
  const mainRef = useRef<HTMLElement>(null);
  const previousStepRef = useRef(step);

  // Hook de acessibilidade para anúncios de screen reader
  const { announce, getProgressBarProps } = useOnboardingA11y(step);

  // Focus management: mover foco para o conteúdo quando step muda
  useEffect(() => {
    if (step !== previousStepRef.current) {
      previousStepRef.current = step;

      // Anunciar mudança de step para screen readers
      announce(`Etapa ${step} de ${totalSteps}: ${title}`);

      // Pequeno delay para garantir que animação iniciou
      const timer = setTimeout(() => {
        if (mainRef.current) {
          // Tentar focar no primeiro input
          const firstInput = mainRef.current.querySelector(
            'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement | null;
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [step, totalSteps, title, announce]);

  // Ref para o container principal (usado no focus trap)
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation com focus trap
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Ctrl+Enter ou Cmd+Enter para avançar
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && isValid && !isLoading) {
        event.preventDefault();
        onNext();
      }
      // Escape para voltar
      if (event.key === "Escape" && onBack && step > 1) {
        event.preventDefault();
        onBack();
      }
      // Focus trap: Tab deve manter foco dentro do layout
      if (event.key === "Tab" && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift+Tab no primeiro elemento -> vai para o último
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        // Tab no último elemento -> volta para o primeiro
        else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isValid, isLoading, onNext, onBack, step]
  );

  return (
    <div
      ref={containerRef}
      className={cn("h-[100dvh] flex flex-col bg-background overflow-hidden", className)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`Etapa ${step} de ${totalSteps}: ${title}`}
    >
      {/* Header fixo com progresso */}
      <header className="shrink-0 bg-background border-b">
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
            {showPhases ? (
              <ProgressBarWithPhases
                currentStep={step}
                totalSteps={totalSteps}
                showPhaseNames={true}
              />
            ) : (
              <Progress
                value={percentage}
                className="h-1.5"
                {...getProgressBarProps(step, totalSteps)}
              />
            )}
          </div>
        </div>
        {/* Preview customizado (opcional) */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="px-4 pb-3"
            >
              {preview}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Conteúdo principal com animação */}
      <main
        ref={mainRef}
        id="main-content"
        className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Título e subtítulo */}
            <div className="mb-4 space-y-1 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                {titleRight}
              </div>
              {subtitle && (
                <p className="text-muted-foreground text-sm">{subtitle}</p>
              )}
            </div>

            {/* Conteúdo do step */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer fixo com botão de continuar */}
      <footer className="shrink-0 bg-background border-t p-4 pb-safe">
        <div className="max-w-lg mx-auto w-full">
          <Button
            onClick={onNext}
            disabled={!isValid || isLoading}
            className="w-full h-12 text-base font-medium"
            size="lg"
            aria-label={isValid ? `${nextLabel} - Ir para etapa ${step + 1}` : `${nextLabel} - Preencha os campos obrigatórios`}
            aria-disabled={!isValid || isLoading}
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
});

MicroStepLayout.displayName = "MicroStepLayout";
