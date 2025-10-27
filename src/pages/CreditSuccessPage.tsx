import { ArrowRight, Home, Verified } from "lucide-react";
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
          navigate("/ideabank");
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Verified className="w-8 h-8 text-lime-600" />
            <CardTitle className="text-2xl text-white">
              Pagamento Confirmado!
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-primary-light font-medium">
              Seus créditos foram adicionados com sucesso!
            </p>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado automaticamente em {countdown} segundos
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditSuccessPage;
