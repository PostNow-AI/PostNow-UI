import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, Sparkles } from "lucide-react";
import type { OnboardingTempData } from "@/features/Auth/Onboarding/hooks/useOnboardingStorage";
import { nicheOptions, visualStyleOptions, TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { ProgressBarWithPhases } from "../ProgressBarWithPhases";

interface ProfileReadyStepProps {
  data: OnboardingTempData;
  onNext: () => void;
  onBack: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

// Limpa "[custom]" dos valores de personalidade
const cleanPersonality = (personalities: string[]): string => {
  return personalities
    .filter(p => !p.startsWith("[custom]"))
    .slice(0, 3)
    .join(", ");
};

// Parse do JSON de audiência
const parseAudience = (value: string): string => {
  try {
    const parsed = JSON.parse(value);
    const parts: string[] = [];

    // Gênero
    if (parsed.gender?.includes("todos")) {
      parts.push("Todos");
    } else if (parsed.gender?.length > 0) {
      const labels: Record<string, string> = { mulheres: "Mulheres", homens: "Homens" };
      parts.push(parsed.gender.map((g: string) => labels[g] || g).join(" e "));
    }

    // Idade
    if (parsed.ageRange?.includes("todas")) {
      parts.push("todas as idades");
    } else if (parsed.ageRange?.length > 0) {
      parts.push(parsed.ageRange.join(", "));
    }

    // Classe
    if (parsed.incomeLevel?.includes("todas")) {
      parts.push("todas as classes");
    } else if (parsed.incomeLevel?.length > 0) {
      const labels: Record<string, string> = { "classe-a": "A", "classe-b": "B", "classe-c": "C" };
      parts.push("Classe " + parsed.incomeLevel.map((c: string) => labels[c] || c).join("/"));
    }

    return parts.join(", ");
  } catch {
    return value;
  }
};

// Obtém nomes dos estilos visuais selecionados
const getStyleNames = (ids: string[]): string => {
  if (!ids || ids.length === 0) return "";
  const names = ids.slice(0, 2).map(id => {
    const style = visualStyleOptions.find(s => s.id === id);
    return style?.label || id;
  });
  if (ids.length > 2) {
    return `${names.join(", ")} +${ids.length - 2}`;
  }
  return names.join(", ");
};

export const ProfileReadyStep = ({
  data,
  onNext,
  onBack,
  isEditMode = false,
  isLoading = false,
}: ProfileReadyStepProps) => {
  const summaryItems = [
    { label: "Negócio", value: data.business_name },
    { label: "Nicho", value: nicheOptions.find(n => n.id === data.specialization)?.label || data.specialization },
    { label: "Oferta", value: data.business_description ? (data.business_description.length > 40 ? data.business_description.slice(0, 40) + "..." : data.business_description) : null },
    { label: "Público", value: data.target_audience ? parseAudience(data.target_audience) : null },
    { label: "Interesses", value: data.target_interests?.length > 0 ? (data.target_interests.slice(0, 3).join(", ") + (data.target_interests.length > 3 ? ` +${data.target_interests.length - 3}` : "")) : null },
    { label: "Localização", value: data.business_location },
    { label: "Personalidade", value: data.brand_personality?.length > 0 ? cleanPersonality(data.brand_personality) : null },
    { label: "Tom de voz", value: data.voice_tone },
    { label: "Estilos", value: data.visual_style_ids?.length > 0 ? getStyleNames(data.visual_style_ids) : null },
  ].filter(item => item.value);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header com navegação */}
      <header className="shrink-0 bg-background border-b">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <ProgressBarWithPhases
              currentStep={13}
              totalSteps={TOTAL_STEPS}
              showPhaseNames={true}
            />
          </div>
        </div>
      </header>

      {/* Main scrollável com todo o conteúdo */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Conteúdo celebratório */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 mb-3"
            >
              <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold mb-1"
            >
              Seu perfil está pronto!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              Confira um resumo do que você configurou
            </motion.p>
          </div>

          {/* Summary items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
          {/* Logo */}
          {data.logo && (
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 bg-muted">
                <img
                  src={data.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Info cards */}
          {summaryItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border"
            >
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-medium text-sm text-right max-w-[60%] truncate">
                {item.value || "-"}
              </span>
            </motion.div>
          ))}

          {/* Colors preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="p-2.5 rounded-lg bg-muted/50 border"
          >
            <span className="text-xs text-muted-foreground mb-1.5 block">Suas cores</span>
            <div className="flex gap-1.5">
              {data.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-6 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-background border-t p-4 pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-lg mx-auto w-full space-y-2"
        >
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="w-full h-12 text-base font-medium gap-2"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvando...
              </span>
            ) : isEditMode ? (
              "Salvar alterações"
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Ver o que preparamos
              </>
            )}
          </Button>
        </motion.div>
      </footer>
    </div>
  );
};
