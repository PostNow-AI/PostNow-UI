import {
  AccountStatistics,
  BasicUserInfo,
  CreatorProfileOverview,
} from "@/components/profile";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingPage,
} from "@/components/ui";
import { Label } from "@/components/ui/label";
import { useProfilePage } from "@/hooks/useProfilePage";
import { useState } from "react";

export const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
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

        {/* Right Column - Onboarding Data */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Personalização</CardTitle>
              <CardDescription>
                Informações coletadas para personalizar suas campanhas e
                conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.onboarding_skipped ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você pulou o onboarding inicial. Para melhorar a
                    personalização do seu conteúdo, você pode preencher essas
                    informações a qualquer momento.
                  </p>
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    Preencher Dados de Personalização
                  </Button>
                </div>
              ) : profile.onboarding_completed ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.professional_name && (
                      <div>
                        <Label className="text-sm font-medium">
                          Nome Profissional
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {profile.professional_name}
                        </p>
                      </div>
                    )}
                    {profile.profession && (
                      <div>
                        <Label className="text-sm font-medium">Profissão</Label>
                        <p className="text-sm text-muted-foreground">
                          {profile.profession}
                        </p>
                      </div>
                    )}
                    {profile.specialization && (
                      <div>
                        <Label className="text-sm font-medium">
                          Especialização
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {profile.specialization}
                        </p>
                      </div>
                    )}
                  </div>

                  {(profile.linkedin_url ||
                    profile.instagram_username ||
                    profile.youtube_channel ||
                    profile.tiktok_username) && (
                    <div>
                      <Label className="text-sm font-medium">
                        Redes Sociais
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {profile.linkedin_url && (
                          <p className="text-sm text-muted-foreground">
                            LinkedIn: {profile.linkedin_url}
                          </p>
                        )}
                        {profile.instagram_username && (
                          <p className="text-sm text-muted-foreground">
                            Instagram: {profile.instagram_username}
                          </p>
                        )}
                        {profile.youtube_channel && (
                          <p className="text-sm text-muted-foreground">
                            YouTube: {profile.youtube_channel}
                          </p>
                        )}
                        {profile.tiktok_username && (
                          <p className="text-sm text-muted-foreground">
                            TikTok: {profile.tiktok_username}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(profile.primary_color ||
                    profile.secondary_color ||
                    profile.primary_font) && (
                    <div>
                      <Label className="text-sm font-medium">Brandbook</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {profile.primary_color && (
                          <p className="text-sm text-muted-foreground">
                            Cor Primária: {profile.primary_color}
                          </p>
                        )}
                        {profile.secondary_color && (
                          <p className="text-sm text-muted-foreground">
                            Cor Secundária: {profile.secondary_color}
                          </p>
                        )}
                        {profile.primary_font && (
                          <p className="text-sm text-muted-foreground">
                            Fonte Primária: {profile.primary_font}
                          </p>
                        )}
                        {profile.secondary_font && (
                          <p className="text-sm text-muted-foreground">
                            Fonte Secundária: {profile.secondary_font}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditMode(true)}
                    >
                      Editar Dados de Personalização
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Complete os dados de personalização para melhorar suas
                    campanhas.
                  </p>
                  <Button onClick={() => setIsEditMode(true)}>
                    Completar Dados de Personalização
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <ProfileEditForm
              initialData={{
                professional_name: profile?.professional_name,
                profession: profile?.profession,
                specialization: profile?.specialization,
                linkedin_url: profile?.linkedin_url,
                instagram_username: profile?.instagram_username,
                youtube_channel: profile?.youtube_channel,
                tiktok_username: profile?.tiktok_username,
                primary_color: profile?.primary_color,
                secondary_color: profile?.secondary_color,
                accent_color_1: profile?.accent_color_1,
                accent_color_2: profile?.accent_color_2,
                accent_color_3: profile?.accent_color_3,
                primary_font: profile?.primary_font,
                secondary_font: profile?.secondary_font,
              }}
              onComplete={() => setIsEditMode(false)}
              onCancel={() => setIsEditMode(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
