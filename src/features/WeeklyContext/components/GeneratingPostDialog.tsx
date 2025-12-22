import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, AlertCircle, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import type { OpportunityItem } from "../types";
import type { PostCreationResponse, PostCreationData } from "@/features/IdeaBank/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
} from "@/components/ui";
import { postObjectiveOptions, postTypeOptions } from "@/schemas/postSchema";

const customizationSchema = z.object({
  objective: z.enum(["sales", "branding", "engagement", "awareness", "lead_generation", "education"]),
  type: z.enum(["post", "story", "reel", "carousel"]),
  custom_instructions: z.string().optional(),
  include_image: z.boolean(),
});

type CustomizationFormData = z.infer<typeof customizationSchema>;

interface GeneratingPostDialogProps {
  opportunity: OpportunityItem | null;
  isGenerating: boolean;
  generatedPost: PostCreationResponse | null;
  error: Error | null;
  onClose: () => void;
  onGenerate: (params: {
    opportunity: OpportunityItem;
    customInstructions?: string;
    objective?: PostCreationData["objective"];
    type?: PostCreationData["type"];
    includeImage?: boolean;
  }) => void;
}

export const GeneratingPostDialog = ({
  opportunity,
  isGenerating,
  generatedPost,
  error,
  onClose,
  onGenerate,
}: GeneratingPostDialogProps) => {
  const navigate = useNavigate();
  const [showCustomization, setShowCustomization] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const form = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      objective: "branding",
      type: "post",
      custom_instructions: "",
      include_image: false,
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
    if (isGenerating && !showCustomization) {
      setProgress(0);
      setProgressMessage("Iniciando...");

      // Detect if generating image for realistic timing
      const includeImage = form.getValues("include_image");
      
      const progressSteps = includeImage ? [
        // WITH IMAGE (15-20s total)
        { progress: 15, message: "Analisando oportunidade...", delay: 1000 },
        { progress: 25, message: "Gerando texto criativo...", delay: 2500 },
        { progress: 40, message: "Criando descrição visual detalhada...", delay: 5000 },
        { progress: 55, message: "Conversando com IA de imagens...", delay: 8000 },
        { progress: 70, message: "Gerando imagem com Gemini...", delay: 11000 },
        { progress: 85, message: "Processando e otimizando pixels...", delay: 14500 },
        { progress: 95, message: "Salvando imagem no servidor...", delay: 17000 },
      ] : [
        // WITHOUT IMAGE (5-7s total)
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
  }, [isGenerating, showCustomization, form]);

  const handleViewInIdeaBank = () => {
    onClose();
    navigate("/ideabank");
  };

  const handleGenerate = (data: CustomizationFormData) => {
    if (!opportunity) return;
    
    setShowCustomization(false);
    onGenerate({
      opportunity,
      customInstructions: data.custom_instructions,
      objective: data.objective,
      type: data.type,
      includeImage: data.include_image,
    });
  };

  const handleRegenerate = () => {
    setShowCustomization(true);
    form.reset();
  };

  const handleClose = () => {
    setShowCustomization(true);
    form.reset();
    onClose();
  };

  // Reset customization state when dialog opens with new opportunity
  if (opportunity && !isGenerating && !generatedPost && !error && !showCustomization) {
    setShowCustomization(true);
  }

  if (!opportunity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {/* Customization Form State */}
        {showCustomization && !isGenerating && !generatedPost && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Personalizar Geração
              </DialogTitle>
              <DialogDescription>
                Ajuste os parâmetros antes de gerar o post
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {/* Preview da Oportunidade */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 space-y-3 mb-6 border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  Oportunidade selecionada:
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
                  {opportunity.titulo_ideia}
                </p>
                <div className="flex items-center gap-3 text-xs pt-1">
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
                              <SelectValue placeholder="Selecione o objetivo" />
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
                              <SelectValue placeholder="Selecione o tipo" />
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

                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">
                      Gerar Ideia
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </>
        )}

        {/* Loading State */}
        {!showCustomization && isGenerating && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                Gerando sua ideia...
              </DialogTitle>
              <DialogDescription>
                A IA está criando um post baseado nesta oportunidade
              </DialogDescription>
            </DialogHeader>

            <div className="py-8">
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
                    Baseado em:
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {opportunity.titulo_ideia}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    🔗 {new URL(opportunity.url_fonte).hostname}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Success State */}
        {!showCustomization && !isGenerating && generatedPost && !error && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Ideia Gerada com Sucesso!
              </DialogTitle>
              <DialogDescription>
                Seu post foi criado e está pronto para ser editado
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="space-y-4">
                {/* Preview do Post */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      📝 Preview do Post
                    </h3>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                      {generatedPost.post.type_display}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-md p-4 mb-3 max-h-64 overflow-y-auto">
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: generatedPost.idea.content_preview || generatedPost.idea.content,
                      }}
                    />
                  </div>

                  {generatedPost.idea.image_url && (
                    <div className="mb-3">
                      <img
                        src={generatedPost.idea.image_url}
                        alt="Imagem gerada"
                        className="w-full rounded-md max-h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>📊 Score da oportunidade: {opportunity.score}</span>
                    <span>•</span>
                    <span>🤖 {generatedPost.idea.ai_model}</span>
                  </div>
                </div>

                {/* Fonte original */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border text-sm">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Baseado na oportunidade:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {opportunity.titulo_ideia}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleRegenerate}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Gerar Nova Versão
              </Button>
              <Button
                onClick={handleViewInIdeaBank}
                className="flex items-center gap-2 flex-1"
              >
                <ExternalLink className="h-4 w-4" />
                Ver no IdeaBank
              </Button>
            </div>
          </>
        )}

        {/* Error State */}
        {!showCustomization && !isGenerating && error && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Erro ao Gerar Ideia
              </DialogTitle>
              <DialogDescription>
                Ocorreu um problema durante a geração
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-400">
                  {error.message || "Erro desconhecido. Tente novamente."}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Fechar
              </Button>
              <Button onClick={handleRegenerate} className="flex-1">
                Tentar Novamente
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

