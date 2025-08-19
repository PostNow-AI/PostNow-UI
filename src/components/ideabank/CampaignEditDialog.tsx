import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Campaign } from "@/lib/services/ideaBankService";
import { CampaignEditForm } from "./CampaignEditForm";

interface CampaignEditDialogProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCampaign: Partial<Campaign>) => void;
  isLoading?: boolean;
}

export const CampaignEditDialog = ({
  campaign,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: CampaignEditDialogProps) => {
  if (!campaign) return null;

  const handleSave = (updatedCampaign: Partial<Campaign>) => {
    onSave(updatedCampaign);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-hidden flex flex-col"
        style={{ width: "95vw", maxWidth: "1200px" }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Campanha</DialogTitle>
          <DialogDescription>
            Atualize os dados básicos da campanha "{campaign.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <CampaignEditForm
            campaign={campaign}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
