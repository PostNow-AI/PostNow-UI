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
import { toast } from "sonner";

export function HomePage() {
  const { user, isLoading } = useAuth();

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo ao Sonora
        </h1>
        {user && (
          <p className="text-muted-foreground">
            Olá, {user.first_name} {user.last_name}! Você entrou com sucesso.
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Principal</CardTitle>
            <CardDescription>
              Explore as funcionalidades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Este é seu painel principal. Aqui você pode acessar todas as
              funcionalidades do sistema através do menu lateral.
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>✨ Funcionalidades disponíveis:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Gerenciamento de perfil</li>
                <li>• Configurações de conta</li>
                <li>• Sistema de notificações coloridas</li>
                <li>• Interface responsiva</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Toast Demo Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sistema de Notificações</CardTitle>
            <CardDescription>
              Teste os diferentes tipos de toast
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Experimente os diferentes tipos de notificações coloridas
              disponíveis no sistema:
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
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Sessões
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Ativo</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 34m</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação à semana passada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+3 novas hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">Sistema funcionando</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
