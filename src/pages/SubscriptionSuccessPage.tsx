import { ArrowRight, CheckCircle, Crown, Home, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { subscriptionApiService } from "../lib/subscription-api";
import type { UserSubscription } from "../types/subscription";

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Fetch user's subscription data after successful payment
    const fetchSubscription = async () => {
      try {
        const userSub = await subscriptionApiService.getUserSubscription();
        setSubscription(userSub);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  useEffect(() => {
    // Only start countdown after loading is complete
    if (!loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate("/subscription");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [navigate, loading]);

  const handleGoToSubscription = () => {
    navigate("/subscription");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-muted-foreground">
              Confirmando sua assinatura...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Assinatura Ativada!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-green-700 font-medium">
              Sua assinatura foi ativada com sucesso!
            </p>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado automaticamente em {countdown} segundos
            </p>
          </div>

          {subscription && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                <Crown className="w-5 h-5" />
                <span className="font-medium">{subscription.plan.name}</span>
              </div>
              <p className="text-sm text-green-600">
                Status:{" "}
                {subscription.status === "active"
                  ? "Ativa"
                  : subscription.status}
              </p>
              {subscription.end_date && (
                <p className="text-sm text-green-600">
                  Válida até:{" "}
                  {new Date(subscription.end_date).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          )}

          {!subscription && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <Crown className="w-5 h-5" />
                <span className="font-medium">Assinatura Premium</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Agora você tem acesso completo à plataforma
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleGoToSubscription}
              className="w-full"
              size="lg"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Ver Minha Assinatura
            </Button>

            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Recebemos sua confirmação de pagamento</p>
            <p>Um email de confirmação foi enviado para você</p>
            {sessionId && (
              <p className="mt-1 font-mono text-xs">
                ID: {sessionId.slice(0, 8)}...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccessPage;
