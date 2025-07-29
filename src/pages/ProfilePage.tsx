import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  LoadingPage,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage text="Carregando perfil..." />;
  }

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const getUserName = () => {
    if (!user) return "Usuário";
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email ||
      "Usuário"
    );
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update functionality
    toast.info("Em desenvolvimento", {
      description:
        "A funcionalidade de edição de perfil será implementada em breve.",
    });
  };

  const handleUploadAvatar = () => {
    // TODO: Implement avatar upload functionality
    toast.info("Em desenvolvimento", {
      description:
        "A funcionalidade de upload de avatar será implementada em breve.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências de conta.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Suas informações básicas de perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={getUserName()} />
                <AvatarFallback className="text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleUploadAvatar}>
                Alterar Foto
              </Button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={user?.first_name || ""}
                    placeholder="Seu nome"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    value={user?.last_name || ""}
                    placeholder="Seu sobrenome"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  placeholder="seu@email.com"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">ID do Usuário</Label>
                <Input
                  id="userId"
                  value={user?.id?.toString() || ""}
                  placeholder="ID"
                  readOnly
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Detalhes sobre sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ID da Conta</span>
                <span className="text-sm text-muted-foreground">
                  #{user?.id || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">E-mail Principal</span>
                <span className="text-sm text-muted-foreground">
                  {user?.email || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nome Completo</span>
                <span className="text-sm text-muted-foreground">
                  {getUserName()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status da Conta</span>
                <span className="text-sm text-green-600 font-medium">
                  Ativa
                </span>
              </div>
            </div>

            {/* Demo Stats */}
            <div className="pt-4 border-t space-y-4">
              <h4 className="text-sm font-medium">Atividade Recente</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Logins esta semana
                  </span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sessões ativas</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Toasts testados</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Páginas visitadas
                  </span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="pt-4 border-t space-y-3">
              <h4 className="text-sm font-medium">Ações da Conta</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() =>
                    toast.info("Em desenvolvimento", {
                      description: "Funcionalidade será implementada em breve.",
                    })
                  }
                >
                  Alterar Senha
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() =>
                    toast.info("Em desenvolvimento", {
                      description: "Funcionalidade será implementada em breve.",
                    })
                  }
                >
                  Baixar Dados
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() =>
                    toast.warning("Atenção", {
                      description:
                        "Esta funcionalidade requer confirmação adicional.",
                    })
                  }
                >
                  Excluir Conta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
