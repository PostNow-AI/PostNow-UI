import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, ChevronLeft, Crown, Lock } from "lucide-react";
import { useState, useEffect } from "react";

// Reserved for future personalization (XSS prevention)
// const escapeHtml = (text: string): string => {
//   const div = document.createElement("div");
//   div.textContent = text;
//   return div.innerHTML;
// };

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

// === Reserved for future personalization ===
// const getBusinessName = (): string => {
//   try {
//     const stored = localStorage.getItem("postnow_onboarding_data");
//     if (stored) {
//       const data = JSON.parse(stored);
//       const name = data.business_name || "SUA MARCA";
//       return escapeHtml(name).slice(0, 100);
//     }
//   } catch {
//     // Ignore errors
//   }
//   return "SUA MARCA";
// };
// const useBusinessName = (): string => {
//   return useMemo(() => getBusinessName(), []);
// };

// === TELA 1: Introdução ao Trial ===
const TrialIntroScreen = ({
  trialDays: _trialDays,
  selectedPlan,
  onContinue,
}: {
  trialDays: number;
  selectedPlan: Plan;
  onContinue: () => void;
}) => {
  const [animationPhase, setAnimationPhase] = useState<"arriving" | "waiting" | "finger-in" | "tapping" | "opening" | "open">("arriving");
  // Reserved for future personalization
  // const businessName = useBusinessName();

  // Sequência de animação mais lenta e natural
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Fase 1: Email chega (0ms → 1000ms)
    timers.push(setTimeout(() => setAnimationPhase("waiting"), 1000));
    // Fase 2: Dedo entra em cena (2000ms)
    timers.push(setTimeout(() => setAnimationPhase("finger-in"), 2000));
    // Fase 3: Dedo toca (2800ms)
    timers.push(setTimeout(() => setAnimationPhase("tapping"), 2800));
    // Fase 4: Email começa abrir (3300ms)
    timers.push(setTimeout(() => setAnimationPhase("opening"), 3300));
    // Fase 5: Totalmente aberto (3800ms)
    timers.push(setTimeout(() => setAnimationPhase("open"), 3800));

    return () => timers.forEach(clearTimeout);
  }, []);

  const isEmailOpen = animationPhase === "opening" || animationPhase === "open";
  const showFinger = animationPhase === "finger-in" || animationPhase === "tapping";
  const fingerTapping = animationPhase === "tapping";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="shrink-0 text-center pt-6 px-6">
        <h1 className="text-xl font-bold leading-tight">
          Queremos que você
          <br />
          experimente o{" "}
          <span className="text-primary">PostNow</span> de graça.
        </h1>
      </div>

      {/* Preview do Email - Flexível no meio com altura limitada */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 min-h-0 overflow-hidden">
        <div className="relative max-h-full">
          {/* Emails "atrás" para dar contexto de inbox - some quando abre */}
          <AnimatePresence>
            {!isEmailOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.3, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -bottom-3 left-2 right-2 h-16 bg-zinc-300 rounded-xl"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute -bottom-1.5 left-1 right-1 h-12 bg-zinc-200 rounded-xl"
                />
              </>
            )}
          </AnimatePresence>

          {/* Email principal - wrapper para o badge não ser cortado */}
          <motion.div
            className="relative w-[340px]"
            initial={{ y: -150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
          >
            {/* Badge de notificação - fora do container com overflow-hidden */}
            <AnimatePresence>
              {!isEmailOpen && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 500 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center z-20 shadow-lg"
                >
                  <span className="text-white text-sm font-bold">1</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card do email */}
            <div
              className="rounded-xl overflow-hidden shadow-2xl border border-zinc-300 bg-white cursor-pointer"
              onClick={() => {
                if (animationPhase !== "open") {
                  setAnimationPhase("open");
                }
              }}
            >

            {/* Header do email - compacto */}
            <div className={cn(
              "bg-zinc-100 px-3 border-b border-zinc-200 transition-all",
              isEmailOpen ? "py-1.5" : "py-2.5"
            )}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "rounded-full bg-primary/20 flex items-center justify-center shrink-0 transition-all",
                  isEmailOpen ? "w-7 h-7" : "w-10 h-10"
                )}>
                  <span className={cn(
                    "text-primary font-bold",
                    isEmailOpen ? "text-xs" : "text-base"
                  )}>P</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-zinc-900 font-semibold",
                    isEmailOpen ? "text-xs" : "text-sm"
                  )}>PostNow</p>
                  {!isEmailOpen && <p className="text-zinc-500 text-xs">para mim</p>}
                </div>
                <span className={cn(
                  "text-zinc-400 shrink-0",
                  isEmailOpen ? "text-[10px]" : "text-xs"
                )}>08:00</span>
              </div>
              <p className={cn(
                "text-zinc-900 font-medium",
                isEmailOpen ? "text-xs mt-1" : "text-sm mt-2"
              )}>
                🎉 Suas ideias de posts para hoje chegaram!
              </p>

              {/* Preview quando fechado */}
              <AnimatePresence>
                {!isEmailOpen && (
                  <motion.p
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-zinc-500 text-xs mt-1"
                  >
                    Chegaram suas ideias para os posts de hoje...
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Corpo do email - expande quando aberto */}
            <AnimatePresence>
              {isEmailOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="bg-white px-3 py-2">
                    {/* Logo e intro - mais compacto */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-center mb-2 pb-1.5 border-b border-zinc-100"
                    >
                      <img
                        src="/postnow_logo_black.svg"
                        alt="PostNow"
                        className="h-4 mx-auto mb-0.5"
                      />
                      <p className="text-zinc-600 text-[10px]">
                        Suas ideias para os posts de{" "}
                        <span className="text-primary font-semibold">hoje</span>! 🎉
                      </p>
                    </motion.div>

                    {/* Seção: Ideia para feed - mais compacto */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mb-1.5"
                    >
                      <p className="text-primary font-semibold text-[11px] mb-0.5">💡 Ideia para feed</p>
                    </motion.div>

                    {/* Card do post */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <motion.img
                          src="https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/material-design_8e97e4ee.png"
                          alt="Exemplo de post"
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                        />
                      </div>
                    </motion.div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicador de toque quando fechado - aparece junto com o email */}
            <AnimatePresence mode="wait">
              {!isEmailOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="bg-zinc-50 py-2 text-center border-t border-zinc-200"
                >
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-zinc-400 text-[11px]"
                  >
                    Toque para abrir
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </motion.div>

          {/* Efeito Ripple de toque - posicionado sobre o "Toque para abrir" */}
          <AnimatePresence>
            {showFinger && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-[52px] left-1/2 -translate-x-1/2 pointer-events-none z-20"
              >
                {/* Círculos concêntricos de ripple */}
                <div className="relative">
                  {/* Círculo 1 - mais interno */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={fingerTapping ? {
                      scale: [0, 1.5, 2.5],
                      opacity: [0.8, 0.4, 0],
                    } : { scale: 0, opacity: 0.8 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-primary"
                  />
                  {/* Círculo 2 - meio */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={fingerTapping ? {
                      scale: [0, 1.2, 2],
                      opacity: [0.6, 0.3, 0],
                    } : { scale: 0, opacity: 0.6 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-primary"
                  />
                  {/* Círculo 3 - externo */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0.4 }}
                    animate={fingerTapping ? {
                      scale: [0, 1, 1.5],
                      opacity: [0.4, 0.2, 0],
                    } : { scale: 0, opacity: 0.4 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-primary"
                  />
                  {/* Ponto central do toque */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={fingerTapping ? {
                      scale: [0, 1.2, 0],
                    } : { scale: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/60"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer fixo */}
      <div className="shrink-0 px-6 pb-6 pt-3 space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Nenhum pagamento agora</span>
        </div>

        <Button
          onClick={onContinue}
          className="w-full h-12 text-base font-semibold"
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
  trialDays: _trialDays,
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
      className="h-full flex flex-col overflow-hidden relative"
    >
      {/* Botão voltar - posição absoluta para não afetar centralização */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Conteúdo central - ocupa todo o espaço disponível */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-[180px]">
        <h1 className="text-xl font-bold text-center leading-tight mb-6">
          Vamos te avisar antes
          <br />
          do seu período de teste
          <br />
          acabar
        </h1>

        {/* Ícone de sino com badge */}
        <div className="relative">
          <Bell className="h-32 w-32 text-muted-foreground/30" strokeWidth={1} />
          <div className="absolute top-0 right-0 w-10 h-10 bg-destructive rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            1
          </div>
        </div>
      </div>

      {/* Footer fixo */}
      <div className="shrink-0 px-6 pb-6 pt-3 space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Nenhum pagamento agora</span>
        </div>

        <Button
          onClick={onContinue}
          className="w-full h-12 text-base font-semibold"
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
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header - Botão voltar */}
      <div className="shrink-0 px-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Content - Distribui o conteúdo no espaço disponível */}
      <div className="flex-1 flex flex-col justify-between px-6 py-4">
        {/* Título */}
        <h1 className="text-xl font-bold text-center">
          Inicie seu teste{" "}
          <span className="text-primary">GRÁTIS</span> de {trialDays} dias.
        </h1>

        {/* Timeline vertical */}
        <div className="space-y-3">
          {/* Item 1: Hoje */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="w-0.5 h-12 bg-primary" />
            </div>
            <div className="pt-2">
              <p className="font-semibold">Hoje</p>
              <p className="text-sm text-muted-foreground">
                Desbloqueie todas as funcionalidades: ideias com IA, carrosséis e mais.
              </p>
            </div>
          </div>

          {/* Item 2: Lembrete */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div className="w-0.5 h-12 bg-amber-500" />
            </div>
            <div className="pt-2">
              <p className="font-semibold">Em {reminderDay} dias - Lembrete</p>
              <p className="text-sm text-muted-foreground">
                Enviaremos um lembrete de que seu período de teste está acabando.
              </p>
            </div>
          </div>

          {/* Item 3: Cobrança */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Crown className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="pt-2">
              <p className="font-semibold">Em {trialDays} dias - Cobrança</p>
              <p className="text-sm text-muted-foreground">
                Você será cobrado em {getFutureDate(trialDays)}, a menos que cancele.
              </p>
            </div>
          </div>
        </div>

        {/* Seleção de planos */}
        <div className="flex gap-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan.id === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={cn(
                  "relative flex-1 p-3 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-medium whitespace-nowrap">
                    {trialDays} DIAS GRÁTIS
                  </div>
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{plan.name}</span>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                  </div>
                </div>

                <div className="flex items-baseline gap-0.5">
                  <span className="text-base font-bold">
                    R$ {plan.pricePerMonth.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-xs text-muted-foreground">/mês</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer fixo */}
      <div className="shrink-0 px-6 pb-6 pt-3 space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Nenhum pagamento agora</span>
        </div>

        <Button
          onClick={onContinue}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold"
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
            `Iniciar teste grátis de ${trialDays} dias`
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
  onBack: _onBack,
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
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
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
