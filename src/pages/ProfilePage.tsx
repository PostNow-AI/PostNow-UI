import { ProfileCompletion } from "@/components/ProfileCompletion";
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
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const ProfilePage = () => {
  const { user } = useAuth();

  // Fetch creator profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: creatorProfileApi.getProfile,
    retry: false,
  });

  const getUserName = () => {
    if (!user) return "Usuário";
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email ||
      "Usuário"
    );
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return (
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
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

  if (isLoading) {
    return <LoadingPage text="Carregando perfil..." />;
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro ao carregar perfil</CardTitle>
            <CardDescription>
              Não foi possível carregar os dados do seu perfil de criador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Perfil do Criador</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências de conteúdo
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - User Info */}
        <div className="space-y-6">
          {/* Basic User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={getUserName()} />
                  <AvatarFallback className="text-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadAvatar}
                >
                  Alterar Foto
                </Button>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      defaultValue={user?.first_name || ""}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      defaultValue={user?.last_name || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email || ""} readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userId">ID do Usuário</Label>
                  <Input
                    id="userId"
                    defaultValue={user?.id?.toString() || ""}
                    readOnly
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Creator Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Perfil de Criador</CardTitle>
              <CardDescription>Informações do seu onboarding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Plataforma principal
                  </span>
                  <span className="font-medium capitalize">
                    {profile.main_platform || "Não definido"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nicho</span>
                  <span className="font-medium">
                    {profile.niche || "Não definido"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experiência</span>
                  <span className="font-medium capitalize">
                    {profile.experience_level || "Não definido"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Objetivo principal
                  </span>
                  <span className="font-medium capitalize">
                    {profile.primary_goal || "Não definido"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tempo disponível
                  </span>
                  <span className="font-medium">
                    {profile.time_available
                      ? `${profile.time_available} horas/semana`
                      : "Não definido"}
                  </span>
                </div>
              </div>

              {/* Profile Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Status do onboarding
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      profile.onboarding_completed
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {profile.onboarding_completed
                      ? "✅ Completo"
                      : "⏳ Pendente"}
                  </span>
                </div>

                {profile.onboarding_completed_at && (
                  <p className="text-xs text-muted-foreground">
                    Completado em:{" "}
                    {new Date(
                      profile.onboarding_completed_at
                    ).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas da Conta</CardTitle>
              <CardDescription>Dados sobre sua atividade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Perfil criado em
                  </span>
                  <span className="font-medium">
                    {new Date(profile.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Última atualização
                  </span>
                  <span className="font-medium">
                    {new Date(profile.updated_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Campos preenchidos
                  </span>
                  <span className="font-medium">
                    {Math.floor((profile.completeness_percentage / 100) * 34)}
                    /34
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Completion */}
        <div className="lg:col-span-2">
          <ProfileCompletion profile={profile} />
        </div>
      </div>
    </div>
  );
};
