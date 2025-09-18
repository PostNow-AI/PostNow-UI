import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Textarea,
} from "@/components/ui";
import { usePostGeneration } from "@/hooks/usePostGeneration";
import type { PostCreationFormData } from "@/schemas/postSchema";
import {
  aiModelOptions,
  aiProviderOptions,
  genderOptions,
  postCreationSchema,
  postObjectiveOptions,
  postTypeOptions,
} from "@/schemas/postSchema";

interface PostData {
  id: number;
  name: string;
  objective: string;
  objective_display: string;
  type: string;
  type_display: string;
  target_gender?: string;
  target_gender_display?: string;
  target_age?: string;
  target_location?: string;
  target_salary?: string;
  target_interests?: string;
  has_target_audience: boolean;
  ideas_count: number;
  created_at: string;
  updated_at: string;
}

interface IdeaData {
  id: number;
  content: string;
  content_preview: string;
  image_url?: string;
  status: string;
  status_display: string;
  ai_provider: string;
  ai_model: string;
  post_name: string;
  post_type: string;
  created_at: string;
  updated_at: string;
}

interface PostCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (postData: PostData, ideaData: IdeaData) => void;
}

export const PostCreationDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: PostCreationDialogProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { generatePost, isLoading } = usePostGeneration();

  const form = useForm<PostCreationFormData>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: {
      name: "",
      objective: "branding" as const,
      type: "post" as const,
      target_gender: undefined,
      target_age: "",
      target_location: "",
      target_salary: "",
      target_interests: "",
      preferred_provider: "google" as const,
      preferred_model: "gemini-1.5-flash",
      include_image: false,
    },
  });

  const selectedProvider = form.watch("preferred_provider");

  const handleSubmit: SubmitHandler<PostCreationFormData> = async (data) => {
    try {
      const result = await generatePost(data);

      if (result?.post && result?.idea) {
        onSuccess?.(result.post, result.idea);
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao gerar post:", error);
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      form.reset();
      setShowAdvanced(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Criar Novo Post com IA
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do post e deixe a IA gerar o conteúdo para
            você
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
                <CardDescription>Dados essenciais do seu post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Post *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Promoção de verão, Lançamento do produto..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Título ou nome identificador do post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o objetivo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {postObjectiveOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Qual o objetivo principal do post?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Conteúdo *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {postTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Formato do conteúdo desejado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="include_image"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 p-4 border rounded-lg">
                      <div>
                        <FormLabel className="text-sm font-medium">
                          Gerar imagem automaticamente
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          A IA criará uma imagem personalizada para o post
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Público-Alvo (Opcional)
                </CardTitle>
                <CardDescription>
                  Defina seu público para conteúdo mais direcionado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="target_gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gênero</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o gênero" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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
                    name="target_age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faixa Etária</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 18-25, 25-35, 35+"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="target_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: São Paulo, Brasil, região Sul..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="target_salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Renda Mensal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: R$ 2.000-5.000, classe média..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="target_interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interesses</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: tecnologia, moda, esportes, alimentação saudável..."
                          rows={3}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Descreva os principais interesses do seu público
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* AI Configuration */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Configurações de IA
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 px-2 text-xs"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? "Ocultar" : "Mostrar"} Avançado
                  </Button>
                </CardTitle>
                <CardDescription>
                  Personalize como a IA irá gerar seu conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAdvanced && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="preferred_provider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provedor de IA</FormLabel>
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
                                {aiProviderOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
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
                        name="preferred_model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedProvider &&
                                  aiModelOptions[selectedProvider]?.map(
                                    (option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    )
                                  )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Modelos mais avançados consomem mais créditos
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Separator />

                    {/* Image Generation Switch */}
                  </>
                )}

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">
                      A IA irá gerar automaticamente:
                    </span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Título impactante e chamativo</li>
                    <li>• Texto do post otimizado para engajamento</li>
                    <li>• Call-to-action persuasivo</li>
                    <li>• Hashtags relevantes (quando aplicável)</li>
                    <li>• Tom de voz alinhado com o objetivo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-32">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
