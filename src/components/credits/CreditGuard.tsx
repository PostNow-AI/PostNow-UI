import { Button } from "@/components/ui/button";
import { useUserCredits } from "@/hooks/useCredits";
import { AlertTriangle, CreditCard } from "lucide-react";
import React from "react";

interface CreditGuardProps {
  children: React.ReactNode;
  requiredCredits: number;
  onInsufficientCredits?: () => void;
}

export const CreditGuard: React.FC<CreditGuardProps> = ({
  children,
  requiredCredits,
  onInsufficientCredits,
}) => {
  const { data: userCredits, isLoading } = useUserCredits();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2">Verificando créditos...</span>
      </div>
    );
  }

  const hasEnoughCredits = userCredits
    ? userCredits.balance >= requiredCredits
    : false;

  if (!hasEnoughCredits) {
    const shortfall = requiredCredits - (userCredits?.balance || 0);

    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50">
        <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Créditos Insuficientes
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Você precisa de <strong>{requiredCredits.toFixed(2)} créditos</strong>{" "}
          para esta operação.
          <br />
          Saldo atual:{" "}
          <strong>{(userCredits?.balance || 0).toFixed(2)} créditos</strong>
          <br />
          Necessário:{" "}
          <strong className="text-orange-600">
            {shortfall.toFixed(2)} créditos
          </strong>
        </p>
        <Button
          onClick={() => {
            if (onInsufficientCredits) {
              onInsufficientCredits();
            } else {
              window.location.href = "/credits";
            }
          }}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Comprar Créditos
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

interface CreditBalanceDisplayProps {
  className?: string;
  showIcon?: boolean;
}

export const CreditBalanceDisplay: React.FC<CreditBalanceDisplayProps> = ({
  className = "",
  showIcon = true,
}) => {
  const { data: userCredits, isLoading } = useUserCredits();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
      </div>
    );
  }

  const balance = userCredits?.balance || 0;
  const isLow = balance < 10; // Consider less than 10 credits as low

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <CreditCard
          className={`h-4 w-4 ${isLow ? "text-orange-500" : "text-green-500"}`}
        />
      )}
      <span
        className={`font-medium ${isLow ? "text-orange-600" : "text-gray-900"}`}
      >
        {balance.toFixed(2)} créditos
      </span>
      {isLow && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => (window.location.href = "/credits")}
          className="text-xs"
        >
          Adicionar
        </Button>
      )}
    </div>
  );
};

interface CostEstimateDisplayProps {
  estimatedCost: number;
  userBalance: number;
  className?: string;
}

export const CostEstimateDisplay: React.FC<CostEstimateDisplayProps> = ({
  estimatedCost,
  userBalance,
  className = "",
}) => {
  const canAfford = userBalance >= estimatedCost;
  const shortfall = canAfford ? 0 : estimatedCost - userBalance;

  return (
    <div
      className={`p-3 rounded-lg border ${
        canAfford
          ? "border-green-200 bg-green-50"
          : "border-orange-200 bg-orange-50"
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Custo estimado:
        </span>
        <span
          className={`font-semibold ${
            canAfford ? "text-green-700" : "text-orange-700"
          }`}
        >
          {estimatedCost.toFixed(2)} créditos
        </span>
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-sm text-gray-600">Seu saldo:</span>
        <span
          className={`text-sm ${
            canAfford ? "text-green-600" : "text-gray-600"
          }`}
        >
          {userBalance.toFixed(2)} créditos
        </span>
      </div>

      {!canAfford && shortfall > 0 && (
        <div className="mt-2 pt-2 border-t border-orange-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-700">
              Créditos necessários:
            </span>
            <span className="font-semibold text-orange-700">
              {shortfall.toFixed(2)} créditos
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
