import { motion, AnimatePresence } from "framer-motion";
import { User, Palette, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useMemo, memo } from "react";

// Cores padrão do onboarding (constante para comparação)
const DEFAULT_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"];
const DEFAULT_COLORS_SORTED = JSON.stringify([...DEFAULT_COLORS].sort());

interface OnboardingPreviewProps {
  data: {
    business_name?: string;
    specialization?: string;
    business_description?: string;
    voice_tone?: string;
    colors?: string[];
    logo?: string;
  };
  currentStep: number;
  className?: string;
}

/**
 * Preview progressivo do perfil sendo construído
 * - Aparece a partir do step 5 (após oferta preenchida)
 * - Expande após step 12 (cores definidas)
 * - Preview completo no step 13
 */
export const OnboardingPreview = memo(({
  data,
  currentStep,
  className,
}: OnboardingPreviewProps) => {
  // Detecta mudanças nos dados para animação de pulse
  const [isPulsing, setIsPulsing] = useState(false);
  const prevDataRef = useRef<string>("");

  // Hash de todos os campos relevantes para detectar mudanças
  const dataHash = useMemo(() => JSON.stringify({
    business_name: data.business_name,
    specialization: data.specialization,
    business_description: data.business_description,
    voice_tone: data.voice_tone,
    colors: data.colors,
    logo: data.logo ? "has_logo" : "", // Não inclui base64 inteiro
  }), [data.business_name, data.specialization, data.business_description, data.voice_tone, data.colors, data.logo]);

  useEffect(() => {
    if (prevDataRef.current && prevDataRef.current !== dataHash) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      return () => clearTimeout(timer);
    }
    prevDataRef.current = dataHash;
  }, [dataHash]);

  // Só mostra a partir do step 5 (consistente com MicroStepLayout)
  if (currentStep < 5) return null;

  const hasBasicInfo = data.business_name && data.specialization;
  const hasDescription = !!data.business_description;
  const hasColors = data.colors && data.colors.length > 0;
  const hasVoiceTone = !!data.voice_tone;
  const hasLogo = !!data.logo;

  // Verifica se cores foram realmente customizadas (não são as padrões)
  const hasColorsCustomized = Boolean(
    hasColors &&
    JSON.stringify([...(data.colors || [])].slice(0, 5).sort()) !== DEFAULT_COLORS_SORTED
  );

  // Determina o nível de expansão
  const isExpanded = currentStep >= 12;
  const isComplete = currentStep >= 13;

  // AnimatePresence é controlado pelo MicroStepLayout, não precisa aqui
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: isPulsing ? 1.02 : 1,
      }}
      transition={{
        duration: isPulsing ? 0.15 : 0.2,
        ease: "easeOut",
      }}
      className={cn(
        "bg-card/80 backdrop-blur-sm border rounded-xl shadow-lg transition-shadow",
        "p-2 sm:p-3", // Padding responsivo
        isComplete && "ring-2 ring-primary/20",
        isPulsing && "shadow-primary/20 shadow-md",
        className
      )}
    >
        {/* Header mini - responsivo */}
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          {hasLogo ? (
            <img
              src={data.logo}
              alt="Logo"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium truncate">
              {data.business_name || "Seu negócio"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {data.specialization || "Seu nicho"}
            </p>
          </div>
        </div>

        {/* Descrição - escondida em telas muito pequenas */}
        {hasDescription && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 mb-1.5 sm:mb-2 hidden min-[320px]:block"
          >
            {data.business_description}
          </motion.p>
        )}

        {/* Seção expandida (após step 12) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-2 border-t"
            >
              {/* Cores (só mostra se customizadas) */}
              {hasColorsCustomized && (
                <div className="flex items-center gap-2">
                  <Palette className="w-3 h-3 text-muted-foreground" />
                  <div className="flex gap-1">
                    {data.colors?.slice(0, 5).map((color, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tom de voz */}
              {hasVoiceTone && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">
                    {data.voice_tone}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de progresso simplificado - dots com tooltips */}
        <div className="flex justify-center gap-1.5 mt-2 pt-2 border-t">
          <ProgressDot filled={!!hasBasicInfo} label="Informações básicas" />
          <ProgressDot filled={hasDescription} label="Descrição" />
          <ProgressDot filled={hasVoiceTone} label="Tom de voz" />
          <ProgressDot filled={hasColorsCustomized} label="Cores personalizadas" />
          <ProgressDot filled={hasLogo} label="Logo" />
        </div>
    </motion.div>
  );
});

OnboardingPreview.displayName = "OnboardingPreview";

const ProgressDot = memo(({ filled, label }: { filled: boolean; label: string }) => (
  <motion.div
    title={`${label}: ${filled ? "✓" : "pendente"}`}
    initial={false}
    animate={{
      backgroundColor: filled ? "hsl(var(--primary))" : "hsl(var(--muted))",
      scale: filled ? 1 : 0.7,
    }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className="w-1.5 h-1.5 rounded-full cursor-help"
  />
));

ProgressDot.displayName = "ProgressDot";
