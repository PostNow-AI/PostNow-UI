import { ArrowRight, Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(5);

  // Invalidate subscription cache when page loads to get fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
  }, [queryClient]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Navigate when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      navigate("/ideabank");
    }
  }, [countdown, navigate]);

  const handleGoToIdeaBank = () => {
    navigate("/ideabank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2">
            <Verified className="w-8 h-8 text-lime-600" />
            <CardTitle className="text-2xl text-white">
              Assinatura Ativada!
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-primary-light font-medium">
              Sua assinatura foi ativada com sucesso!
            </p>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado automaticamente em {countdown} segundos
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleGoToIdeaBank} className="w-full" size="lg">
              <ArrowRight className="w-4 h-4 mr-2" />
              Começar a Criar
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Aproveite seu período de teste gratuito!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
