/**
 * Instagram Connection Card Component
 *
 * Card showing Instagram account connection status with actions.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Instagram,
  Loader2,
  Unlink,
} from "lucide-react";
import type { InstagramAccountListItem, InstagramAccountStatus } from "../types";

interface InstagramConnectionCardProps {
  account: InstagramAccountListItem;
  onDisconnect: (accountId: number) => void;
  isDisconnecting?: boolean;
}

const STATUS_CONFIG: Record<
  InstagramAccountStatus,
  { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  connected: {
    label: "Conectado",
    icon: <CheckCircle className="h-3 w-3" />,
    variant: "default",
  },
  disconnected: {
    label: "Desconectado",
    icon: <Unlink className="h-3 w-3" />,
    variant: "secondary",
  },
  token_expired: {
    label: "Token Expirado",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "destructive",
  },
  error: {
    label: "Erro",
    icon: <AlertTriangle className="h-3 w-3" />,
    variant: "destructive",
  },
};

function TokenStatusBadge({
  isValid,
  daysUntilExpiration,
}: {
  isValid: boolean;
  daysUntilExpiration?: number;
}) {
  if (!isValid) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Token Expirado
      </Badge>
    );
  }

  if (daysUntilExpiration !== undefined && daysUntilExpiration <= 7) {
    return (
      <Badge variant="outline" className="gap-1 text-orange-600 border-orange-300">
        <AlertTriangle className="h-3 w-3" />
        Expira em {daysUntilExpiration} dias
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 text-green-600 border-green-300">
      <CheckCircle className="h-3 w-3" />
      Token Valido
    </Badge>
  );
}

export function InstagramConnectionCard({
  account,
  onDisconnect,
  isDisconnecting = false,
}: InstagramConnectionCardProps) {
  const statusConfig = STATUS_CONFIG[account.status];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Conta Conectada
          </CardTitle>
          <Badge variant={statusConfig.variant} className="gap-1">
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={account.profile_picture_url ?? ""}
              alt={account.instagram_username}
            />
            <AvatarFallback className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]">
              <Instagram className="h-8 w-8 text-white" />
            </AvatarFallback>
          </Avatar>

          {/* Account Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">
              @{account.instagram_username}
            </p>
            {account.instagram_name && (
              <p className="text-sm text-muted-foreground truncate">
                {account.instagram_name}
              </p>
            )}
            <div className="mt-2">
              <TokenStatusBadge isValid={account.is_token_valid} />
            </div>
          </div>

          {/* Disconnect Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDisconnecting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {isDisconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Unlink className="h-4 w-4 mr-2" />
                    Desconectar
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desconectar conta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja desconectar a conta @
                  {account.instagram_username}? Voce nao podera mais agendar
                  posts para esta conta ate conecta-la novamente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDisconnect(account.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Desconectar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Token Warning */}
        {!account.is_token_valid && (
          <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              O token de acesso expirou. Reconecte sua conta para continuar
              agendando posts.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
