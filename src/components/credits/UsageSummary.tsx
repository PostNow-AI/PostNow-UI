import { useUsageSummary } from "../../hooks/useCredits";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

const UsageSummary = () => {
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

  const { total_purchased, total_used, current_balance, usage_percentage } =
    summary;

  // Garante que os valores sejam números válidos
  const safeTotalPurchased = Number(total_purchased) || 0;
  const safeTotalUsed = Number(total_used) || 0;
  const safeCurrentBalance = Number(current_balance) || 0;
  const safeUsagePercentage = Number(usage_percentage) || 0;

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
              <div className="text-2xl font-bold text-primary">
                {safeTotalPurchased.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Total Comprado</p>
            </div>

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

          {/* Barra de progresso de uso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Percentual de Uso</span>
              <span className="font-medium">
                {safeUsagePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={safeUsagePercentage} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {safeTotalPurchased > 0
                ? `${safeTotalUsed.toFixed(2)} de ${safeTotalPurchased.toFixed(
                    2
                  )} créditos utilizados`
                : "Nenhum crédito comprado ainda"}
            </p>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">
                {safeTotalPurchased > 0
                  ? (
                      ((safeTotalPurchased - safeTotalUsed) /
                        safeTotalPurchased) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                %
              </div>
              <p className="text-sm text-blue-600">Créditos Restantes</p>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">
                {safeTotalPurchased > 0 ? "Ativo" : "Inativo"}
              </div>
              <p className="text-sm text-green-600">Status da Conta</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageSummary;
