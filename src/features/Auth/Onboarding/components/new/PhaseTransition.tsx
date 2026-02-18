import { useEffect, useRef, useCallback, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingTempData } from "../../hooks/useOnboardingStorage";
import { audienceToDisplayString, audienceIncomeToString } from "../../utils/audienceUtils";
import { getNicheLabel, getVoiceToneLabel } from "../../utils/labelUtils";

type PhaseType = "negocio" | "publico" | "marca";

interface PhaseTransitionProps {
  phase: PhaseType;
  data: OnboardingTempData;
  onComplete: () => void;
  autoAdvanceMs?: number;
}

interface PhaseConfig {
  title: string;
  summary: (data: OnboardingTempData) => string;
  detail?: (data: OnboardingTempData) => string | null;
  detail2?: (data: OnboardingTempData) => string | null;
  detail3?: (data: OnboardingTempData) => string | null;
  message: string;
  progress: string;
  colors?: (data: OnboardingTempData) => string[] | null;
}

// Limpa "[custom]" dos valores de personalidade
const cleanPersonality = (personalities: string[]): string[] => {
  return personalities
    .filter(p => !p.startsWith("[custom]"))
    .slice(0, 4);
};

const PHASE_CONFIG: Record<PhaseType, PhaseConfig> = {
  negocio: {
    title: "Negócio",
    summary: (data) => {
      const parts = [data.business_name, getNicheLabel(data.specialization)].filter(Boolean);
      return parts.join(" · ") || "Seu negócio";
    },
    detail: (data) => {
      if (!data.business_description) return null;
      // Pega primeira linha/sentença da descrição
      const firstLine = data.business_description.split(/[.\n]/)[0];
      return firstLine.length > 50 ? firstLine.slice(0, 50) + "..." : firstLine;
    },
    detail2: (data) => {
      // Personalidade da marca
      if (data.brand_personality && data.brand_personality.length > 0) {
        const cleaned = cleanPersonality(data.brand_personality);
        if (cleaned.length > 0) {
          return cleaned.join(", ");
        }
      }
      return null;
    },
    message: "Com isso vamos personalizar suas ideias de conteúdo.",
    progress: "1 de 3",
  },
  publico: {
    title: "Público",
    summary: (data) => {
      if (data.target_audience) {
        return audienceToDisplayString(data.target_audience);
      }
      return "Seu público";
    },
    detail: (data) => {
      // Classe social
      if (data.target_audience) {
        return audienceIncomeToString(data.target_audience);
      }
      return null;
    },
    detail2: (data) => {
      // Interesses
      if (data.target_interests && data.target_interests.length > 0) {
        const interests = data.target_interests.slice(0, 4).join(", ");
        return data.target_interests.length > 4
          ? `${interests} +${data.target_interests.length - 4}`
          : interests;
      }
      return null;
    },
    detail3: (data) => data.business_location || null,
    message: "Agora sabemos para quem você quer falar.",
    progress: "2 de 3",
  },
  marca: {
    title: "Marca",
    summary: (data) => {
      if (data.voice_tone) {
        return `Tom: ${getVoiceToneLabel(data.voice_tone)}`;
      }
      return "Sua identidade";
    },
    detail: (data) => {
      // Estilos visuais selecionados
      if (data.visual_style_ids && data.visual_style_ids.length > 0) {
        return `${data.visual_style_ids.length} estilo${data.visual_style_ids.length > 1 ? 's' : ''} visual${data.visual_style_ids.length > 1 ? 'is' : ''}`;
      }
      return null;
    },
    detail2: (data) => {
      // Logo
      if (data.logo) {
        return "Logo adicionado ✓";
      }
      return null;
    },
    message: "Sua identidade visual está definida.",
    progress: "3 de 3",
    colors: (data) => {
      if (data.colors && data.colors.length > 0) {
        return data.colors.slice(0, 5);
      }
      return null;
    },
  },
};

/**
 * Tela de transição exibida ao completar cada fase do onboarding.
 * - Aparece automaticamente
 * - Mostra resumo do que foi coletado
 * - Auto-avança após delay configurável
 * - Permite toque/clique para pular
 */
export const PhaseTransition = memo(({
  phase,
  data,
  onComplete,
  autoAdvanceMs = 3000,
}: PhaseTransitionProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const config = PHASE_CONFIG[phase];

  const summary = useMemo(() => config.summary(data), [config, data]);
  const detail = useMemo(() => config.detail?.(data), [config, data]);
  const detail2 = useMemo(() => config.detail2?.(data), [config, data]);
  const detail3 = useMemo(() => config.detail3?.(data), [config, data]);
  const colors = useMemo(() => config.colors?.(data), [config, data]);

  // Handler para completar transição
  const handleComplete = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onComplete();
  }, [onComplete]);

  // Auto-advance timer
  useEffect(() => {
    timerRef.current = setTimeout(handleComplete, autoAdvanceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoAdvanceMs, handleComplete]);

  // Permitir toque/clique para avançar
  const handleClick = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  // Permitir tecla Enter/Space para avançar
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleComplete();
    }
  }, [handleComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Fase ${config.title} completa. Toque para continuar.`}
    >
      {/* Conteúdo central */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-sm"
      >
        {/* Ícone de check com título */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            {config.title}
          </span>
        </motion.div>

        {/* Resumo dos dados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mb-4 space-y-1"
        >
          <p className="text-xl font-medium text-foreground">
            {summary}
          </p>
          {detail && (
            <p className="text-sm text-muted-foreground">
              {detail}
            </p>
          )}
          {detail2 && (
            <p className="text-sm text-muted-foreground">
              {detail2}
            </p>
          )}
          {detail3 && (
            <p className="text-sm text-primary/80 font-medium">
              📍 {detail3}
            </p>
          )}
        </motion.div>

        {/* Cores (apenas para fase marca) */}
        {colors && colors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex gap-2 mb-4"
          >
            {colors.map((color, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </motion.div>
        )}

        {/* Mensagem de valor */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-muted-foreground text-sm mb-8"
        >
          {config.message}
        </motion.p>

        {/* Barra de progresso animada */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="w-full max-w-[200px]"
        >
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              ref={progressRef}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: autoAdvanceMs / 1000, ease: "linear" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {config.progress}
          </p>
        </motion.div>

        {/* Indicador de toque */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-xs text-muted-foreground mt-6"
        >
          (continuando...)
        </motion.p>
      </motion.div>
    </motion.div>
  );
});

PhaseTransition.displayName = "PhaseTransition";
