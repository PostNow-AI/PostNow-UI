import { motion, AnimatePresence } from "framer-motion";
import { User, Palette, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

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
 * - Aparece após step 4 (descrição preenchida)
 * - Expande após step 12 (cores definidas)
 * - Preview completo no step 13
 */
export const OnboardingPreview = ({
  data,
  currentStep,
  className,
}: OnboardingPreviewProps) => {
  // Só mostra após step 4
  if (currentStep < 4) return null;

  const hasBasicInfo = data.business_name && data.specialization;
  const hasDescription = !!data.business_description;
  const hasColors = data.colors && data.colors.length > 0;
  const hasVoiceTone = !!data.voice_tone;
  const hasLogo = !!data.logo;

  // Determina o nível de expansão
  const isExpanded = currentStep >= 12;
  const isComplete = currentStep >= 13;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "bg-card/80 backdrop-blur-sm border rounded-xl p-3 shadow-lg",
          isComplete && "ring-2 ring-primary/20",
          className
        )}
      >
        {/* Header mini */}
        <div className="flex items-center gap-2 mb-2">
          {hasLogo ? (
            <img
              src={data.logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {data.business_name || "Seu negócio"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {data.specialization || "Seu nicho"}
            </p>
          </div>
        </div>

        {/* Descrição (aparece após step 4) */}
        {hasDescription && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-xs text-muted-foreground line-clamp-2 mb-2"
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
              {/* Cores */}
              {hasColors && (
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

        {/* Indicador de progresso do preview */}
        <div className="flex gap-1 mt-2 pt-2 border-t">
          <PreviewDot filled={!!hasBasicInfo} label="Info" />
          <PreviewDot filled={hasDescription} label="Descrição" />
          <PreviewDot filled={hasVoiceTone} label="Tom" />
          <PreviewDot filled={!!hasColors} label="Cores" />
          <PreviewDot filled={hasLogo} label="Logo" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const PreviewDot = ({ filled, label }: { filled: boolean; label: string }) => (
  <div className="flex-1 flex flex-col items-center gap-0.5">
    <motion.div
      initial={false}
      animate={{
        backgroundColor: filled ? "hsl(var(--primary))" : "hsl(var(--muted))",
        scale: filled ? 1 : 0.8,
      }}
      className="w-2 h-2 rounded-full"
    />
    <span className="text-[9px] text-muted-foreground">{label}</span>
  </div>
);
