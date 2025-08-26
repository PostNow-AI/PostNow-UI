import { ArrowLeft, CreditCard, Home, XCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-orange-800">
            Pagamento Cancelado
          </CardTitle>
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

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center space-x-2 text-orange-700">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Nenhum Crédito Adicionado</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Você pode tentar novamente quando quiser
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
