import { PublicIdeaGenerationForm } from "@/components/ideabank/PublicIdeaGenerationForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, Download, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface GeneratedIdea {
  title: string;
  description: string;
  content: string;
  platform: string;
  content_type: string;
  variation_type?: string;
  headline?: string;
  copy?: string;
  cta?: string;
  hashtags?: string[];
  visual_description?: string;
  color_composition?: string;
}

interface PublicIdeaGenerationFormData {
  // Campaign info
  title: string;
  description?: string;

  // Campaign objective
  objectives: string[];

  // Target persona
  persona_age?: string;
  persona_location?: string;
  persona_income?: string;
  persona_interests?: string;
  persona_behavior?: string;
  persona_pain_points?: string;

  // Social platforms and content types
  platforms: string[];
  content_types?: Record<string, string[]>;

  // Voice tone
  voice_tone: string;

  // Campaign details for AI generation
  product_description?: string;
  value_proposition?: string;
  campaign_urgency?: string;
}

export const PublicIdeaGenerationPage = () => {
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);

  // Fetch options using useQuery
  const { data: options, isLoading: isLoadingOptions } = useQuery({
    queryKey: ["public-idea-options"],
    queryFn: async () => {
      const response = await api.get("/api/v1/ideabank/public/options/");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Generate ideas using useMutation
  const generateIdeasMutation = useMutation({
    mutationFn: async (formData: PublicIdeaGenerationFormData) => {
      const response = await api.post(
        "/api/v1/ideabank/public/generate/",
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      setGeneratedIdeas(data.ideas);
      toast.success("Ideias geradas com sucesso!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao gerar ideias";
      toast.error(errorMessage);
    },
  });

  const handleGenerateIdeas = (formData: PublicIdeaGenerationFormData) => {
    generateIdeasMutation.mutate(formData);
  };

  const handleCopyIdea = async (idea: GeneratedIdea) => {
    const ideaText = `Título: ${idea.title}\n\nDescrição: ${idea.description}\n\nConteúdo: ${idea.content}\n\nPlataforma: ${idea.platform}\nTipo de Conteúdo: ${idea.content_type}`;

    try {
      await navigator.clipboard.writeText(ideaText);
      toast.success("Ideia copiada para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar ideia");
    }
  };

  const handleDownloadIdea = (idea: GeneratedIdea) => {
    const ideaText = `Título: ${idea.title}\n\nDescrição: ${idea.description}\n\nConteúdo: ${idea.content}\n\nPlataforma: ${idea.platform}\nTipo de Conteúdo: ${idea.content_type}`;

    const blob = new Blob([ideaText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${idea.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Ideia baixada com sucesso!");
  };

  const handleBackToForm = () => {
    setGeneratedIdeas([]);
  };

  // If ideas were generated, show them
  if (generatedIdeas.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToForm}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Formulário
              </Button>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Ideias Geradas</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Ideas Display */}
          <div className="space-y-6">
            {generatedIdeas.map((idea, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{idea.title}</CardTitle>
                      <CardDescription>
                        {idea.platform} • {idea.content_type}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyIdea(idea)}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadIdea(idea)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                      Descrição
                    </h4>
                    <p className="text-foreground">{idea.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                      Conteúdo
                    </h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {idea.content}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Call to Action */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Gostou das ideias geradas?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Crie uma conta para salvar suas ideias, personalizar com seu
                  perfil e acessar recursos avançados.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link to="/login">Fazer Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/register">Criar Conta</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show the form
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Login
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Gerador de Ideias</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">
                Gere Ideias Criativas para Suas Campanhas
              </CardTitle>
              <CardDescription className="text-lg">
                Use nossa IA para criar ideias estratégicas de marketing
                digital. Preencha o formulário abaixo e receba ideias
                personalizadas para suas campanhas.
              </CardDescription>
            </CardHeader>
          </Card>

          {isLoadingOptions ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Carregando opções...</p>
              </CardContent>
            </Card>
          ) : (
            <PublicIdeaGenerationForm
              options={options || undefined}
              onSubmit={handleGenerateIdeas}
              isGenerating={generateIdeasMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
};
