import {
  Button,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components";
import { useCreateCheckoutSession } from "@/features/Subscription/hooks/useSubscription";
import { formatToBRL } from "@/utils";
import {} from "@radix-ui/react-dialog";
import { CreditCard, Loader2, Wallet } from "lucide-react";

export const NoSubscriptionDialog = () => {
  const createCheckout = useCreateCheckoutSession();

  const handleSubscribe = async () => {
    try {
      await createCheckout.mutateAsync({
        plan_id: 12,
        upgrade: false,
      });
    } catch {
      // Handle error
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary-light" />
            <CardTitle className="text-xl font-semibold">
              Assinatura necessária
            </CardTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-slate-400 text-sm text-left">
            Para criar posts com IA e receber ideias diárias no seu e-mail você
            precisa de uma assinatura ativa.
          </p>

          <div className="bg-slate-700 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm text-primary-light flex items-center gap-2">
              O que está incluso?
            </h4>
            <ul className="text-sm text-white space-y-1 text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                30 ideias no seu email, por mês
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                30 gerações manuais de post com IA, por mês
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                Apenas R$ 10 até dia 25 de Dezembro
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />7 dias de
                teste gratúito
              </li>
            </ul>
          </div>

          <Button className="w-full" onClick={() => handleSubscribe()}>
            {!createCheckout.isPending ? (
              <>
                <CreditCard /> Comprar agora por {formatToBRL(10)}
              </>
            ) : (
              <>
                <Loader2 /> Processando...
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
