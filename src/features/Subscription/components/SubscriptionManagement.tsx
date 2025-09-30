import { useState } from "react";
import { toast } from "sonner";
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
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  useCancelSubscription,
  useUserSubscription,
} from "../hooks/useSubscription";

export const SubscriptionManagement = () => {
  const { data: subscription, isLoading } = useUserSubscription();
  const cancelSubscription = useCancelSubscription();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription.mutateAsync();

      if (result.success) {
        toast.success(result.message || "Assinatura cancelada com sucesso!");
        setIsDialogOpen(false);
      } else {
        toast.error(result.message || "Erro ao cancelar assinatura");
      }
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      toast.error("Erro inesperado ao cancelar assinatura");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gerenciar Assinatura</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Você não possui uma assinatura ativa para gerenciar.
          </p>
          <p className="text-sm text-muted-foreground">
            Explore nossos planos na aba "Planos" para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === "active";
  const isCancelled = subscription.status === "cancelled";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gerenciar Assinatura</h2>
        <p className="text-muted-foreground">
          Gerencie sua assinatura atual e configure suas preferências
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações da Assinatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Plano:</span>
              <div className="font-medium">{subscription.plan.name}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <div className="font-medium">{subscription.status_display}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Preço:</span>
              <div className="font-medium">
                R$ {Number(subscription.plan.price).toFixed(2)} /{" "}
                {subscription.plan.interval_display}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">
                {isActive ? "Próxima cobrança:" : "Data de fim:"}
              </span>
              <div className="font-medium">
                {subscription.end_date
                  ? new Date(subscription.end_date).toLocaleDateString("pt-BR")
                  : "Vitalício"}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Assinatura iniciada em:{" "}
            {new Date(subscription.start_date).toLocaleDateString("pt-BR")}
          </div>
        </CardContent>
      </Card>

      {isActive && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-destructive">
              Cancelar Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ao cancelar sua assinatura, você continuará tendo acesso aos
              recursos até o final do período de cobrança atual. Após isso, sua
              conta retornará ao plano gratuito.
            </p>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Cancelar Assinatura
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza de que deseja cancelar sua assinatura do plano "
                    {subscription.plan.name}"?
                    <br />
                    <br />
                    <strong>O que acontecerá:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Sua assinatura será cancelada imediatamente</li>
                      <li>
                        Você manterá acesso até{" "}
                        {subscription.end_date
                          ? new Date(subscription.end_date).toLocaleDateString(
                              "pt-BR"
                            )
                          : "o fim do período atual"}
                      </li>
                      <li>
                        Não haverá cobrança automática na próxima renovação
                      </li>
                      <li>Você pode reativar a qualquer momento</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Manter Assinatura</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelSubscription}
                    disabled={cancelSubscription.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {cancelSubscription.isPending
                      ? "Cancelando..."
                      : "Sim, Cancelar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}

      {isCancelled && (
        <Card className="w-full border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">
              Assinatura Cancelada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-600 mb-4">
              Sua assinatura foi cancelada e não será renovada automaticamente.
            </p>
            <p className="text-sm text-orange-500">
              Você pode reativar sua assinatura a qualquer momento na aba
              "Planos".
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
