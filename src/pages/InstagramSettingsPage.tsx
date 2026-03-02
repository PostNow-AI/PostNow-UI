/**
 * Instagram Settings Page
 *
 * Page for managing Instagram account connection.
 */

import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InstagramConnectButton,
  InstagramConnectionCard,
  useInstagramAccounts,
  useInstagramConnection,
} from "@/features/InstagramScheduling";
import { AlertCircle, Info, Instagram, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center mb-6">
            <Instagram className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma conta conectada
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Conecte sua conta Instagram Business ou Creator para comecar a
            agendar posts automaticamente.
          </p>
          <InstagramConnectButton
            onClick={onConnect}
            isLoading={isConnecting}
            size="lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function RequirementsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Info className="h-4 w-4" />
          Requisitos para Conexao
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium text-sm">Conta Business ou Creator</p>
              <p className="text-xs text-muted-foreground">
                Contas pessoais do Instagram nao sao suportadas pela API do Meta.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium text-sm">Pagina do Facebook Vinculada</p>
              <p className="text-xs text-muted-foreground">
                Sua conta Instagram deve estar conectada a uma Pagina do Facebook.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium text-sm">Permissoes de Administrador</p>
              <p className="text-xs text-muted-foreground">
                Voce precisa ser administrador da Pagina do Facebook vinculada.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InstagramSettingsPage() {
  const {
    accounts,
    isLoading,
    isError,
    error,
    disconnectAccount,
    isDisconnecting,
  } = useInstagramAccounts();

  const { initiateConnection, isConnecting } = useInstagramConnection();

  const handleConnect = () => {
    initiateConnection(true); // Redirect in same window
  };

  return (
    <Container
      headerTitle="Configuracoes do Instagram"
      headerDescription="Conecte e gerencie sua conta Instagram para publicacao automatica."
      containerActions={
        accounts.length > 0 && (
          <Link to="/scheduled-posts">
            <Button variant="outline" size="sm">
              <Link2 className="h-4 w-4 mr-2" />
              Ver Posts Agendados
            </Button>
          </Link>
        )
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Error State */}
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar contas</AlertTitle>
              <AlertDescription>
                {(error as Error)?.message || "Tente novamente mais tarde."}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSkeleton />}

          {/* Connected Accounts */}
          {!isLoading && !isError && accounts.length > 0 && (
            <div className="space-y-4">
              {accounts.map((account) => (
                <InstagramConnectionCard
                  key={account.id}
                  account={account}
                  onDisconnect={disconnectAccount}
                  isDisconnecting={isDisconnecting}
                />
              ))}

              {/* Option to connect another account */}
              <Card className="border-dashed">
                <CardContent className="py-6">
                  <div className="flex flex-col items-center text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Deseja conectar outra conta?
                    </p>
                    <InstagramConnectButton
                      onClick={handleConnect}
                      isLoading={isConnecting}
                      size="sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && accounts.length === 0 && (
            <EmptyState onConnect={handleConnect} isConnecting={isConnecting} />
          )}
        </div>

        {/* Requirements Card */}
        <div>
          <RequirementsCard />
        </div>
      </div>
    </Container>
  );
}

export default InstagramSettingsPage;
