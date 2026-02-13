import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Clock, CreditCard, Shield, Star, Zap } from "lucide-react";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: number;
  pricePerMonth: number;
  interval: "month" | "year";
  badge?: string;
  savings?: string;
  recommended?: boolean;
}

interface PaywallScreenProps {
  trialDays: number;
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
  onLogin?: () => void;
  isLoading?: boolean;
}

const features = [
  "Ideias de posts personalizadas diariamente",
  "Criador de carrosséis com IA",
  "Análise de concorrentes",
  "Suporte prioritário",
  "Cancele quando quiser",
];

export const PaywallScreen = ({
  trialDays,
  plans,
  onSelectPlan,
  onLogin,
  isLoading = false,
}: PaywallScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans.find((p) => p.recommended)?.id || plans[0]?.id || ""
  );

  const handleContinue = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan);
    }
  };

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
          <Zap className="h-8 w-8 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-2"
        >
          Seu perfil está pronto!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Comece <span className="font-semibold text-primary">GRÁTIS</span> por {trialDays} dias
        </motion.p>
      </header>

      {/* Timeline do trial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-4 mb-6 p-4 rounded-xl bg-muted/50 border"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium">Hoje</p>
              <p className="text-xs text-muted-foreground">R$ 0,00</p>
            </div>
          </div>

          <div className="flex-1 h-px bg-border mx-3" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium">Dia {trialDays - 3}</p>
              <p className="text-xs text-muted-foreground">Lembrete</p>
            </div>
          </div>

          <div className="flex-1 h-px bg-border mx-3" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Dia {trialDays}</p>
              <p className="text-xs text-muted-foreground">Cobrança</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Planos */}
      <div className="flex-1 px-4 space-y-3">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.button
              key={plan.id}
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "relative w-full p-4 rounded-xl border-2 text-left transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-lg">{plan.name}</span>
                  {plan.savings && (
                    <span className="ml-2 text-sm text-primary font-medium">
                      {plan.savings}
                    </span>
                  )}
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full bg-primary-foreground"
                    />
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  R$ {plan.pricePerMonth.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-muted-foreground text-sm">/mês</span>
              </div>

              {plan.interval === "year" && (
                <p className="text-sm text-muted-foreground mt-1">
                  R$ {plan.price.toFixed(2).replace(".", ",")}/ano
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-4 py-6"
      >
        <div className="space-y-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="flex items-center gap-2 text-sm"
            >
              <Check className="h-4 w-4 text-primary shrink-0" />
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background border-t p-4 pb-safe space-y-3">
        <Button
          onClick={handleContinue}
          disabled={!selectedPlan || isLoading}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processando...
            </span>
          ) : (
            <>
              Começar teste grátis
              <span className="ml-1 text-primary-foreground/70">• R$ 0,00 hoje</span>
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5" />
            Pagamento seguro
          </span>
          <span>•</span>
          <span>Cancele quando quiser</span>
        </div>

        {onLogin && (
          <button
            type="button"
            onClick={onLogin}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Já tem assinatura? <span className="text-primary font-medium">Entrar</span>
          </button>
        )}
      </footer>
    </div>
  );
};
