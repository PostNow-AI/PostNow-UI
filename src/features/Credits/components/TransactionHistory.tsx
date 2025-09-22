import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useTransactions } from "../hooks/useCredits";
import { getTransactionColor, getTransactionIcon } from "../utils";

export const TransactionHistory = () => {
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carregando transações...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center space-x-3"
              >
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
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
            Erro ao carregar transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Não foi possível carregar o histórico de transações.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-muted-foreground">
              Nenhuma transação encontrada
            </p>
            <p className="text-sm text-muted-foreground">
              Suas transações de créditos aparecerão aqui
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getTransactionIcon(transaction.transaction_type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={getTransactionColor(
                        transaction.transaction_type
                      )}
                    >
                      {transaction.transaction_type_display}
                    </Badge>
                    {transaction.ai_model && (
                      <span className="text-xs text-muted-foreground">
                        via {transaction.ai_model}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium mt-1">
                    {transaction.description}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-lg font-bold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">créditos</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
