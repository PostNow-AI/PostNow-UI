import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useUsageSummary } from "../hooks/useCredits";

export const UsageSummary = () => {
  const { data: summary, isLoading, error } = useUsageSummary();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carregando resumo...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">
            Erro ao carregar resumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Não foi possível carregar o resumo de uso.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  const { total_purchased, total_used, current_balance } = summary;

  // Garante que os valores sejam números válidos
  const safeTotalPurchased = Number(total_purchased) || 0;
  const safeTotalUsed = Number(total_used) || 0;
  const safeCurrentBalance = Number(current_balance) || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resumo de Uso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {safeTotalUsed.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Total Utilizado</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {safeCurrentBalance.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Saldo Atual</p>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-700">
              {safeTotalPurchased > 0 ? "Ativo" : "Inativo"}
            </div>
            <p className="text-sm text-green-600">Status da Conta</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
