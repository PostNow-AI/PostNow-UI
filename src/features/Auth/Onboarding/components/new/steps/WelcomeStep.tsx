import { Button } from "@/components/ui/button";
import { BetaLogo } from "@/components/ui/beta-logo";
import { motion } from "framer-motion";
import { Sparkles, Target, Zap } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  onLogin?: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: "Ideias personalizadas",
    description: "Posts criados especialmente para seu negócio",
  },
  {
    icon: Target,
    title: "Conheça seu público",
    description: "Entenda melhor quem são seus clientes",
  },
  {
    icon: Zap,
    title: "Resultados rápidos",
    description: "Comece a postar em minutos",
  },
];

export const WelcomeStep = ({ onNext, onLogin }: WelcomeStepProps) => {
  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <BetaLogo />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-left mb-6"
          >
            <h1 className="text-2xl font-bold mb-2">
              Vamos construir seu negócio{" "}
              <span className="text-primary">juntos!</span>
            </h1>
            <p className="text-muted-foreground text-base">
              Em poucos minutos, seu perfil estará pronto para receber ideias de
              posts personalizadas.
            </p>
          </motion.div>

          {/* Section title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-sm font-medium text-muted-foreground mb-3"
          >
            O que você vai receber?
          </motion.p>

          {/* Features */}
          <div className="w-full space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-0.5">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-background border-t p-4 pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="max-w-lg mx-auto w-full"
        >
          <Button
            onClick={onNext}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            Começar agora
          </Button>
          {onLogin && (
            <p className="text-center text-sm mt-3">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={onLogin}
                className="text-primary font-medium hover:underline"
              >
                Fazer login
              </button>
            </p>
          )}
        </motion.div>
      </footer>
    </div>
  );
};
