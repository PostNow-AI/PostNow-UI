import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { type SubscriptionPlan } from "../../../types/subscription";
import {
  useCreateCheckoutSession,
  useSubscriptionPlans,
  useUserSubscription,
} from "../hooks/useSubscription";

export const SubscriptionPlans = () => {
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const { data: currentSubscription } = useUserSubscription();
  const createCheckout = useCreateCheckoutSession();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);

    try {
      await createCheckout.mutateAsync({
        plan_id: plan.id,
      });
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      setSelectedPlan(null);
    }
  };

  const isCurrentPlan = (planId: number) => {
    return (
      currentSubscription?.plan.id === planId &&
      currentSubscription.status === "active"
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">
            Erro ao carregar planos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Não foi possível carregar os planos de assinatura.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nenhum plano disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Não há planos de assinatura disponíveis no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Planos de Assinatura</h2>
        <p className="text-muted-foreground">
          Escolha o plano ideal para suas necessidades. Planos recorrentes
          incluem 7 dias grátis!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.id);
          const isPopular = plan.interval === "monthly"; // You can adjust this logic

          return (
            <Card
              key={plan.id}
              className={`relative ${isCurrent ? "ring-2 ring-primary" : ""} ${
                isPopular ? "border-primary" : ""
              }`}
            >
              {isPopular && (
                <Badge
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                  variant="default"
                >
                  Mais Popular
                </Badge>
              )}

              {isCurrent && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  Plano Atual
                </Badge>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4">
                  {plan.interval !== "lifetime" && (
                    <div className="text-sm font-medium text-green-600 mb-2">
                      7 dias grátis
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary">
                    R$ {Number(plan.price).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {plan.interval === "lifetime"
                      ? "Pagamento único"
                      : `por ${plan.interval_display}`}
                  </div>
                  {plan.interval !== "lifetime" && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Cobrança após o período de teste
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={
                    !plan.is_active || createCheckout.isPending || isCurrent
                  }
                  className="w-full"
                  size="lg"
                  variant={isCurrent ? "secondary" : "default"}
                >
                  {isCurrent
                    ? "Plano Atual"
                    : createCheckout.isPending && selectedPlan?.id === plan.id
                    ? "Processando..."
                    : plan.is_active
                    ? plan.interval === "lifetime"
                      ? "Comprar Agora"
                      : "Iniciar Teste Grátis"
                    : "Indisponível"}
                </Button>

                <div className="text-xs text-muted-foreground text-center mt-2">
                  {plan.is_active
                    ? plan.interval === "lifetime"
                      ? "Pagamento único via Stripe"
                      : "7 dias grátis • Cancele a qualquer momento"
                    : "Plano temporariamente indisponível"}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
