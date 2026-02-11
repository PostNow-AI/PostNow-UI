import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, ChevronLeft, Crown, Lock, Sparkles } from "lucide-react";
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

interface PaywallFlowProps {
  trialDays: number;
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

// Calcula a data futura
const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// === TELA 1: Introdução ao Trial ===
const TrialIntroScreen = ({
  trialDays,
  selectedPlan,
  onContinue,
}: {
  trialDays: number;
  selectedPlan: Plan;
  onContinue: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-full pb-52"
    >
      {/* Título */}
      <div className="text-center pt-8 px-6">
        <h1 className="text-2xl font-bold leading-tight">
          Queremos que você
          <br />
          experimente o{" "}
          <span className="text-primary">PostNow</span> de graça.
        </h1>
      </div>

      {/* Subtítulo */}
      <p className="text-center text-muted-foreground px-6 mt-2">
        E-mail diário personalizado da sua marca
      </p>

      {/* Preview do Email - Mockup estilizado */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
          {/* Header do email */}
          <div className="bg-zinc-950 px-4 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">
                <span className="text-primary">Post</span>
                <span className="text-white">now</span>
              </span>
            </div>
            <p className="text-white text-sm">
              Chegaram suas ideias para
            </p>
            <p className="text-sm">
              <span className="text-white">os posts de </span>
              <span className="text-primary font-semibold">hoje</span>
              <span className="text-white">! 🎉</span>
            </p>
          </div>

          {/* Conteúdo do email */}
          <div className="bg-zinc-900 px-4 py-4">
            {/* Seção de ideia */}
            <div className="mb-3">
              <p className="text-primary font-semibold text-sm mb-1">Ideia para feed</p>
              <p className="text-zinc-400 text-xs">
                Copie a legenda e baixe a imagem para colocar no Instagram.
              </p>
            </div>

            {/* Card de post mockup */}
            <div className="bg-zinc-800 rounded-xl overflow-hidden">
              {/* Imagem de exemplo */}
              <div className="aspect-square relative overflow-hidden">
                {/* Imagem de fundo */}
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
                  alt="Exemplo de post"
                  className="w-full h-full object-cover"
                />
                {/* Overlay com texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-lg leading-tight uppercase">
                    Sua Marca
                  </p>
                  <p className="text-white font-bold text-sm uppercase">
                    de Alto Padrão
                  </p>
                  <p className="text-zinc-300 text-xs mt-1">
                    Conteúdo personalizado para seu público.
                  </p>
                  {/* Barra de progresso decorativa */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-primary rounded-full" />
                    </div>
                    <span className="text-zinc-400 text-[10px]">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixo na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-background px-6 pb-8 pt-4 space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Nenhum pagamento agora</span>
        </div>

        <Button
          onClick={onContinue}
          className="w-full h-14 text-base font-semibold"
          size="lg"
        >
          Teste por R$ 0,00
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Apenas R$ {selectedPlan.price.toFixed(2).replace(".", ",")} por{" "}
          {selectedPlan.interval === "year" ? "ano" : "mês"} (R${" "}
          {selectedPlan.pricePerMonth.toFixed(2).replace(".", ",")}/mês)
        </p>
      </div>
    </motion.div>
  );
};

// === TELA 2: Lembrete antes de cobrar ===
const ReminderScreen = ({
  trialDays,
  selectedPlan,
  onContinue,
  onBack,
}: {
  trialDays: number;
  selectedPlan: Plan;
  onContinue: () => void;
  onBack: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-full pb-52"
    >
      {/* Header com botão voltar */}
      <div className="flex items-center px-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Conteúdo central */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-center leading-tight mb-12">
          Vamos te avisar antes
          <br />
          do seu período de teste
          <br />
          acabar
        </h1>

        {/* Ícone de sino com badge */}
        <div className="relative">
          <Bell className="h-48 w-48 text-muted-foreground/30" strokeWidth={1} />
          {/* Badge de notificação */}
          <div className="absolute top-2 right-2 w-14 h-14 bg-destructive rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            1
          </div>
        </div>
      </div>

      {/* Footer fixo na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-background px-6 pb-8 pt-4 space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Nenhum pagamento agora</span>
        </div>

        <Button
          onClick={onContinue}
          className="w-full h-14 text-base font-semibold"
          size="lg"
        >
          Continuar GRÁTIS
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Apenas R$ {selectedPlan.price.toFixed(2).replace(".", ",")} por{" "}
          {selectedPlan.interval === "year" ? "ano" : "mês"} (R${" "}
          {selectedPlan.pricePerMonth.toFixed(2).replace(".", ",")}/mês)
        </p>
      </div>
    </motion.div>
  );
};

// === TELA 3: Seleção de planos ===
const PlanSelectionScreen = ({
  trialDays,
  plans,
  selectedPlan,
  setSelectedPlan,
  onContinue,
  onBack,
  isLoading,
}: {
  trialDays: number;
  plans: Plan[];
  selectedPlan: Plan;
  setSelectedPlan: (plan: Plan) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
}) => {
  const reminderDay = trialDays - 2;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-full pb-52"
    >
      {/* Header com botão voltar */}
      <div className="flex items-center px-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Título */}
      <div className="text-center px-6 pt-4 pb-6">
        <h1 className="text-2xl font-bold">
          Inicie seu teste
          <br />
          <span className="text-primary">GRÁTIS</span> de {trialDays} dias.
        </h1>
      </div>

      {/* Timeline vertical */}
      <div className="px-6 mb-6">
        <div className="space-y-4">
          {/* Item 1: Hoje */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="w-0.5 flex-1 bg-primary mt-2" />
            </div>
            <div className="pb-4">
              <p className="font-semibold">Hoje</p>
              <p className="text-sm text-muted-foreground">
                Desbloqueie todas as funcionalidades: ideias com IA, carrosséis e mais.
              </p>
            </div>
          </div>

          {/* Item 2: Lembrete */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div className="w-0.5 flex-1 bg-amber-500 mt-2" />
            </div>
            <div className="pb-4">
              <p className="font-semibold">Em {reminderDay} dias - Lembrete</p>
              <p className="text-sm text-muted-foreground">
                Enviaremos um lembrete de que seu período de teste está acabando.
              </p>
            </div>
          </div>

          {/* Item 3: Cobrança */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Crown className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <p className="font-semibold">Em {trialDays} dias - Cobrança começa</p>
              <p className="text-sm text-muted-foreground">
                Você será cobrado em {getFutureDate(trialDays)}, a menos que cancele antes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seleção de planos */}
      <div className="px-6 flex gap-3 mb-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan)}
              className={cn(
                "relative flex-1 p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium whitespace-nowrap">
                  {trialDays} DIAS GRÁTIS
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{plan.name}</span>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </div>

              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold">
                  R$ {plan.pricePerMonth.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-xs text-muted-foreground">/mês</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer fixo na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-background px-6 pb-8 pt-4 space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Nenhum pagamento agora</span>
        </div>

        <Button
          onClick={onContinue}
          disabled={isLoading}
          className="w-full h-14 text-base font-semibold"
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
            `Iniciar meu teste grátis de ${trialDays} dias`
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {trialDays} dias grátis, depois R${" "}
          {selectedPlan.price.toFixed(2).replace(".", ",")} por{" "}
          {selectedPlan.interval === "year" ? "ano" : "mês"} (R${" "}
          {selectedPlan.pricePerMonth.toFixed(2).replace(".", ",")}/mês)
        </p>
      </div>
    </motion.div>
  );
};

// === COMPONENTE PRINCIPAL ===
export const PaywallFlow = ({
  trialDays,
  plans,
  onSelectPlan,
  onBack,
  isLoading = false,
}: PaywallFlowProps) => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(
    plans.find((p) => p.recommended) || plans[0]
  );

  const handleFinalContinue = () => {
    onSelectPlan(selectedPlan.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnimatePresence mode="wait">
        {currentScreen === 1 && (
          <TrialIntroScreen
            key="intro"
            trialDays={trialDays}
            selectedPlan={selectedPlan}
            onContinue={() => setCurrentScreen(2)}
          />
        )}

        {currentScreen === 2 && (
          <ReminderScreen
            key="reminder"
            trialDays={trialDays}
            selectedPlan={selectedPlan}
            onContinue={() => setCurrentScreen(3)}
            onBack={() => setCurrentScreen(1)}
          />
        )}

        {currentScreen === 3 && (
          <PlanSelectionScreen
            key="plans"
            trialDays={trialDays}
            plans={plans}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            onContinue={handleFinalContinue}
            onBack={() => setCurrentScreen(2)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
