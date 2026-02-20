import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Loader2, Palette } from "lucide-react";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS, visualStyleOptions } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { useVisualStylePreferences } from "@/features/Auth/Onboarding/hooks/useVisualStylePreferences";

interface VisualStyleStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface VisualStyle {
  id: number | string;
  name: string;
  description?: string;
  preview_image_url?: string | null;
}

// Opções estáticas como fallback quando a API não está disponível
const fallbackStyles: VisualStyle[] = visualStyleOptions.map((style, index) => ({
  id: index + 1,
  name: style.label,
  description: style.description,
  preview_image_url: style.preview_image_url,
}));

export const VisualStyleStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: VisualStyleStepProps) => {
  const { visualStylePreferences, isLoading, isError } = useVisualStylePreferences();
  const isValid = value.length > 0;

  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  if (isLoading && !isError) {
    return (
      <MicroStepLayout
        step={14}
        totalSteps={TOTAL_STEPS}
        title="Escolha seu estilo visual"
        subtitle="Carregando opções..."
        onNext={onNext}
        onBack={onBack}
        isValid={false}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MicroStepLayout>
    );
  }

  // Usar opções da API se disponíveis, senão usar fallback estático
  const apiStyles: VisualStyle[] | undefined = visualStylePreferences?.map(pref => ({
    id: pref.id,
    name: pref.name,
    description: pref.description,
    preview_image_url: pref.preview_image_url,
  }));

  const preferences: VisualStyle[] = apiStyles ?? fallbackStyles;

  return (
    <MicroStepLayout
      step={14}
      totalSteps={TOTAL_STEPS}
      title="Escolha seu estilo visual"
      subtitle="Selecione os estilos que combinam com sua marca."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      {/* Container com cards grandes */}
      <div className="space-y-4">
        {preferences.map((style, index) => {
          const styleId = style.id.toString();
          const isSelected = value.includes(styleId);

          return (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "cursor-pointer transition-all rounded-2xl overflow-hidden",
                isSelected
                  ? "ring-4 ring-primary ring-offset-2"
                  : "ring-2 ring-border hover:ring-primary/50"
              )}
              onClick={() => handleToggle(styleId)}
            >
              {/* Imagem no formato Instagram post (4:5 - 1080x1350px) */}
              <div className="aspect-[4/5] relative">
                {style.preview_image_url ? (
                  <img
                    src={style.preview_image_url}
                    alt={style.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <Palette className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}

                {/* Checkbox grande no canto */}
                <div className="absolute top-4 left-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-lg",
                      isSelected
                        ? "bg-primary"
                        : "bg-white/90 backdrop-blur-sm border-2 border-border"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Nome e descrição embaixo com gradiente */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                  <p className="font-bold text-lg text-white drop-shadow-lg">
                    {style.name}
                  </p>
                  {style.description && (
                    <p className="text-sm text-white/80 mt-1 line-clamp-2">
                      {style.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {preferences.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhum estilo visual disponível no momento.
          </p>
        )}
      </div>

      {/* Contador fixo */}
      <div className="text-center text-sm text-muted-foreground mt-4 pt-4 border-t">
        {value.length > 0
          ? `✓ ${value.length} estilo${value.length > 1 ? "s" : ""} selecionado${value.length > 1 ? "s" : ""}`
          : "Selecione pelo menos 1 estilo"
        }
      </div>
    </MicroStepLayout>
  );
};
