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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <BetaLogo />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-left mb-8"
          >
            <h1 className="text-3xl font-bold mb-3">
              Vamos construir seu negócio{" "}
              <span className="text-primary">juntos!</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Em poucos minutos, seu perfil estará pronto para receber ideias de
              posts personalizadas.
            </p>
          </motion.div>

          {/* Section title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-sm font-medium text-muted-foreground mb-4"
          >
            O que você vai receber?
          </motion.p>

          {/* Features */}
          <div className="w-full space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background border-t p-4 pb-safe">
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
          <p className="text-center text-xs text-muted-foreground mt-3">
            Leva menos de 3 minutos
          </p>
          {onLogin && (
            <p className="text-center text-sm mt-4">
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
