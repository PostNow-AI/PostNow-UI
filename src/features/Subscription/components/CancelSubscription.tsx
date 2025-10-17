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
  Button,
} from "@/components/ui";

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentSubscription: {
    plan: {
      name: string;
    };
    end_date: string | null;
  } | null;
  handleCancelSubscription: () => Promise<void>;
  cancelSubscription: {
    isPending: boolean;
  };
}

export const CancelSubscription = ({
  isDialogOpen,
  setIsDialogOpen,
  currentSubscription,
  handleCancelSubscription,
  cancelSubscription,
}: Props) => {
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Cancelar Assinatura
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja cancelar sua assinatura do plano "
            {currentSubscription?.plan.name}"?
            <br />
            <br />
            <strong>O que acontecerá:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Sua assinatura será cancelada imediatamente</li>
              <li>
                Você manterá acesso até{" "}
                {currentSubscription?.end_date
                  ? new Date(currentSubscription?.end_date).toLocaleDateString(
                      "pt-BR"
                    )
                  : "o fim do período atual"}
              </li>
              <li>Não haverá cobrança automática na próxima renovação</li>
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
            {cancelSubscription.isPending ? "Cancelando..." : "Sim, Cancelar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
