import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { useUserCredits } from "../hooks/useCredits";

export const CreditBalance = () => {
  const { data: userCredits, isLoading, error } = useUserCredits();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
            Erro ao carregar créditos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Não foi possível carregar suas informações de créditos.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!userCredits) {
    return null;
  }

  const balance = Number(userCredits.balance) || 0;
  const hasCredits = Boolean(userCredits.has_credits);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Saldo de Créditos
          <Badge variant={hasCredits ? "default" : "destructive"}>
            {hasCredits ? "Disponível" : "Sem créditos"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {balance.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              créditos disponíveis
            </p>
          </div>

          {hasCredits && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Status</span>
                <span className="font-medium">Ativo</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Última atualização:{" "}
            {userCredits.last_updated
              ? new Date(userCredits.last_updated).toLocaleDateString("pt-BR")
              : "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
