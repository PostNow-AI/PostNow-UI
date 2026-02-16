import { Button } from "@/components";
import { formatToBRL } from "@/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { type SubscriptionPlan } from "../../../types/subscription";
import {
  useCancelSubscription,
  useCreateCheckoutSession,
  useSubscriptionPlans,
  useUserSubscription,
} from "../hooks/useSubscription";
import { CancelSubscription } from "./CancelSubscription";

export const SubscriptionPlans = () => {
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const { data: currentSubscription } = useUserSubscription();
  const createCheckout = useCreateCheckoutSession();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const cancelSubscription = useCancelSubscription();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription.mutateAsync();

      if (result.success) {
        toast.success(result.message || "Assinatura cancelada com sucesso!");
        setIsDialogOpen(false);
      } else {
        toast.error(result.message || "Erro ao cancelar assinatura");
      }
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      toast.error("Erro inesperado ao cancelar assinatura");
    }
  };

  console.log("Current Subscription:", currentSubscription);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);

    try {
      const baseUrl = window.location.origin;
      await createCheckout.mutateAsync({
        plan_id: plan.id,
        success_url: `${baseUrl}/subscription/success`,
        cancel_url: `${baseUrl}/subscription/cancel`,
        upgrade: currentSubscription ? true : false,
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

  const calculateMonthlyPrice = (plan: SubscriptionPlan) => {
    const basePrice = Number(plan.price);
    if (plan.interval === "monthly") {
      return basePrice;
    } else if (plan.interval === "semester") {
      const monthlyBase = basePrice / 6;
      return monthlyBase * 0.75; // 25% discount
    } else if (plan.interval === "yearly") {
      const monthlyBase = basePrice / 12;
      return monthlyBase * 0.5; // 50% discount
    }
    return basePrice; // fallback for other intervals
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
          Estamos em fase{" "}
          <span className="font-semibold text-primary">BETA</span>! Aproveite
          nossos planos com preços especiais e benefícios exclusivos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.id);
          const bestChoice = plan.interval === "yearly"; // You can adjust this logic
          const monthlyPrice = calculateMonthlyPrice(plan);

          return (
            <Card
              key={plan.id}
              className={`relative ${isCurrent ? "ring-2 ring-primary" : ""} ${
                bestChoice ? "border-primary" : ""
              }`}
            >
              {bestChoice && (
                <Badge
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                  variant="default"
                >
                  Melhor Escolha
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
                <div className="mt-4 space-y-1 flex flex-col items-start">
                  {plan.benefits?.map((benefit, index) => (
                    <div
                      className="flex flex-row items-center gap-2"
                      key={index}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                          fill="#8B5CF6"
                          fill-opacity="0.1"
                        />
                        <path
                          d="M17.3332 8L9.99984 15.3333L6.6665 12"
                          stroke="#8B5CF6"
                          stroke-width="1.33333"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <p key={index} className="text-sm text-muted-foreground ">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-primary">
                    {formatToBRL(monthlyPrice)}/mês
                  </div>

                  {plan.interval !== "lifetime" && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Cobrança após o período de teste
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {currentSubscription && isCurrent ? (
                  <>
                    <CancelSubscription
                      isDialogOpen={isDialogOpen}
                      setIsDialogOpen={setIsDialogOpen}
                      currentSubscription={currentSubscription}
                      handleCancelSubscription={handleCancelSubscription}
                      cancelSubscription={cancelSubscription}
                    />{" "}
                    <div className="text-xs text-muted-foreground text-center mt-2">
                      {plan.is_active
                        ? plan.interval === "lifetime"
                          ? "Pagamento único via Stripe"
                          : "Cancele a qualquer momento"
                        : "Plano temporariamente indisponível"}
                    </div>
                  </>
                ) : null}
                {!isCurrent && !currentSubscription && (
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
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
