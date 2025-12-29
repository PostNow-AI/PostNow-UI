/**
 * Dialog para editar post individual.
 * Adaptado de GeneratingPostSheet.tsx (< 200 linhas).
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { Edit3, Eye } from "lucide-react";
import type { CampaignPost } from "../../types";

interface PostEditorDialogProps {
  post: CampaignPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (postId: number, content: string) => void;
}

export const PostEditorDialog = ({
  post,
  isOpen,
  onClose,
  onSave,
}: PostEditorDialogProps) => {
  const [editedContent, setEditedContent] = useState(
    post?.post?.ideas?.[0]?.content || ""
  );

  const handleSave = () => {
    if (post) {
      onSave(post.id, editedContent);
      onClose();
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Post {post.sequence_order}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Texto do Post</Label>
              <Textarea
                id="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="Digite o texto do post..."
              />
              <p className="text-xs text-muted-foreground">
                {editedContent.length} caracteres
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Preview do Post</h4>
              <div className="whitespace-pre-wrap text-sm">
                {editedContent || "Texto vazio..."}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

