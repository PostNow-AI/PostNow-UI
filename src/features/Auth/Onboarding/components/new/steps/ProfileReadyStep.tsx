import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { OnboardingTempData } from "@/features/Auth/Onboarding/hooks/useOnboardingStorage";
import { nicheOptions } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface ProfileReadyStepProps {
  data: OnboardingTempData;
  onNext: () => void;
  onBack: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

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
    { label: "Localização", value: data.business_location },
    { label: "Personalidade", value: data.brand_personality.slice(0, 3).join(", ") },
    { label: "Tom de voz", value: data.voice_tone },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="text-center pt-12 pb-6 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-2"
        >
          Seu perfil está pronto!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground"
        >
          Confira um resumo do que você configurou
        </motion.p>
      </header>

      {/* Summary */}
      <main className="flex-1 px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto space-y-3"
        >
          {/* Logo */}
          {data.logo && (
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted">
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
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border"
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="font-medium text-right max-w-[60%] truncate">
                {item.value || "-"}
              </span>
            </motion.div>
          ))}

          {/* Colors preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="p-4 rounded-xl bg-muted/50 border"
          >
            <span className="text-sm text-muted-foreground mb-2 block">Suas cores</span>
            <div className="flex gap-2">
              {data.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-8 rounded-lg"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background border-t p-4 pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="max-w-lg mx-auto w-full space-y-3"
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

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar e editar
          </button>
        </motion.div>
      </footer>
    </div>
  );
};
