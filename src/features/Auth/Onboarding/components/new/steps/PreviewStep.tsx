import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Lightbulb, Palette, Sparkles, Target, TrendingUp } from "lucide-react";
import type { OnboardingTempData } from "@/features/Auth/Onboarding/hooks/useOnboardingStorage";

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
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-2"
        >
          Veja o que preparamos para você
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Com base no perfil de <strong>{data.business_name}</strong>
        </motion.p>
      </header>

      {/* Benefits */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-0.5">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sample post preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-md mx-auto mt-8"
        >
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Exemplo de ideia para hoje
              </span>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">
                "3 dicas de {data.specialization || "seu nicho"} que seu público precisa saber"
              </h4>
              <p className="text-sm text-muted-foreground">
                Carrossel educativo focado em {data.target_audience?.slice(0, 50) || "seu público"}...
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              {data.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="text-xs text-muted-foreground self-center ml-2">
                Suas cores
              </span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background border-t p-4 pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-lg mx-auto w-full space-y-3"
        >
          <Button
            onClick={onNext}
            className="w-full h-12 text-base font-medium gap-2"
            size="lg"
          >
            Criar minha conta
            <ArrowRight className="h-4 w-4" />
          </Button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      </footer>
    </div>
  );
};
