import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, ChevronLeft, Lightbulb, Palette, Sparkles, Target, TrendingUp } from "lucide-react";
import type { OnboardingTempData } from "@/features/Auth/Onboarding/hooks/useOnboardingStorage";
import { usePreviewIdeas } from "@/features/Auth/Onboarding/hooks/usePreviewIdeas";
import { ProgressBarWithPhases } from "../ProgressBarWithPhases";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface PreviewStepProps {
  data: OnboardingTempData;
  onNext: () => void;
  onBack: () => void;
}

const benefits = [
  {
    icon: Lightbulb,
    title: "Ideias diárias",
    description: "Posts personalizados baseados no seu perfil",
  },
  {
    icon: Target,
    title: "Conteúdo estratégico",
    description: "Focado no seu público-alvo",
  },
  {
    icon: Palette,
    title: "Visual alinhado",
    description: "Usando suas cores e estilo",
  },
  {
    icon: TrendingUp,
    title: "Tendências",
    description: "Conteúdo atualizado com o mercado",
  },
];

export const PreviewStep = ({
  data,
  onNext,
  onBack,
}: PreviewStepProps) => {
  // Gerar ideias dinâmicas baseadas nos dados
  const ideas = usePreviewIdeas(data);

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
              currentStep={14}
              totalSteps={TOTAL_STEPS}
              showPhaseNames={true}
            />
          </div>
        </div>
      </header>

      {/* Main scrollável com todo o conteúdo */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Header celebratório */}
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold mb-1"
            >
              Veja o que preparamos para você
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground"
            >
              Com base no perfil de <strong>{data.business_name}</strong>
            </motion.p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-0.5">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dynamic ideas preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Ideias personalizadas para você
              </span>
            </div>

            {/* Lista de ideias dinâmicas */}
            <div className="space-y-2">
              {ideas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-2.5 rounded-md bg-muted/50 border border-transparent hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 w-6 h-6 rounded flex items-center justify-center bg-primary/10 text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight">
                        {idea.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {idea.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cores da marca */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t">
              {data.colors.slice(0, 5).map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">
                Suas cores
              </span>
            </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-background border-t p-4 pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-lg mx-auto w-full space-y-2"
        >
          <Button
            onClick={onNext}
            className="w-full h-12 text-base font-medium gap-2"
            size="lg"
          >
            Criar minha conta
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </footer>
    </div>
  );
};
