import type { CampaignIdea } from "@/lib/services/ideaBankService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui";

interface DeleteIdeaProps {
  deletingIdea: CampaignIdea | null;
  setDeletingIdea: (idea: CampaignIdea | null) => void;
  handleDeleteIdea: (idea: CampaignIdea) => void;
}

export const DeleteIdea = ({
  deletingIdea,
  setDeletingIdea,
  handleDeleteIdea,
}: DeleteIdeaProps) => {
  return (
    <AlertDialog
      open={deletingIdea !== null}
      onOpenChange={(open) => {
        if (!open) setDeletingIdea(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar a ideia "{deletingIdea?.title}"? Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deletingIdea && handleDeleteIdea(deletingIdea)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
