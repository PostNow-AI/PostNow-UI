import { ArrowRight, CheckCircle, CreditCard, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const CreditSuccessPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/credits");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToCredits = () => {
    navigate("/credits");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Pagamento Confirmado!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-green-700 font-medium">
              Seus créditos foram adicionados com sucesso!
            </p>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado automaticamente em {countdown} segundos
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Créditos Disponíveis</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Acesse sua conta para ver o novo saldo
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleGoToCredits} className="w-full" size="lg">
              <ArrowRight className="w-4 h-4 mr-2" />
              Ver Meus Créditos
            </Button>

            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Recebemos sua confirmação de pagamento</p>
            <p>Um email de confirmação foi enviado para você</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditSuccessPage;
