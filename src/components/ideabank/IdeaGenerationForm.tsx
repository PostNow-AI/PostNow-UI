import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTENT_TYPE_LABELS,
  DEFAULT_VOICE_TONE,
} from "@/constants/ideaGeneration";
import { useUserCredits } from "@/hooks/useCredits";
import { getModelsByProvider } from "@/lib/utils/aiModels";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Cpu,
  Loader2,
  Share2,
  Target,
  Type,
  Users,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ideaGenerationSchema = z.object({
  // Campaign info
  title: z.string().optional(),
  description: z.string().optional(),

  // Campaign objective (required)
  objectives: z.array(z.string()).min(1, "Selecione pelo menos um objetivo"),

  // Target persona (optional)
  persona_age: z.string().optional(),
  persona_location: z.string().optional(),
  persona_income: z.string().optional(),
  persona_interests: z.string().optional(),
  persona_behavior: z.string().optional(),
  persona_pain_points: z.string().optional(),

  // Social platforms and content types (required platforms)
  platforms: z.array(z.string()).min(1, "Selecione pelo menos uma plataforma"),
  content_types: z.record(z.string(), z.array(z.string())).optional(),

  // Voice tone (required)
  voice_tone: z.string().min(1, "Selecione um tom de voz"),

  // Campaign details for AI generation (optional)
  product_description: z.string().optional(),
  value_proposition: z.string().optional(),
  campaign_urgency: z.string().optional(),

  // AI model preferences (optional)
  preferred_provider: z.string().optional(),
  preferred_model: z.string().optional(),
});

export type IdeaGenerationFormData = z.infer<typeof ideaGenerationSchema>;

interface OptionItem {
  value: string;
  label: string;
}

interface IdeaGenerationOptions {
  objectives: OptionItem[];
  content_types: Record<string, string[]>; // {platform: [content_types]}
  platforms: OptionItem[];
  voice_tones: OptionItem[];
}

interface IdeaGenerationFormProps {
  options?: IdeaGenerationOptions;
  onSubmit: (data: IdeaGenerationFormData) => void;
  isGenerating: boolean;
}

export const IdeaGenerationForm = ({
  options,
  onSubmit,
  isGenerating,
}: IdeaGenerationFormProps) => {
  // Helper function to get content type labels
  const getContentTypeLabel = (contentType: string): string => {
    return CONTENT_TYPE_LABELS[contentType] || contentType;
  };

  // Get available models for the selected provider
  const getAvailableModels = (provider: string) => {
    return getModelsByProvider(provider);
  };

  const { data: userCredits } = useUserCredits();
  const form = useForm<IdeaGenerationFormData>({
    resolver: zodResolver(ideaGenerationSchema),
    defaultValues: {
      title: "",
      description: "",
      objectives: [],
      platforms: [],
      content_types: {},
      voice_tone: DEFAULT_VOICE_TONE,

      product_description: "",
      value_proposition: "",
      campaign_urgency: "",

      preferred_provider: "",
      preferred_model: "",
    },
  });

  // Reset model when provider changes
  useEffect(() => {
    const currentProvider = form.watch("preferred_provider");
    const currentModel = form.watch("preferred_model");

    if (currentProvider && currentModel) {
      const availableModels = getAvailableModels(currentProvider);
      const modelExists = availableModels.some((m) => m.value === currentModel);
      if (!modelExists) {
        form.setValue("preferred_model", "");
      }
    }
  }, [
    form.watch("preferred_provider"),
    form.watch("preferred_model"),
    form.setValue,
  ]);

  const {
    formState: { errors },
  } = form;

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<Record<string, string[]>>(
    {}
  );

  const handleSubmit = (data: IdeaGenerationFormData) => {
    onSubmit(data);
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    let newPlatforms: string[];

    if (checked) {
      newPlatforms = [...selectedPlatforms, platform];
      setSelectedPlatforms(newPlatforms);
    } else {
      newPlatforms = selectedPlatforms.filter((p) => p !== platform);
      setSelectedPlatforms(newPlatforms);
      setContentTypes((prev) => {
        const newTypes = { ...prev };
        delete newTypes[platform];
        return newTypes;
      });
    }

    // Update form value
    form.setValue("platforms", newPlatforms, { shouldValidate: true });
  };

  const handleContentTypeChange = (
    platform: string,
    contentType: string,
    checked: boolean
  ) => {
    setContentTypes((prev) => {
      const currentTypes = prev[platform] || [];
      let newContentTypes: Record<string, string[]>;

      if (checked) {
        newContentTypes = {
          ...prev,
          [platform]: [...currentTypes, contentType],
        };
      } else {
        newContentTypes = {
          ...prev,
          [platform]: currentTypes.filter((t) => t !== contentType),
        };
      }

      // Update form value
      form.setValue("content_types", newContentTypes);
      return newContentTypes;
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {/* Credit Balance Display */}
      {userCredits && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Saldo de Créditos
            </CardTitle>
            <CardDescription>
              Seu saldo atual para geração de conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-lg font-bold">
              {userCredits.balance.toFixed(2)} créditos
            </Badge>
          </CardContent>
        </Card>
      )}
      {/* Campaign Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objetivo da Campanha{" "}
            <span className="text-destructive">(obrigatório)</span>
          </CardTitle>
          <CardDescription>
            Selecione os objetivos que deseja alcançar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options?.objectives?.map((objective: OptionItem) => (
              <div
                key={objective.value}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={objective.value}
                  checked={form.watch("objectives").includes(objective.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch("objectives");
                    if (checked) {
                      form.setValue(
                        "objectives",
                        [...current, objective.value],
                        {
                          shouldValidate: true,
                        }
                      );
                    } else {
                      form.setValue(
                        "objectives",
                        current.filter((o) => o !== objective.value),
                        { shouldValidate: true }
                      );
                    }
                  }}
                  aria-required="true"
                />
                <Label
                  htmlFor={objective.value}
                  className="font-medium flex-1 cursor-pointer"
                >
                  {objective.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.objectives && (
            <p className="text-sm text-destructive">
              {String(errors.objectives.message)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Target Persona */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Persona Alvo{" "}
            <span className="text-muted-foreground">(opcional)</span>
          </CardTitle>
          <CardDescription>
            Defina as características do público que deseja atingir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="persona_age">Idade</Label>
              <Input
                id="persona_age"
                placeholder="Ex: 25-35 anos, 18-24 anos, 40+ anos"
                {...form.register("persona_age")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona_location">Localização</Label>
              <Input
                id="persona_location"
                placeholder="Ex: São Paulo, SP, Brasil, América Latina"
                {...form.register("persona_location")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona_income">Renda</Label>
              <Input
                id="persona_income"
                placeholder="Ex: R$ 3.000-5.000, Classe A-B, Renda média"
                {...form.register("persona_income")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="persona_interests">Interesses</Label>
              <Textarea
                id="persona_interests"
                placeholder="Ex: Tecnologia, fitness, viagens, gastronomia, sustentabilidade, empreendedorismo, educação online..."
                rows={3}
                {...form.register("persona_interests")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona_behavior">Comportamento</Label>
              <Textarea
                id="persona_behavior"
                placeholder="Ex: Ativos nas redes sociais, consomem conteúdo educativo, preferem vídeos curtos, gostam de interagir com marcas..."
                rows={3}
                {...form.register("persona_behavior")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="persona_pain_points">Dores e Necessidades</Label>
            <Textarea
              id="persona_pain_points"
              placeholder="Ex: Falta de tempo, dificuldade em organizar, busca por soluções rápidas, necessidade de aprendizado contínuo..."
              rows={2}
              {...form.register("persona_pain_points")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Plataformas de Redes Sociais{" "}
            <span className="text-destructive">(obrigatório)</span>
          </CardTitle>
          <CardDescription>
            Selecione as plataformas onde deseja criar conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {options?.platforms?.map((platform: OptionItem) => (
              <div
                key={platform.value}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={platform.value}
                  checked={selectedPlatforms.includes(platform.value)}
                  onCheckedChange={(checked) =>
                    handlePlatformChange(platform.value, checked as boolean)
                  }
                  aria-required="true"
                />
                <Label
                  htmlFor={platform.value}
                  className="font-medium flex-1 cursor-pointer"
                >
                  {platform.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.platforms && (
            <p className="text-sm text-destructive">
              {String(errors.platforms.message)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Content Types per Platform */}
      {selectedPlatforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Tipos de Conteúdo{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </CardTitle>
            <CardDescription>
              Selecione os tipos de conteúdo para cada plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedPlatforms.map((platform) => (
              <div key={platform} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <Label className="text-base font-semibold">{platform}</Label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {options?.content_types?.[platform]?.map(
                    (contentType: string) => {
                      const contentTypeLabel = getContentTypeLabel(contentType);
                      return (
                        <div
                          key={contentType}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/30 transition-colors"
                        >
                          <Checkbox
                            id={`${platform}-${contentType}`}
                            checked={
                              contentTypes[platform]?.includes(contentType) ||
                              false
                            }
                            onCheckedChange={(checked) =>
                              handleContentTypeChange(
                                platform,
                                contentType,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`${platform}-${contentType}`}
                            className="text-sm flex-1 cursor-pointer"
                          >
                            {contentTypeLabel}
                          </Label>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Voice Tone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Tom de Voz <span className="text-destructive">(obrigatório)</span>
          </CardTitle>
          <CardDescription>
            Escolha o tom de voz que deseja para a campanha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            onValueChange={(value) =>
              form.setValue("voice_tone", value, { shouldValidate: true })
            }
            value={form.watch("voice_tone")}
          >
            <SelectTrigger className="w-full" aria-required="true">
              <SelectValue placeholder="Selecione um tom de voz" />
            </SelectTrigger>
            <SelectContent>
              {options?.voice_tones?.map((tone: OptionItem) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.voice_tone && (
            <p className="text-sm text-destructive">
              {String(errors.voice_tone.message)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Detalhes da Campanha{" "}
            <span className="text-muted-foreground">(opcional)</span>
          </CardTitle>
          <CardDescription>
            Forneça mais detalhes para a geração de ideias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título da Campanha{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex: Campanha de Marketing Digital, Lançamento de Produto, Black Friday, Conscientização sobre Sustentabilidade"
                {...form.register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {String(errors.title.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição da Campanha{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Ex: Campanha focada em aumentar o engajamento nas redes sociais, com foco em conteúdo educativo e interativo para nossa audiência..."
                rows={2}
                {...form.register("description")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_description">
                Descrição do Produto{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="product_description"
                placeholder="Ex: Software de gestão empresarial que automatiza processos, reduz custos e aumenta a produtividade da equipe..."
                rows={2}
                {...form.register("product_description")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value_proposition">
                Proposta de Valor{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="value_proposition"
                placeholder="Ex: Economia de 10 horas semanais em tarefas administrativas, ROI de 300% em 6 meses, suporte 24/7 incluído..."
                rows={2}
                {...form.register("value_proposition")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign_urgency">
              Urgência da Campanha{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Select
              onValueChange={(value) =>
                form.setValue("campaign_urgency", value)
              }
              value={form.watch("campaign_urgency")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Modelo de IA
            <span className="text-muted-foreground">(opcional)</span>
          </CardTitle>
          <CardDescription>
            Escolha o modelo de IA para geração de conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_provider">Provedor Preferido</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("preferred_provider", value)
                }
                value={form.watch("preferred_provider")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o provedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google">Google (Gemini)</SelectItem>
                  <SelectItem value="OpenAI">OpenAI (GPT)</SelectItem>
                  <SelectItem value="Anthropic">Anthropic (Claude)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_model">Modelo Específico</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("preferred_model", value)
                }
                value={form.watch("preferred_model")}
                disabled={!form.watch("preferred_provider")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      form.watch("preferred_provider")
                        ? "Selecione o modelo"
                        : "Selecione um provedor primeiro"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableModels(
                    form.watch("preferred_provider") || ""
                  ).map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                  {getAvailableModels(form.watch("preferred_provider") || "")
                    .length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nenhum modelo disponível
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button
          type="submit"
          disabled={isGenerating}
          size="lg"
          className="min-w-40"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando Ideias...
            </>
          ) : (
            "Gerar Ideias"
          )}
        </Button>
      </div>
    </form>
  );
};
