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

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
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

        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
