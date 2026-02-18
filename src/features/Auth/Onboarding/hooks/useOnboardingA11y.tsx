import { useEffect, useRef, useCallback } from "react";

/**
 * Hook para gerenciar acessibilidade no onboarding
 * - Focus management entre steps
 * - Keyboard navigation
 * - Screen reader announcements
 */
export const useOnboardingA11y = (currentStep: number) => {
  const announcerRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLElement | null>(null);

  /**
   * Anuncia mudanças para screen readers
   */
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (!announcerRef.current) {
      // Criar elemento announcer se não existir
      const announcer = document.createElement("div");
      announcer.setAttribute("role", "status");
      announcer.setAttribute("aria-live", priority);
      announcer.setAttribute("aria-atomic", "true");
      announcer.className = "sr-only";
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    // Limpar e anunciar
    announcerRef.current.textContent = "";
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 100);
  }, []);

  /**
   * Move o foco para o conteúdo principal do step
   */
  const focusMainContent = useCallback(() => {
    // Pequeno delay para garantir que o DOM foi atualizado
    setTimeout(() => {
      // Tentar focar no primeiro elemento focável do step
      const focusableElements = document.querySelectorAll(
        'main input:not([disabled]), main button:not([disabled]), main [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        // Fallback: focar no heading
        const heading = document.querySelector("main h1, main h2");
        if (heading) {
          (heading as HTMLElement).setAttribute("tabindex", "-1");
          (heading as HTMLElement).focus();
        }
      }
    }, 100);
  }, []);

  // Anunciar mudança de step e mover foco
  useEffect(() => {
    if (currentStep > 0) {
      announce(`Etapa ${currentStep} de 16`);
      focusMainContent();
    }
  }, [currentStep, announce, focusMainContent]);

  // Cleanup do announcer
  useEffect(() => {
    return () => {
      if (announcerRef.current) {
        announcerRef.current.remove();
      }
    };
  }, []);

  /**
   * Handler para navegação por teclado
   */
  const handleKeyboardNavigation = useCallback(
    (
      event: React.KeyboardEvent,
      options: {
        onNext?: () => void;
        onBack?: () => void;
        isValid?: boolean;
      }
    ) => {
      const { onNext, onBack, isValid = true } = options;

      // Enter para avançar (se válido)
      if (event.key === "Enter" && !event.shiftKey && isValid && onNext) {
        // Não ativar se estiver em um input de texto (exceto se Ctrl+Enter)
        const target = event.target as HTMLElement;
        if (target.tagName === "INPUT" && target.getAttribute("type") !== "submit") {
          if (!event.ctrlKey) return;
        }
        event.preventDefault();
        onNext();
      }

      // Escape para voltar
      if (event.key === "Escape" && onBack) {
        event.preventDefault();
        onBack();
      }
    },
    []
  );

  /**
   * Props de acessibilidade para o container do step
   */
  const getStepContainerProps = useCallback(
    (stepNumber: number, stepTitle: string) => ({
      role: "region" as const,
      "aria-label": `Etapa ${stepNumber}: ${stepTitle}`,
      "aria-current": "step" as const,
    }),
    []
  );

  /**
   * Props de acessibilidade para a barra de progresso
   */
  const getProgressBarProps = useCallback(
    (current: number, total: number) => ({
      role: "progressbar" as const,
      "aria-valuenow": current,
      "aria-valuemin": 0,
      "aria-valuemax": total,
      "aria-label": `Progresso do onboarding: ${Math.round((current / total) * 100)}%`,
    }),
    []
  );

  /**
   * Props de acessibilidade para botões de navegação
   */
  const getNavigationButtonProps = useCallback(
    (type: "next" | "back", isDisabled: boolean = false) => ({
      "aria-disabled": isDisabled,
      ...(type === "next" && {
        "aria-label": isDisabled ? "Próximo (desabilitado)" : "Ir para próxima etapa",
      }),
      ...(type === "back" && {
        "aria-label": "Voltar para etapa anterior",
      }),
    }),
    []
  );

  return {
    announce,
    focusMainContent,
    handleKeyboardNavigation,
    getStepContainerProps,
    getProgressBarProps,
    getNavigationButtonProps,
    mainContentRef,
  };
};

/**
 * Componente de skip link para pular para o conteúdo principal
 */
export const SkipToContent = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const main = document.querySelector("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      Pular para o conteúdo principal
    </a>
  );
};

/**
 * Estilos CSS para sr-only (screen reader only)
 * Adicionar ao global.css se não existir:
 *
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border-width: 0;
 * }
 */
