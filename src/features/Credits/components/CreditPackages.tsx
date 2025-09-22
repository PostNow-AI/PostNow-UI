import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { type CreditPackage } from "../../../types/credits";
import { useCreditPackages, useStripeCheckout } from "../hooks/useCredits";

export const CreditPackages = () => {
  const stripeCheckout = useStripeCheckout();
  const { data: packages, isLoading, error } = useCreditPackages();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  );

  const handlePurchase = async (packageData: CreditPackage) => {
    setSelectedPackage(packageData);

    try {
      const checkoutData = await stripeCheckout.mutateAsync({
        package_id: Number(packageData.id) || 0,
        success_url: `${window.location.origin}/credits/success`,
        cancel_url: `${window.location.origin}/credits/cancel`,
      });

      // Redireciona para o checkout do Stripe
      window.location.href = checkoutData.checkout_url;
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
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
            Erro ao carregar pacotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Não foi possível carregar os pacotes de créditos.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Nenhum pacote disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Não há pacotes de créditos disponíveis no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pacotes de Créditos</h2>
        <p className="text-muted-foreground">
          Escolha o pacote ideal para suas necessidades de IA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((packageData) => (
          <Card key={packageData.id} className="relative">
            {packageData.is_active && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                Ativo
              </Badge>
            )}

            <CardHeader>
              <CardTitle className="text-lg">{packageData.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {Number(packageData.credits).toLocaleString("pt-BR")} créditos
              </p>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-primary mb-4">
                R$ {Number(packageData.price).toFixed(2)}
              </div>

              <Button
                onClick={() => handlePurchase(packageData)}
                disabled={!packageData.is_active || stripeCheckout.isPending}
                className="w-full"
                size="lg"
              >
                {stripeCheckout.isPending &&
                selectedPackage?.id === packageData.id
                  ? "Processando..."
                  : "Comprar Agora"}
              </Button>

              <div className="text-xs text-muted-foreground text-center mt-2">
                {packageData.is_active
                  ? "Pagamento seguro via Stripe"
                  : "Indisponível"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
