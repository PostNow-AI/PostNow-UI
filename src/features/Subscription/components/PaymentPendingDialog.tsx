import {
  Button,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components";
import { AlertTriangle, Clock, ExternalLink } from "lucide-react";

interface PaymentPendingDialogProps {
  planName: string;
  timePendingMinutes?: number;
  lastError?: string;
}

export const PaymentPendingDialog = ({
  planName,
  timePendingMinutes,
  lastError,
}: PaymentPendingDialogProps) => {
  const handleContactSupport = () => {
    window.open("mailto:support@postnow.com.br", "_blank");
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-xl font-semibold">
              ⚠️ Pagamento Pendente
            </CardTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Seu pagamento para o plano <strong>"{planName}"</strong> está
              aguardando confirmação bancária.
            </p>
          </div>

          {timePendingMinutes !== undefined && timePendingMinutes > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span>
                Pendente há {timePendingMinutes} minuto
                {timePendingMinutes !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              O que fazer agora?
            </h4>
            <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-decimal list-inside">
              <li>
                Verifique seu <strong>email</strong> ou <strong>SMS</strong>{" "}
                para confirmação 3D Secure do seu banco
              </li>
              <li>
                Complete a <strong>autenticação bancária</strong> solicitada
              </li>
              <li>
                Aguarde alguns minutos para o pagamento ser processado
              </li>
              <li>
                <button
                  onClick={handleRefreshPage}
                  className="text-primary-light hover:underline inline-flex items-center gap-1"
                >
                  Recarregue esta página
                </button>{" "}
                para verificar se foi aprovado
              </li>
            </ol>
          </div>

          {lastError && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Detalhes:</strong> {lastError}
              </p>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              ⚠️ <strong>Importante:</strong> Enquanto o pagamento não for
              confirmado, você não poderá utilizar os recursos da plataforma.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRefreshPage}
              >
                Atualizar Status
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleContactSupport}
              >
                <ExternalLink className="h-4 w-4" />
                Falar com Suporte
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
