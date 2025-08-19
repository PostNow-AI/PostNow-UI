import type { CampaignIdea } from "@/lib/services/ideaBankService";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Save, Sparkles, Trash2 } from "lucide-react";
import {
  Badge,
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
  Textarea,
} from "../ui";
import { JsonContentViewer } from "./JsonContentViewer";

interface IdeaListByPlatformProps {
  editingIdeas: CampaignIdea[];
  handleStatusChange: (
    idea: CampaignIdea,
    status: "draft" | "approved" | "archived"
  ) => void;
  handleImproveIdea: (idea: CampaignIdea) => void;
  setDeletingIdea: (idea: CampaignIdea) => void;
  handleSaveIdea: (idea: CampaignIdea) => void;
  handleIdeaUpdate: (index: number, field: string, value: string) => void;
  updateIdeaMutation: UseMutationResult<
    CampaignIdea,
    AxiosError<{ error: string }>,
    { id: number; data: Partial<CampaignIdea> },
    unknown
  >;
  ideasByPlatform: Record<string, CampaignIdea[]>;
}

export const IdeaListByPlatform = ({
  editingIdeas,
  handleStatusChange,
  handleImproveIdea,
  setDeletingIdea,
  handleSaveIdea,
  handleIdeaUpdate,
  updateIdeaMutation,
  ideasByPlatform,
}: IdeaListByPlatformProps) => {
  return (
    <div className="space-y-8">
      {Object.entries(ideasByPlatform).map(([platform, platformIdeas]) => (
        <div key={platform} className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-semibold">{platform}</h2>
            <span className="text-sm text-muted-foreground">
              ({platformIdeas.length}{" "}
              {platformIdeas.length === 1 ? "ideia" : "ideias"})
            </span>
          </div>

          <div className="space-y-4">
            {platformIdeas.map((idea, platformIndex) => {
              const globalIndex = editingIdeas.findIndex(
                (i) => i.id === idea.id || i === idea
              );
              return (
                <Card key={idea.id || `${platform}-${platformIndex}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {idea.content_type_display || idea.content_type}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Conteúdo para {platform}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={idea.status || "draft"}
                          onValueChange={(value) =>
                            handleStatusChange(
                              idea,
                              value as "draft" | "approved" | "archived"
                            )
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Rascunho</SelectItem>
                            <SelectItem value="approved">Aprovado</SelectItem>
                            <SelectItem value="archived">Arquivado</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleImproveIdea({
                              ...idea,
                              campaign_id: 0,
                              user_id: 0,
                            })
                          }
                          title="Melhorar com IA"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletingIdea(idea)}
                          title="Deletar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                      <Label htmlFor={`title-${globalIndex}`}>
                        Título
                        {!idea.title && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Campo Vazio
                          </Badge>
                        )}
                      </Label>
                      <Input
                        id={`title-${globalIndex}`}
                        value={idea.title || ""}
                        onChange={(e) =>
                          handleIdeaUpdate(globalIndex, "title", e.target.value)
                        }
                        placeholder="Título da ideia"
                        className={
                          !idea.title
                            ? "border-destructive bg-destructive/5"
                            : ""
                        }
                      />
                      {!idea.title && (
                        <p className="text-sm text-destructive">
                          Este campo está vazio. Adicione um título para sua
                          ideia.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${globalIndex}`}>
                        Descrição
                        {!idea.description && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Campo Vazio
                          </Badge>
                        )}
                      </Label>
                      <Textarea
                        id={`description-${globalIndex}`}
                        value={idea.description || ""}
                        onChange={(e) =>
                          handleIdeaUpdate(
                            globalIndex,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Descrição breve da ideia"
                        className={`min-h-[100px] ${
                          !idea.description
                            ? "border-destructive bg-destructive/5"
                            : ""
                        }`}
                      />
                      {!idea.description && (
                        <p className="text-sm text-destructive">
                          Este campo está vazio. Adicione uma descrição para sua
                          ideia.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`content-${globalIndex}`}>Conteúdo</Label>
                      <JsonContentViewer
                        content={idea.content || ""}
                        readOnly={false}
                        onContentChange={(newContent) =>
                          handleIdeaUpdate(globalIndex, "content", newContent)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
