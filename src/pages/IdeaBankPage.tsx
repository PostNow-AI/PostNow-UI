import { IdeaGenerationDialog } from "@/components/ideabank/IdeaGenerationDialog";
import { IdeaList } from "@/components/ideabank/IdeaList";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useIdeaBank } from "@/hooks/useIdeaBank";
import { Archive, FileText, Lightbulb, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";

export const IdeaBankPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { ideas, stats, isLoading } = useIdeaBank();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            Banco de Ideias
          </h1>
          <p className="text-muted-foreground">
            Gere ideias criativas para suas campanhas usando IA
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Gerar Nova Ideia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Ideias
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_ideas || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.draft_ideas || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.approved_ideas || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivadas</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.archived_ideas || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ideas List */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Ideias</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as suas ideias de campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IdeaList ideas={ideas} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Generation Dialog */}
      <IdeaGenerationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};
