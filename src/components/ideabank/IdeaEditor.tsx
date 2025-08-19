import { Button } from "@/components/ui";
import { useIdeaEditor } from "@/hooks/useIdeaEditor";
import type { CampaignIdea } from "@/lib/services/ideaBankService";
import { ArrowLeft } from "lucide-react";
import { AiImprovement } from "./AiImprovement";
import { DeleteIdea } from "./DeleteIdea";
import { EditIdeaDialog } from "./EditIdeaDialog";
import { IdeaComparison } from "./IdeaComparison";
import { IdeaListByPlatform } from "./IdeaListByPlatform";
import { ViewIdeaDialog } from "./ViewIdeaDialog";

interface IdeaEditorProps {
  ideas: CampaignIdea[];
  onBack: () => void;
}

export const IdeaEditor = ({ ideas, onBack }: IdeaEditorProps) => {
  const {
    editingIdeas,
    viewingIdea,
    editingIdea,
    deletingIdea,
    improvingIdea,
    improvementPrompt,
    showDiff,
    originalIdea,
    improvedIdea,
    improvementProgress,
    improvementStatus,
    improvementError,
    ideasByPlatform,
    updateIdeaMutation,
    improveIdeaMutation,
    handleIdeaUpdate,
    handleSaveIdea,
    handleStatusChange,
    handleDeleteIdea,
    handleImproveIdea,
    handleSubmitImprovement,
    handleSaveEditIdea,
    setViewingIdea,
    setEditingIdea,
    setDeletingIdea,
    setImprovingIdea,
    setImprovementPrompt,
    setShowDiff,
    setOriginalIdea,
    setImprovedIdea,
    setImprovementProgress,
    setImprovementStatus,
    setImprovementError,
  } = useIdeaEditor(ideas);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <IdeaListByPlatform
        editingIdeas={editingIdeas}
        handleStatusChange={handleStatusChange}
        handleImproveIdea={handleImproveIdea}
        setDeletingIdea={setDeletingIdea}
        handleSaveIdea={handleSaveIdea}
        handleIdeaUpdate={handleIdeaUpdate}
        updateIdeaMutation={updateIdeaMutation}
        ideasByPlatform={ideasByPlatform}
      />

      {/* Edit Modal */}
      <EditIdeaDialog
        editingIdea={editingIdea}
        setEditingIdea={setEditingIdea}
        handleSaveEditIdea={handleSaveEditIdea}
        updateIdeaMutation={updateIdeaMutation}
      />

      {/* Delete Confirmation Modal */}
      <DeleteIdea
        deletingIdea={deletingIdea}
        setDeletingIdea={setDeletingIdea}
        handleDeleteIdea={handleDeleteIdea}
      />

      {/* AI Improvement Modal */}
      <AiImprovement
        improvingIdea={improvingIdea}
        setImprovingIdea={setImprovingIdea}
        improvementPrompt={improvementPrompt}
        setImprovementPrompt={setImprovementPrompt}
        improvementStatus={improvementStatus}
        setImprovementStatus={setImprovementStatus}
        improvementProgress={improvementProgress}
        setImprovementProgress={setImprovementProgress}
        improvementError={improvementError}
        setImprovementError={setImprovementError}
        improveIdeaMutation={improveIdeaMutation}
        handleSubmitImprovement={handleSubmitImprovement}
      />

      {/* Idea Comparison Modal */}
      <IdeaComparison
        showDiff={showDiff}
        setShowDiff={setShowDiff}
        originalIdea={originalIdea}
        improvedIdea={improvedIdea}
        setOriginalIdea={setOriginalIdea}
        setImprovedIdea={setImprovedIdea}
      />

      {/* View Modal */}
      <ViewIdeaDialog
        viewingIdea={viewingIdea}
        setViewingIdea={setViewingIdea}
        setEditingIdea={setEditingIdea}
        setDeletingIdea={setDeletingIdea}
      />
    </div>
  );
};
