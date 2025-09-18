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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
    profile.business_name ||
    profile.business_instagram_handle ||
    profile.business_website ||
    profile.business_city ||
    profile.business_description ||
    profile.instagram_handle ||
    profile.whatsapp_number ||
    profile.logo ||
    profile.voice_tone ||
    profile.color_1 ||
    profile.color_2 ||
    profile.color_3 ||
    profile.color_4 ||
    profile.color_5
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
            onAvatarChange={(avatar) => {
              // TODO: Add avatar support to backend
              console.log("Avatar upload not yet implemented:", avatar);
            }}
          />
          {!hasProfileData && (
            <CreatorProfileOverview
              profile={profile}
              statusConfig={statusConfig}
              formatDate={formatDate}
            />
          )}

          <AccountStatistics profile={profile} formatDate={formatDate} />
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
                  {(profile.professional_name ||
                    profile.profession ||
                    profile.specialization) && (
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

                  {/* Business Information Section */}
                  {(profile.business_name ||
                    profile.business_city ||
                    profile.business_website ||
                    profile.business_description) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                          Informações do Negócio
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                        {profile.business_name && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Nome do Negócio
                            </Label>
                            <p className="text-sm font-medium">
                              {profile.business_name}
                            </p>
                          </div>
                        )}
                        {profile.business_city && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Cidade
                            </Label>
                            <p className="text-sm font-medium">
                              {profile.business_city}
                            </p>
                          </div>
                        )}
                        {profile.business_website && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Website
                            </Label>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {profile.business_website}
                            </p>
                          </div>
                        )}
                        {profile.business_description && (
                          <div className="space-y-1 md:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Descrição do Negócio
                            </Label>
                            <p className="text-sm font-medium">
                              {profile.business_description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact/Social Information Section */}
                  {(profile.instagram_handle ||
                    profile.business_instagram_handle ||
                    profile.whatsapp_number) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-green-700 dark:text-green-400">
                          Contato e Redes Sociais
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                        {profile.instagram_handle && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Instagram Pessoal
                            </Label>
                            <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
                              @{profile.instagram_handle}
                            </p>
                          </div>
                        )}
                        {profile.business_instagram_handle && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Instagram do Negócio
                            </Label>
                            <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
                              @{profile.business_instagram_handle}
                            </p>
                          </div>
                        )}
                        {profile.whatsapp_number && (
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                              WhatsApp
                            </Label>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                              {profile.whatsapp_number}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Brandbook Section */}
                  {(profile.logo ||
                    profile.voice_tone ||
                    profile.color_1 ||
                    profile.color_2 ||
                    profile.color_3 ||
                    profile.color_4 ||
                    profile.color_5) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <Label className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                          Brandbook
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                        {/* Logo */}
                        {profile.logo && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Logo
                            </Label>
                            <div className="flex items-center">
                              <img
                                src={profile.logo}
                                alt="Logo"
                                className="h-12 w-12 rounded border object-cover"
                                onError={(e) => {
                                  // If image fails to load, show fallback
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Voice Tone */}
                        {profile.voice_tone && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Tom de Voz
                            </Label>
                            <p className="text-sm font-medium">
                              {profile.voice_tone}
                            </p>
                          </div>
                        )}

                        {/* Colors */}
                        {(profile.color_1 ||
                          profile.color_2 ||
                          profile.color_3 ||
                          profile.color_4 ||
                          profile.color_5) && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Paleta de Cores
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {profile.color_1 && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{
                                      backgroundColor: profile.color_1,
                                    }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">
                                    Cor 1
                                  </span>
                                </div>
                              )}
                              {profile.color_2 && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{
                                      backgroundColor: profile.color_2,
                                    }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">
                                    Cor 2
                                  </span>
                                </div>
                              )}
                              {profile.color_3 && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{
                                      backgroundColor: profile.color_3,
                                    }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">
                                    Cor 3
                                  </span>
                                </div>
                              )}
                              {profile.color_4 && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{
                                      backgroundColor: profile.color_4,
                                    }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">
                                    Cor 4
                                  </span>
                                </div>
                              )}
                              {profile.color_5 && (
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{
                                      backgroundColor: profile.color_5,
                                    }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground">
                                    Cor 5
                                  </span>
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
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Dados de personalização configurados com sucesso!
                      </p>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Suas informações serão usadas para personalizar suas
                      campanhas e conteúdo.
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
              ) : !profile.onboarding_completed ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não completou o onboarding. Para melhorar a
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
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ width: "95vw", maxWidth: "1400px" }}
        >
          <DialogHeader>
            <DialogTitle>Editar Dados de Personalização</DialogTitle>
            <DialogDescription>
              Atualize suas informações profissionais, redes sociais e brandbook
              para melhorar a personalização do seu conteúdo.
            </DialogDescription>
          </DialogHeader>
          <ProfileEditForm
            initialData={{
              // Step 1: Personal information
              professional_name: profile?.professional_name,
              profession: profile?.profession,
              instagram_handle: profile?.instagram_handle,
              whatsapp_number: profile?.whatsapp_number,

              // Step 2: Business information
              business_name: profile?.business_name,
              specialization: profile?.specialization,
              business_instagram_handle: profile?.business_instagram_handle,
              business_website: profile?.business_website,
              business_city: profile?.business_city,
              business_description: profile?.business_description,

              // Step 3: Branding
              logo: profile?.logo,
              voice_tone: profile?.voice_tone,
              color_1: profile?.color_1,
              color_2: profile?.color_2,
              color_3: profile?.color_3,
              color_4: profile?.color_4,
              color_5: profile?.color_5,
            }}
            onComplete={() => setIsEditMode(false)}
            onCancel={() => setIsEditMode(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
