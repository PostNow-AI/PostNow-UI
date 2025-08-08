/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IdeaEditorProps {
  ideas: any[];
  onBack: () => void;
  onClose: () => void;
}

export const IdeaEditor = ({ ideas, onBack, onClose }: IdeaEditorProps) => {
  const [editingIdeas, setEditingIdeas] = useState(ideas);
  const queryClient = useQueryClient();

  const updateIdeaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.patch(`/api/v1/ideabank/ideas/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ideia atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["campaign-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Erro ao atualizar ideia");
    },
  });

  const handleIdeaUpdate = (index: number, field: string, value: string) => {
    const updatedIdeas = [...editingIdeas];
    updatedIdeas[index] = { ...updatedIdeas[index], [field]: value };
    setEditingIdeas(updatedIdeas);
  };

  const handleSaveIdea = (idea: any) => {
    updateIdeaMutation.mutate({
      id: idea.id,
      data: {
        title: idea.title,
        description: idea.description,
        content: idea.content,
        status: idea.status,
      },
    });
  };

  const handleStatusChange = (idea: any, status: string) => {
    updateIdeaMutation.mutate({
      id: idea.id,
      data: { status },
    });
  };

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {editingIdeas.map((idea, index) => (
          <Card key={idea.id || index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {idea.platform_display || idea.platform}
                    <span className="text-sm text-muted-foreground">
                      ({idea.content_type_display || idea.content_type})
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Ideia gerada para {idea.platform_display || idea.platform}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={idea.status}
                    onValueChange={(value) => handleStatusChange(idea, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => handleSaveIdea(idea)}
                    disabled={updateIdeaMutation.isPending}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>Título</Label>
                <Input
                  id={`title-${index}`}
                  value={idea.title}
                  onChange={(e) =>
                    handleIdeaUpdate(index, "title", e.target.value)
                  }
                  placeholder="Título da ideia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Descrição</Label>
                <Textarea
                  id={`description-${index}`}
                  value={idea.description}
                  onChange={(e) =>
                    handleIdeaUpdate(index, "description", e.target.value)
                  }
                  placeholder="Descrição breve da ideia"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`content-${index}`}>Conteúdo</Label>
                <Textarea
                  id={`content-${index}`}
                  value={idea.content}
                  onChange={(e) =>
                    handleIdeaUpdate(index, "content", e.target.value)
                  }
                  placeholder="Conteúdo detalhado da ideia"
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
