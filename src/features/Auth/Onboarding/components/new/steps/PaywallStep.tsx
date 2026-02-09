import { PaywallScreen } from "../PaywallScreen";
import { useNavigate } from "react-router-dom";

interface PaywallStepProps {
  onSelectPlan: (planId: string) => void;
}

const TRIAL_DAYS = 10;

const plans = [
  {
    id: "annual",
    name: "Anual",
    price: 359.0,
    pricePerMonth: 29.92,
    interval: "year" as const,
    badge: "Melhor valor",
    savings: "Economize 50%",
    recommended: true,
  },
  {
    id: "monthly",
    name: "Mensal",
    price: 59.9,
    pricePerMonth: 59.9,
    interval: "month" as const,
  },
];

export const PaywallStep = ({
  onSelectPlan,
}: PaywallStepProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirecionar para login normal se já tem assinatura
    navigate("/login");
  };

  return (
    <PaywallScreen
      trialDays={TRIAL_DAYS}
      plans={plans}
      onSelectPlan={onSelectPlan}
      onLogin={handleLogin}
    />
  );
};
