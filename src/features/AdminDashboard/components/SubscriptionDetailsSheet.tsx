/**
 * SubscriptionDetailsSheet Component
 * Shows detailed list of subscriptions when clicking on the funnel
 * Uses Drawer for swipe-to-close functionality
 */

import { useQuery } from "@tanstack/react-query";
import { User, Calendar, CreditCard, Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { dashboardApiService } from "@/lib/dashboard-api";
import type { PeriodDays, SubscriptionDetail } from "../types";
import { cn } from "@/lib/utils";

export interface SubscriptionDetailsSheetProps {
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

const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    case "expired":
      return "bg-gray-500/20 text-gray-400";
    case "pending_payment":
      return "bg-yellow-500/20 text-yellow-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const SubscriptionCard = ({ subscription }: { subscription: SubscriptionDetail }) => {
  const userName = subscription.user.first_name && subscription.user.last_name
    ? `${subscription.user.first_name} ${subscription.user.last_name}`
    : subscription.user.username || subscription.user.email;

  return (
    <div className="p-4 rounded-lg bg-card border border-border/50 space-y-3">
      {/* User info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{subscription.user.email}</p>
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 rounded text-xs font-medium",
          getStatusColor(subscription.status)
        )}>
          {subscription.status_display}
        </span>
      </div>

      {/* Plan and date */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-xs">Plano</p>
            <p className="font-medium">{subscription.plan.name}</p>
            <p className="text-xs text-muted-foreground">
              {subscription.plan.interval_display} - R$ {subscription.plan.price}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-xs">Data</p>
            <p className="font-medium">{formatDate(subscription.start_date)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SubscriptionDetailsSheet = ({
  open,
  onOpenChange,
  days,
}: SubscriptionDetailsSheetProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "subscription-details", days],
    queryFn: () => dashboardApiService.getSubscriptionDetails(days),
    enabled: open,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="pb-4 border-b">
          <DrawerTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            Assinaturas
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
              Erro ao carregar assinaturas
            </div>
          )}

          {data && data.subscriptions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma assinatura no período
            </div>
          )}

          {data?.subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
