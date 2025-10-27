import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ClipboardList, Loader2 } from "lucide-react";
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
import { postCreationSchema } from "@/features/IdeaBank/constants";
import { usePostCreationForm } from "@/features/IdeaBank/hooks";
import type { PostCreationData } from "@/features/IdeaBank/types";
import { postObjectiveOptions, postTypeOptions } from "@/schemas/postSchema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

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
  const { handleCreatePost, isCreating } = usePostCreationForm(onSuccess);

  const form = useForm<PostCreationData>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: {
      name: "",
      objective: "branding" as const,
      type: "post" as const,
      further_details: "",
      include_image: false,
    },
  });

  const handleSubmit: SubmitHandler<PostCreationData> = async (data) => {
    try {
      await handleCreatePost(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao gerar post:", error);
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      form.reset();
      onClose();
    }
  };

  const { watch } = form;
  const postType = watch("type");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-6xl max-h-[90vh] h-[90vh] flex flex-col"
        style={{ width: "95vw", maxWidth: "1200px" }}
      >
        <DialogHeader className="px-0">
          <DialogTitle className="flex items-center gap-2">
            Crie uma <span className="text-primary">ideia de post</span>{" "}
          </DialogTitle>
          <Separator className="absolute left-0 right-0 top-13 w-full" />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-6 flex flex-col justify-center mt-5">
              {/* Basic Information */}
              <Card className="max-w-160 w-full overflow-auto self-center justify-start  max-h-[70vh]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ClipboardList className="text-primary" />
                    Detalhes do post
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure as especificações do seu post.
                  </CardDescription>
                  <Separator className="mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* TODO: Botão para gerar dados do post com IA */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto do Post</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Promoção de Natal 2024, Conscientização da marca"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Título identificador do post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objetivo do post *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o objetivo principal do seu post" />
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

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo do post *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo do post" />
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

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="include_image"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Adicionar imagem * </FormLabel>

                        <FormControl>
                          <Tooltip>
                            <TooltipTrigger
                              className="flex items-start w-fit"
                              type="button"
                            >
                              <Switch
                                checked={field.value}
                                disabled={postType !== "post"}
                                type="button"
                                onCheckedChange={field.onChange}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {postType !== "post"
                                ? "A imagem só está disponível para posts do tipo 'Post para Feed'."
                                : field.value
                                ? "A imagem será incluída na ideia do post."
                                : "A imagem não será incluída na ideia do post."}
                            </TooltipContent>
                          </Tooltip>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="further_details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mais detalhes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os interesses, hobbies, problemas e comportamentos do seu público (ex: entusiastas de fitness, profissionais ocupados, consumidores conscientes), adicione observações sobre o tom do post, estilo, voz da marca, ou qualquer outro detalhe relevante que ajude a personalizar a ideia do post."
                            rows={6}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Quanto mais detalhes fornecer, mais precisos serão os
                          posts gerados.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
        <div className="bottom-0 left-0 right-0 absolute flex flex-col">
          <Separator className="w-full" />
          <div className="flex justify-end gap-3 m-4">
            <Button
              type="button"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isCreating}
              className="min-w-32"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  Gerar Ideia
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
