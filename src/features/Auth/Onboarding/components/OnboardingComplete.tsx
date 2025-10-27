import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

interface Props {
  showSuccessDialog: boolean;
  handleSuccessDialogClose: () => void;
}

export const OnboardingComplete = ({
  showSuccessDialog,
  handleSuccessDialogClose,
}: Props) => {
  return (
    <Dialog open={showSuccessDialog}>
      <DialogContent className="sm:max-w-[512px] border-0">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold">
              Suas ideias de posts já estão automatizadas! 🎉{" "}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            <p className="mb-4 text-sm">
              Todos os dias por volta das{" "}
              <span className="font-bold">
                6h da manhã você receberá ideias de post para utilizar durante o
                dia
              </span>
              . Fique de olho no seu email!
            </p>
            <p className="text-sm">
              Enquanto isso, fique a vontade para criar novas ideias de post
              quando quiser em nossa área de posts.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleSuccessDialogClose}>Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
