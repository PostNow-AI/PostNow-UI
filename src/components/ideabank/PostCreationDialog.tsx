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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@/components/ui";
import { usePostGeneration } from "@/hooks/usePostGeneration";
import type { PostCreationFormData } from "@/schemas/postSchema";
import {
  genderOptions,
  postCreationSchema,
  postObjectiveOptions,
  postTypeOptions,
} from "@/schemas/postSchema";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-6xl max-h-[95vh]"
        style={{ width: "95vw", maxWidth: "1400px" }}
      >
        <DialogHeader className="px-0">
          <DialogTitle className="flex items-center gap-2">
            Crie uma <span className="text-primary">ideia de post</span>{" "}
          </DialogTitle>
          <Separator className="absolute left-0 right-0 top-13 w-full" />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-6 mt-4 flex flex-col justify-center">
              {/* Basic Information */}
              <Card className="max-w-160  self-center">
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
                <CardContent className="space-y-6 overflow-auto max-h-[60vh]">
                  {/* TODO: Botão para gerar dados do post com IA */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Post *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Promoção de Natal 2024, Conscientização da marca"
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

                  <FormField
                    control={form.control}
                    name="include_image"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Conteúdo * </FormLabel>

                        <FormControl>
                          <RadioGroup
                            value={field.value ? "option-two" : "option-one"}
                            onValueChange={(value) =>
                              field.onChange(value === "option-two")
                            }
                            className="flex items-center space-x-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="option-one"
                                id="option-one"
                              />
                              <Label htmlFor="option-one">Texto</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="option-two"
                                id="option-two"
                              />
                              <Label htmlFor="option-two">Texto e imagem</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <CardTitle>Público-Alvo</CardTitle>

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
                              <SelectTrigger className="w-full">
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
                          <FormLabel>Idade</FormLabel>
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
                            placeholder="Descreve os interesses, hobbies, problemas e comportamentos do seu público (ex: entusiastas de fitness, profissionais ocupados, consumidores conscientes)"
                            rows={3}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Separator className="absolute left-0 right-0 bottom-9 w-full" />
              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={isLoading} className="min-w-32">
                  {isLoading ? (
                    <>
                      Gerando...
                      <Loader2 className="h-4 w-4 animate-spin" />
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
