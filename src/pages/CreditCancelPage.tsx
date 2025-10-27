import { ArrowLeft, Home, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const CreditCancelPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
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
            <XCircle className="w-8 h-8 text-orange-700" />
            <CardTitle className="text-2xl text-white">
              Pagamento cancelado!
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-orange-700 font-medium">
              O pagamento foi cancelado ou não foi concluído
            </p>
            <p className="text-sm text-muted-foreground">
              Nenhum valor foi cobrado da sua conta
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleGoBack} className="w-full" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Se você acredita que isso é um erro,</p>
            <p>entre em contato com nosso suporte</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditCancelPage;
