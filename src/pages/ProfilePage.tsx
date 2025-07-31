import { ProfileCompletion } from "@/components/ProfileCompletion";
import {
  AccountStatistics,
  BasicUserInfo,
  CreatorProfileOverview,
} from "@/components/profile";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingPage,
} from "@/components/ui";
import { useProfilePage } from "@/hooks/useProfilePage";

export const ProfilePage = () => {
  const {
    user,
    profile,
    isLoading,
    error,
    userName,
    userInitials,
    statusConfig,
    completedFieldsCount,
    handleSaveProfile,
    handleUploadAvatar,
    formatDate,
  } = useProfilePage();

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
          <BasicUserInfo
            user={user}
            userName={userName}
            userInitials={userInitials}
            onSaveProfile={handleSaveProfile}
            onUploadAvatar={handleUploadAvatar}
          />

          <CreatorProfileOverview
            profile={profile}
            statusConfig={statusConfig}
            formatDate={formatDate}
          />

          <AccountStatistics
            profile={profile}
            completedFieldsCount={completedFieldsCount}
            formatDate={formatDate}
          />
        </div>

        {/* Right Column - Profile Completion */}
        <div className="lg:col-span-2">
          <ProfileCompletion profile={profile} />
        </div>
      </div>
    </div>
  );
};
