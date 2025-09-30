import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useUserSubscription } from "../hooks/useSubscription";

export const CurrentSubscription = () => {
  const { data: subscription, isLoading, error } = useUserSubscription();

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
            Erro ao carregar assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Não foi possível carregar suas informações de assinatura.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">
            Nenhuma assinatura ativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-600 mb-4">
            Você não possui uma assinatura ativa no momento.
          </p>
          <p className="text-sm text-orange-500">
            Explore nossos planos na aba "Planos" para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === "active";
  const statusColor = isActive
    ? "default"
    : subscription.status === "cancelled"
    ? "destructive"
    : "secondary";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Assinatura Atual
          <Badge variant={statusColor}>{subscription.status_display}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-1">
              {subscription.plan.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {subscription.plan.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Preço:</span>
              <span className="font-medium">
                R$ {Number(subscription.plan.price).toFixed(2)} /{" "}
                {subscription.plan.interval_display}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Início:</span>
              <span className="font-medium">
                {new Date(subscription.start_date).toLocaleDateString("pt-BR")}
              </span>
            </div>
            {subscription.end_date && (
              <div className="flex justify-between text-sm">
                <span>
                  {subscription.status === "active" ? "Renovação:" : "Fim:"}
                </span>
                <span className="font-medium">
                  {new Date(subscription.end_date).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
