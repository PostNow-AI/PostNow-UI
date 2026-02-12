import { SUBSCRIPTION_CONFIG } from "@/config/subscription";
import { PaywallFlow } from "../PaywallFlow";

interface PaywallStepProps {
  onSelectPlan: (planId: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

/** Usar constante centralizada para evitar duplicação */
const { TRIAL_DAYS } = SUBSCRIPTION_CONFIG;

const plans = [
  {
    id: "monthly",
    name: "Mensal",
    price: 49.9,
    pricePerMonth: 49.9,
    interval: "month" as const,
  },
  {
    id: "annual",
    name: "Anual",
    price: 359.0,
    pricePerMonth: 29.92,
    interval: "year" as const,
    badge: "Melhor valor",
    savings: "Economize 40%",
    recommended: true,
  },
];

export const PaywallStep = ({
  onSelectPlan,
  onBack,
  isLoading,
}: PaywallStepProps) => {
  return (
    <PaywallFlow
      trialDays={TRIAL_DAYS}
      plans={plans}
      onSelectPlan={onSelectPlan}
      onBack={onBack}
      isLoading={isLoading}
    />
  );
};
