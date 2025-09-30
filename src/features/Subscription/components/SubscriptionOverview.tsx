import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useUserSubscription } from "../hooks/useSubscription";

export const SubscriptionOverview = () => {
  const { data: subscription, isLoading } = useUserSubscription();

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

  const hasActiveSubscription =
    subscription && subscription.status === "active";
  const daysUntilExpiry = subscription?.end_date
    ? Math.ceil(
        (new Date(subscription.end_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resumo da Assinatura</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasActiveSubscription ? (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ✓ Ativo
                </div>
                <p className="text-sm text-muted-foreground">
                  Você possui uma assinatura ativa
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Plano atual:</span>
                  <span className="font-medium">{subscription.plan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Valor:</span>
                  <span className="font-medium">
                    R$ {Number(subscription.plan.price).toFixed(2)} /{" "}
                    {subscription.plan.interval_display}
                  </span>
                </div>
                {daysUntilExpiry !== null && (
                  <div className="flex justify-between text-sm">
                    <span>Dias restantes:</span>
                    <span className="font-medium">
                      {daysUntilExpiry > 0
                        ? `${daysUntilExpiry} dias`
                        : "Expira hoje"}
                    </span>
                  </div>
                )}
              </div>

              {daysUntilExpiry !== null && daysUntilExpiry <= 7 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    ⚠️ Sua assinatura expira em breve.
                    {daysUntilExpiry > 0
                      ? ` Resta${
                          daysUntilExpiry === 1 ? "" : "m"
                        } ${daysUntilExpiry} dia${
                          daysUntilExpiry === 1 ? "" : "s"
                        }.`
                      : " Expira hoje!"}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ⚠️ Sem Assinatura
                </div>
                <p className="text-sm text-muted-foreground">
                  Você não possui uma assinatura ativa
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Assine um plano para ter acesso completo a todos os
                  recursos da plataforma.
                </p>
              </div>
            </>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Última verificação: {new Date().toLocaleString("pt-BR")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
