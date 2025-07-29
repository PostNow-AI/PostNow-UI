import { GoogleOAuthButton } from "@/components/GoogleOAuthButton";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Loading,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { Link } from "react-router-dom";

export function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const {
    socialAccountsData,
    isLoading,
    error,
    handleDisconnect,
    handleConnectGoogle,
    getGoogleAccount,
    isDisconnecting,
  } = useSocialAccounts();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  const googleAccount = getGoogleAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Configurações da Conta
                </CardTitle>
              </div>
              <div className="space-x-4">
                <Link
                  to="/home"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Voltar ao Início
                </Link>
                <Button onClick={logout} variant="outline">
                  Sair
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* User Info Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Nome:</strong> {user?.first_name} {user?.last_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Connected Accounts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contas Conectadas</CardTitle>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                      Falha ao carregar contas conectadas
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Google Account */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              viewBox="0 0 24 24"
                            >
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

                          {googleAccount ? (
                            <div>
                              <p className="font-medium text-gray-900">
                                Google
                              </p>
                              <p className="text-sm text-gray-600">
                                {googleAccount.extra_data.email}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium text-gray-900">
                                Google
                              </p>
                              <p className="text-sm text-gray-600">
                                Não conectado
                              </p>
                            </div>
                          )}
                        </div>

                        {googleAccount ? (
                          <Button
                            onClick={() => handleDisconnect(googleAccount)}
                            variant="outline"
                            disabled={isDisconnecting}
                          >
                            {isDisconnecting
                              ? "Desconectando..."
                              : "Desconectar"}
                          </Button>
                        ) : (
                          <GoogleOAuthButton onClick={handleConnectGoogle}>
                            Conectar Google
                          </GoogleOAuthButton>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {socialAccountsData?.total_count === 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhuma conta social conectada</p>
                        <p className="text-sm">
                          Conecte suas contas sociais para facilitar o login
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
