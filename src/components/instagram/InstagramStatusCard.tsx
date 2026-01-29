/**
 * InstagramStatusCard - Widget showing connection status with quick sync
 */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInstagramConnection } from "@/hooks/useInstagramConnection";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  Instagram,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  Unlink,
} from "lucide-react";
import { useState } from "react";
import { InstagramConnectionWizard } from "./InstagramConnectionWizard";

export function InstagramStatusCard() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const {
    isConnected,
    account,
    daysUntilExpiration,
    needsReconnection,
    sync,
    disconnect,
    isSyncing,
    isDisconnecting,
    syncError,
    isLoadingStatus,
  } = useInstagramConnection();

  const handleSync = () => {
    sync();
  };

  const handleDisconnect = () => {
    if (confirm("Tem certeza que deseja desconectar sua conta do Instagram?")) {
      disconnect();
    }
  };

  if (isLoadingStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-600" />
              <CardTitle>Instagram</CardTitle>
            </div>
            {isConnected ? (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Unlink className="h-3 w-3 mr-1" />
                Desconectado
              </Badge>
            )}
          </div>
          <CardDescription>
            {isConnected
              ? "Gerencie sua conexão e sincronize dados"
              : "Conecte para acessar métricas e insights"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected && account ? (
            <>
              {/* Account Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {account.profile_picture_url ? (
                  <img
                    src={account.profile_picture_url}
                    alt={account.username}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {account.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">@{account.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.followers_count.toLocaleString()} seguidores
                  </p>
                </div>
                <Badge variant="outline">{account.account_type}</Badge>
              </div>

              {/* Warnings */}
              {needsReconnection && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Sua conexão expirou. Reconecte para continuar acessando
                    métricas.
                  </AlertDescription>
                </Alert>
              )}

              {!needsReconnection &&
                daysUntilExpiration !== undefined &&
                daysUntilExpiration < 7 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sua conexão expira em {daysUntilExpiration} dias.
                      Recomendamos reconectar em breve.
                    </AlertDescription>
                  </Alert>
                )}

              {/* Last Sync */}
              {account.last_sync_at && (
                <div className="text-sm text-muted-foreground">
                  Última sincronização:{" "}
                  {formatDistanceToNow(new Date(account.last_sync_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </div>
              )}

              {/* Sync Error */}
              {syncError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {syncError.message ||
                      "Erro ao sincronizar. Tente novamente."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSync}
                  disabled={isSyncing || needsReconnection}
                  className="flex-1"
                  variant="default"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sincronizar
                    </>
                  )}
                </Button>
                {needsReconnection ? (
                  <Button
                    onClick={() => setWizardOpen(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Reconectar
                  </Button>
                ) : (
                  <Button
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    variant="outline"
                    className="flex-1"
                  >
                    {isDisconnecting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Unlink className="h-4 w-4 mr-2" />
                    )}
                    Desconectar
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Conecte sua conta do Instagram para acessar métricas detalhadas,
                análise de crescimento e insights sobre seu público.
              </p>
              <Button onClick={() => setWizardOpen(true)} className="w-full">
                <Instagram className="h-4 w-4 mr-2" />
                Conectar Instagram
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <InstagramConnectionWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
      />
    </>
  );
}
