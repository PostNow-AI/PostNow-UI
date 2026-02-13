// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  Copy,
  Edit3,
} from "lucide-react";
import type { OpportunityItem } from "../types";
import type { PostCreationResponse, PostCreationData } from "@/features/IdeaBank/types";
import { InstagramPreview } from "./InstagramPreview";
import { ideaBankService } from "@/features/IdeaBank/services";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Switch,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from "@/components/ui";
import { postObjectiveOptions, postTypeOptions } from "@/schemas/postSchema";
import { toast } from "sonner";

const customizationSchema = z.object({
  objective: z.enum(["sales", "branding", "engagement", "awareness", "lead_generation", "education"]),
  type: z.enum(["post", "story", "reel", "carousel"]),
  custom_instructions: z.string().optional(),
  include_image: z.boolean(),
});

type CustomizationFormData = z.infer<typeof customizationSchema>;

type Step = "customize" | "generating" | "preview";

interface GeneratingPostSheetProps {
  opportunity: OpportunityItem | null;
  isGenerating: boolean;
  generatedPost: PostCreationResponse | null;
  error: Error | null;
  businessName: string;
  onClose: () => void;
  onGenerate: (params: {
    opportunity: OpportunityItem;
    customInstructions?: string;
    objective?: PostCreationData["objective"];
    type?: PostCreationData["type"];
    includeImage?: boolean;
  }) => void;
}

export const GeneratingPostSheet = ({
  opportunity,
  isGenerating,
  generatedPost,
  error,
  businessName,
  onClose,
  onGenerate,
}: GeneratingPostSheetProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<Step>("customize");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [editableContent, setEditableContent] = useState("");

  const form = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      objective: "branding",
      type: "post",
      custom_instructions: "",
      include_image: true,
    },
  });

  const isOpen = !!opportunity;
  
  // Watch selected type to control image generation availability
  const selectedType = form.watch("type");
  const canGenerateImage = selectedType === "post";

  // Auto-disable image generation when switching to reels/story
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type" && value.type !== "post" && value.include_image) {
        form.setValue("include_image", false);
        toast.info("Geração de imagem desabilitada", {
          description: "Imagens só podem ser geradas para posts do tipo Feed"
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Simulate progress bar during generation with realistic timing
  useEffect(() => {
    if (isGenerating) {
      setCurrentStep("generating");
      setProgress(0);
      setProgressMessage("Iniciando...");

      // Detect if generating image for realistic timing
      const includeImage = form.getValues("include_image");
      
      const progressSteps = includeImage ? [
        // WITH IMAGE (15-20s total - matches backend reality)
        { progress: 15, message: "Analisando oportunidade...", delay: 1000 },
        { progress: 25, message: "Gerando texto criativo...", delay: 2500 },
        { progress: 40, message: "Criando descrição visual detalhada...", delay: 5000 },
        { progress: 55, message: "Conversando com IA de imagens...", delay: 8000 },
        { progress: 70, message: "Gerando imagem com Gemini...", delay: 11000 },
        { progress: 85, message: "Processando e otimizando pixels...", delay: 14500 },
        { progress: 95, message: "Salvando imagem no servidor...", delay: 17000 },
      ] : [
        // WITHOUT IMAGE (5-7s total - faster)
        { progress: 25, message: "Analisando fonte...", delay: 1000 },
        { progress: 50, message: "Gerando conteúdo criativo...", delay: 2500 },
        { progress: 75, message: "Refinando texto...", delay: 4000 },
        { progress: 95, message: "Finalizando...", delay: 5500 },
      ];

      const timers = progressSteps.map(({ progress: p, message, delay }) =>
        setTimeout(() => {
          setProgress(p);
          setProgressMessage(message);
        }, delay)
      );

      return () => timers.forEach(clearTimeout);
    }
  }, [isGenerating, form]);

  // Update to preview step when generation completes
  useEffect(() => {
    if (generatedPost && !isGenerating) {
      setCurrentStep("preview");
      setProgress(100);
      setProgressMessage("Concluído!");
      setEditableContent(generatedPost.idea.content || "");
    }
  }, [generatedPost, isGenerating]);

  // Reset to error step if error occurs
  useEffect(() => {
    if (error && !isGenerating) {
      setCurrentStep("customize");
      setProgress(0);
    }
  }, [error, isGenerating]);

  const handleGenerate = (data: CustomizationFormData) => {
    if (!opportunity) return;

    onGenerate({
      opportunity,
      customInstructions: data.custom_instructions,
      objective: data.objective,
      type: data.type,
      includeImage: data.include_image,
    });
  };

  const handleBackToCustomize = () => {
    setCurrentStep("customize");
    setProgress(0);
  };

  const handleViewInIdeaBank = () => {
    handleClose();
    navigate("/ideabank");
  };

  const handleSaveAndCreateAnother = () => {
    // Post já foi salvo automaticamente na geração
    // Resetar para criar outro post
    setCurrentStep("customize");
    setProgress(0);
    setEditableContent("");
    form.reset();
    toast.info("Pronto para criar outro post!");
  };

  const handleCopyContent = async () => {
    try {
      const cleanText = editableContent.replace(/<[^>]*>/g, "").trim();
      await navigator.clipboard.writeText(cleanText);
      toast.success("Conteúdo copiado!");
    } catch (error) {
      toast.error("Erro ao copiar");
    }
  };

  const handleDownloadImage = async () => {
    if (!generatedPost?.idea.image_url) {
      toast.error("Nenhuma imagem para baixar");
      return;
    }
    
    try {
      // Fetch image as blob to force download (bypasses CORS and browser behavior)
      const response = await fetch(generatedPost.idea.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `post-imagem-${generatedPost.post.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Download concluído!");
    } catch (error) {
      toast.error("Erro ao baixar imagem");
      console.error("Download error:", error);
    }
  };

  const handleRegenerateImage = async () => {
    if (!generatedPost) {
      toast.error("Nenhum post para regenerar");
      return;
    }

    try {
      toast.loading("Regenerando imagem...", { id: "regen-image" });
      
      const result = await ideaBankService.regenerateImageForIdea(
        generatedPost.idea.id,
        {}  // Objeto vazio (sem prompt customizado)
      );
      
      toast.success("Imagem regenerada!", { id: "regen-image" });
      
      // Fechar sheet - ao abrir IdeaBank verá imagem atualizada
      handleClose();
      
    } catch (error) {
      toast.error("Erro ao regenerar imagem", { id: "regen-image" });
      console.error("Error regenerating image:", error);
    }
  };

  const handleClose = () => {
    setCurrentStep("customize");
    setProgress(0);
    setEditableContent("");
    form.reset();
    
    // Invalidar cache do IdeaBank para mostrar imagens atualizadas
    queryClient.invalidateQueries({ queryKey: ["posts-with-ideas"] });
    
    onClose();
  };

  const stepNumber = currentStep === "customize" ? 1 : currentStep === "generating" ? 2 : 3;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto p-8">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Criar Post da Oportunidade</span>
            <span className="text-sm font-normal text-gray-500">
              Etapa {stepNumber}/3
            </span>
          </SheetTitle>
          <SheetDescription>
            {currentStep === "customize" && "Personalize os parâmetros de geração"}
            {currentStep === "generating" && "Aguarde enquanto a IA cria seu conteúdo"}
            {currentStep === "preview" && "Revise e edite seu post antes de salvar"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Step 1: Customize */}
          {currentStep === "customize" && opportunity && (
            <div className="space-y-6">
              {/* Opportunity Preview */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 space-y-3 border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  Oportunidade selecionada:
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
                  {opportunity.titulo_ideia}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {opportunity.explicacao_score}
                </p>
                <div className="flex items-center gap-3 text-xs pt-2">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-bold">
                    {opportunity.score}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {new URL(opportunity.url_fonte).hostname}
                  </span>
                </div>
              </div>

              {/* Customization Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo do Post</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {postObjectiveOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Conteúdo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {postTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="custom_instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instruções Adicionais (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Tom humorístico, foco em pequenas empresas, mencione estatísticas..."
                            className="resize-none"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <div className="text-xs text-gray-500 mt-1">
                          Personalize o tom, estilo ou informações específicas
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="include_image"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-5 gap-4">
                        <div className="space-y-1 flex-1">
                          <FormLabel className="text-base font-medium">Gerar Imagem</FormLabel>
                          <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {canGenerateImage 
                              ? "A IA criará uma imagem para o post (consome mais créditos)"
                              : "⚠️ Geração de imagem disponível apenas para posts do tipo Feed"}
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            className="shrink-0"
                            checked={field.value && canGenerateImage}
                            onCheckedChange={(checked) => {
                              if (!canGenerateImage && checked) {
                                toast.warning("Imagem não disponível", {
                                  description: "Escolha 'Feed' no tipo de conteúdo para gerar imagens"
                                });
                                return;
                              }
                              field.onChange(checked);
                            }}
                            disabled={!canGenerateImage}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Gerar Ideia
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 2: Generating */}
          {currentStep === "generating" && opportunity && (
            <div className="py-8 space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                  </div>
                </div>

                <div className="text-center space-y-2 w-full">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {progressMessage}
                  </p>
                  <Progress value={progress} className="w-full max-w-md mx-auto" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {progress}% concluído
                  </p>
                  {/* Indicador extra para geração de imagem */}
                  {form.getValues("include_image") && progress > 40 && (
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 animate-pulse pt-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Criando sua imagem...</span>
                    </div>
                  )}
                  {/* Tempo estimado */}
                  <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
                    Tempo estimado: {form.getValues("include_image") ? "~15-20s" : "~5-7s"}
                  </p>
                </div>

                <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Gerando post para:
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {opportunity.titulo_ideia}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === "preview" && generatedPost && opportunity && (
            <div className="space-y-4">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">Texto</TabsTrigger>
                  <TabsTrigger value="image">Imagem</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                {/* Tab: Text */}
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Conteúdo Gerado</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyContent}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copiar
                      </Button>
                    </div>
                    <Textarea
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      <Edit3 className="h-3 w-3 inline mr-1" />
                      Você pode editar o texto diretamente aqui
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Metadados:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Modelo:</span>{" "}
                        <span className="font-medium">{generatedPost.idea.ai_model}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tipo:</span>{" "}
                        <span className="font-medium">{generatedPost.post.type_display}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab: Image */}
                <TabsContent value="image" className="space-y-4">
                  {generatedPost.idea.image_url ? (
                    <div className="space-y-3">
                      <img
                        src={generatedPost.idea.image_url}
                        alt="Imagem gerada"
                        className="w-full rounded-lg border shadow-sm"
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={handleRegenerateImage}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerar Imagem
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={handleDownloadImage}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Nenhuma imagem foi gerada
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Ative "Gerar imagem" nas configurações
                      </p>
                      <Button variant="outline" size="sm" onClick={handleBackToCustomize}>
                        Voltar e Ativar
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Instagram Preview */}
                <TabsContent value="preview">
                  <div className="py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                      Como seu post aparecerá no Instagram:
                    </p>
                    <InstagramPreview
                      content={editableContent}
                      imageUrl={generatedPost.idea.image_url}
                      profileName={businessName}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleBackToCustomize}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    onClick={handleViewInIdeaBank}
                    className="flex-1 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Salvar e Ver no IdeaBank
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleSaveAndCreateAnother}
                  className="w-full"
                >
                  Salvar e Criar Outro
                </Button>
              </div>
            </div>
          )}

          {/* Error State (mantém na etapa atual mas mostra erro) */}
          {error && currentStep === "customize" && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">
                    Erro ao gerar post
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                    {error.message || "Tente novamente com parâmetros diferentes"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

