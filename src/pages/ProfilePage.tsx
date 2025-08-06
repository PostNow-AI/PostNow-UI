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

  // Check if user has any profile data filled in
  const hasProfileData = !!(
    profile.professional_name ||
    profile.profession ||
    profile.specialization ||
    profile.linkedin_url ||
    profile.instagram_username ||
    profile.youtube_channel ||
    profile.tiktok_username ||
    profile.primary_color ||
    profile.secondary_color ||
    profile.accent_color_1 ||
    profile.accent_color_2 ||
    profile.accent_color_3 ||
    profile.primary_font ||
    profile.secondary_font
  );

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
              {hasProfileData ? (
                <div className="space-y-6">
                  {/* Professional Information Section */}
                  {(profile.professional_name || profile.profession || profile.specialization) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-green-700 dark:text-green-400">
                          Informações Profissionais
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                        {profile.professional_name && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Nome Profissional
                            </Label>
                            <p className="text-sm font-medium">
                              {profile.professional_name}
                            </p>
                          </div>
                        )}
                        {profile.profession && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Profissão
                            </Label>
                            <p className="text-sm font-medium">
                              {profile.profession}
                            </p>
                          </div>
                        )}
                        {profile.specialization && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Especialização
                            </Label>
                            <p className="text-sm font-medium">
                              {profile.specialization}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Media Section */}
                  {(profile.linkedin_url || profile.instagram_username || profile.youtube_channel || profile.tiktok_username) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                          Redes Sociais
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                        {profile.linkedin_url && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              LinkedIn
                            </Label>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {profile.linkedin_url}
                            </p>
                          </div>
                        )}
                        {profile.instagram_username && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Instagram
                            </Label>
                            <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
                              {profile.instagram_username}
                            </p>
                          </div>
                        )}
                        {profile.youtube_channel && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              YouTube
                            </Label>
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">
                              {profile.youtube_channel}
                            </p>
                          </div>
                        )}
                        {profile.tiktok_username && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              TikTok
                            </Label>
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              {profile.tiktok_username}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Brandbook Section */}
                  {(profile.primary_color || profile.secondary_color || profile.accent_color_1 || profile.accent_color_2 || profile.accent_color_3 || profile.primary_font || profile.secondary_font) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                          Brandbook
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                        {/* Colors */}
                        {(profile.primary_color || profile.secondary_color || profile.accent_color_1 || profile.accent_color_2 || profile.accent_color_3) && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Paleta de Cores
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {profile.primary_color && (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: profile.primary_color }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">Primária</span>
                                </div>
                              )}
                              {profile.secondary_color && (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: profile.secondary_color }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">Secundária</span>
                                </div>
                              )}
                              {profile.accent_color_1 && (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: profile.accent_color_1 }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">Destaque 1</span>
                                </div>
                              )}
                              {profile.accent_color_2 && (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: profile.accent_color_2 }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">Destaque 2</span>
                                </div>
                              )}
                              {profile.accent_color_3 && (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: profile.accent_color_3 }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">Destaque 3</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Typography */}
                        {(profile.primary_font || profile.secondary_font) && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Tipografia
                            </Label>
                            <div className="space-y-1">
                              {profile.primary_font && (
                                <div className="space-y-1">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Fonte Primária
                                  </Label>
                                  <p className="text-sm font-medium" style={{ fontFamily: profile.primary_font }}>
                                    {profile.primary_font}
                                  </p>
                                </div>
                              )}
                              {profile.secondary_font && (
                                <div className="space-y-1">
                                  <Label className="text-xs font-medium text-muted-foreground">
                                    Fonte Secundária
                                  </Label>
                                  <p className="text-sm font-medium" style={{ fontFamily: profile.secondary_font }}>
                                    {profile.secondary_font}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Dados de personalização configurados com sucesso!
                      </p>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Suas informações serão usadas para personalizar suas campanhas e conteúdo.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditMode(true)}
                    >
                      Editar Dados de Personalização
                    </Button>
                  </div>
                </div>
              ) : profile.onboarding_skipped ? (
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
