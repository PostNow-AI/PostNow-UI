import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingPage,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Test functions for different toast types
  const showSuccessToast = () => {
    toast.success("Operação realizada com sucesso!", {
      description: "Tudo funcionou conforme esperado.",
    });
  };

  const showErrorToast = () => {
    toast.error("Ocorreu um erro!", {
      description: "Algo deu errado durante a operação.",
    });
  };

  const showWarningToast = () => {
    toast.warning("Atenção necessária!", {
      description: "Verifique suas configurações.",
    });
  };

  const showInfoToast = () => {
    toast.info("Informação importante", {
      description: "Aqui estão algumas informações úteis.",
    });
  };

  if (isLoading) {
    return <LoadingPage text="Carregando..." />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Bem-vindo ao Sonora
          </CardTitle>
          {user && (
            <CardDescription className="text-gray-600">
              Olá, {user.first_name} {user.last_name}!
            </CardDescription>
          )}
          <CardDescription className="text-gray-600">
            Você entrou com sucesso!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Link to="/account-settings" className="block">
              <Button variant="outline" className="w-full">
                Configurações da Conta
              </Button>
            </Link>
            <Button onClick={handleLogout} className="w-full">
              Sair
            </Button>
          </div>

          {/* Toast Demo Section */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">
              Teste os Toast Coloridos:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={showSuccessToast}
                variant="outline"
                size="sm"
                className="text-green-700 border-green-200 hover:bg-green-50"
              >
                ✓ Sucesso
              </Button>
              <Button
                onClick={showErrorToast}
                variant="outline"
                size="sm"
                className="text-red-700 border-red-200 hover:bg-red-50"
              >
                ✗ Erro
              </Button>
              <Button
                onClick={showWarningToast}
                variant="outline"
                size="sm"
                className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
              >
                ⚠ Aviso
              </Button>
              <Button
                onClick={showInfoToast}
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                ℹ Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
