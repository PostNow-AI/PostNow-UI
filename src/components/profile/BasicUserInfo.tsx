import { GoogleOAuthButton } from "@/components/GoogleOAuthButton";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { useProfile } from "@/hooks/useProfile";
import { useUserForm } from "@/hooks/useUserForm";
import { api } from "@/lib/api";
import { type User } from "@/types/auth";
import { useEffect, useState } from "react";
import { AvatarSection } from "./AvatarSection";
import { UserFormSection } from "./UserFormSection";

interface BasicUserInfoProps {
  user: User | null;
  userName: string;
  userInitials: string;
  onSaveProfile: () => void;
  avatar?: string;
  onAvatarChange?: (avatar: string) => void;
}

interface SocialAccount {
  id: number;
  provider: string;
  extra_data: {
    email?: string;
    name?: string;
    picture?: string;
  };
}

export const BasicUserInfo = ({
  user,
  userName,
  userInitials,
  onSaveProfile,
  avatar,
  onAvatarChange,
}: BasicUserInfoProps) => {
  const { updateUserProfile, uploadAvatar, isUpdatingUserProfile } =
    useProfile();
  const { user: authUser } = useAuth();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [googleAccount, setGoogleAccount] = useState<SocialAccount | null>(
    null
  );

  // Debug logs
  console.log("BasicUserInfo renderizado");
  console.log("authUser:", authUser);
  console.log("googleAccount state:", googleAccount);

  const { processFile, isProcessing } = useAvatarUpload({
    onUpload: (avatarData: string) => {
      uploadAvatar(avatarData, {
        onSuccess: () => {
          onAvatarChange?.(avatarData);
        },
      });
    },
  });

  const userForm = useUserForm({
    user,
    onSubmit: (data) => {
      updateUserProfile(data, {
        onSuccess: () => {
          onSaveProfile();
        },
      });
    },
  });

  // Buscar contas sociais conectadas
  useEffect(() => {
    console.log("useEffect executado, authUser:", authUser);

    const fetchSocialAccounts = async () => {
      try {
        console.log("Fazendo requisição para /api/v1/auth/social-accounts/");
        const response = await api.get("/api/v1/auth/social-accounts/");
        console.log("Resposta da API:", response.data);

        // A API retorna { social_accounts: [...], total_count: ... }
        const socialAccounts = response.data.social_accounts || [];
        const googleAcc = socialAccounts.find(
          (acc: SocialAccount) => acc.provider === "google"
        );

        console.log("Contas sociais encontradas:", socialAccounts);
        console.log("Conta Google:", googleAcc);

        setGoogleAccount(googleAcc || null);
      } catch (error) {
        console.error("Erro ao buscar contas sociais:", error);
      }
    };

    if (authUser) {
      console.log("authUser existe, buscando contas sociais...");
      fetchSocialAccounts();
    } else {
      console.log("authUser não existe ainda");
    }
  }, [authUser]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleConnectGoogle = () => {
    // Implementar conexão com Google
    console.log("Conectar Google");
  };

  const handleDisconnect = async (account: SocialAccount) => {
    setIsDisconnecting(true);
    try {
      await api.delete(
        `/api/v1/auth/social-accounts/${account.id}/disconnect/`
      );
      setGoogleAccount(null);
    } catch (error) {
      console.error("Erro ao desconectar conta:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Seus dados pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AvatarSection
          avatarData={avatar || ""}
          userName={userName}
          userInitials={userInitials}
          onFileSelect={handleFileSelect}
        />

        <UserFormSection
          user={user}
          form={userForm.form}
          isEditing={userForm.isEditing}
          isSubmitting={isUpdatingUserProfile || isProcessing}
          onStartEditing={userForm.startEditing}
          onCancel={userForm.handleCancel}
          onSubmit={userForm.handleSubmit}
        />

        {/* Contas Conectadas */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Contas Conectadas</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie suas contas sociais conectadas
            </p>
          </div>

          {/* Debug Info */}
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Debug: authUser = {authUser ? "Sim" : "Não"}, googleAccount ={" "}
              {googleAccount ? "Sim" : "Não"}
            </p>
            {googleAccount && (
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Email: {googleAccount.extra_data?.email}
              </p>
            )}
          </div>

          {/* Google Account */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              {/* Avatar do usuário - usa a imagem do Google quando disponível */}
              {googleAccount?.extra_data?.picture ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={googleAccount.extra_data.picture}
                    alt={`Avatar de ${
                      googleAccount.extra_data.name || "usuário"
                    }`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback para ícone se a imagem falhar
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  {/* Fallback icon - hidden by default */}
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hidden">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
              )}

              {googleAccount ? (
                <div>
                  <p className="font-medium text-foreground">Google</p>
                  <p className="text-sm text-muted-foreground">
                    {googleAccount.extra_data?.email || "Conta conectada"}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-foreground">Google</p>
                  <p className="text-sm text-muted-foreground">Não conectado</p>
                </div>
              )}
            </div>

            {googleAccount ? (
              <Button
                onClick={() => handleDisconnect(googleAccount)}
                variant="outline"
                disabled={isDisconnecting}
              >
                {isDisconnecting ? "Desconectando..." : "Desconectar"}
              </Button>
            ) : (
              <GoogleOAuthButton onClick={handleConnectGoogle}>
                Conectar Google
              </GoogleOAuthButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
