/**
 * LoginDetailsSheet Component
 * Shows detailed list of logins when clicking on the funnel
 * Uses Drawer for swipe-to-close functionality
 */

import { useQuery } from "@tanstack/react-query";
import { User, Calendar, CreditCard, Loader2, LogIn, Check, XCircle } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { dashboardApiService } from "@/lib/dashboard-api";
import type { PeriodDays, LoginDetail } from "../types";

export interface LoginDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  days: PeriodDays;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LoginCard = ({ login }: { login: LoginDetail }) => {
  const userName = login.user.first_name && login.user.last_name
    ? `${login.user.first_name} ${login.user.last_name}`
    : login.user.username || login.user.email;

  const hasSubscription = login.subscription?.has_subscription;

  return (
    <div className="p-4 rounded-lg bg-card border border-border/50 space-y-3">
      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-purple-500/10">
          <User className="h-4 w-4 text-purple-500" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground">{login.user.email}</p>
        </div>
        {/* Subscription badge */}
        {hasSubscription ? (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10">
            <Check className="h-3 w-3 text-green-500" />
            <span className="text-xs font-medium text-green-500">Assinante</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
            <XCircle className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Não assinou</span>
          </div>
        )}
      </div>

      {/* Date and Subscription info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-xs">Login</p>
            <p className="font-medium">{formatDate(login.timestamp)}</p>
          </div>
        </div>
        {hasSubscription && login.subscription.plan_name && (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-muted-foreground text-xs">Plano</p>
              <p className="font-medium text-green-600">{login.subscription.plan_name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const LoginDetailsSheet = ({
  open,
  onOpenChange,
  days,
}: LoginDetailsSheetProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "login-details", days],
    queryFn: () => dashboardApiService.getLoginDetails(days),
    enabled: open,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="pb-4 border-b">
          <DrawerTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-purple-500" />
            Logins
            {data && (
              <span className="text-sm font-normal text-muted-foreground">
                ({data.count} no período)
              </span>
            )}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-muted-foreground">
              Erro ao carregar logins
            </div>
          )}

          {data && data.logins.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum login no período
            </div>
          )}

          {data?.logins.map((login) => (
            <LoginCard key={login.id} login={login} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
