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
} from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Loader2,
  Share2,
  Target,
  Type,
  Users,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ideaGenerationSchema = z.object({
  // Campaign info
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),

  // Campaign objective
  objectives: z.array(z.string()).min(1, "Selecione pelo menos um objetivo"),

  // Target persona
  persona_age: z.string().optional(),
  persona_location: z.string().optional(),
  persona_income: z.string().optional(),
  persona_interests: z.string().optional(),
  persona_behavior: z.string().optional(),
  persona_pain_points: z.string().optional(),

  // Social platforms and content types
  platforms: z.array(z.string()).min(1, "Selecione pelo menos uma plataforma"),
  content_types: z.record(z.string(), z.array(z.string())).optional(),

  // Voice tone
  voice_tone: z.string(),

  // Campaign details for AI generation
  product_description: z.string().optional(),
  value_proposition: z.string().optional(),
  campaign_urgency: z.string().optional(),
});

export type PublicIdeaGenerationFormData = z.infer<typeof ideaGenerationSchema>;

interface OptionItem {
  value: string;
  label: string;
}

interface PublicIdeaGenerationOptions {
  objectives: OptionItem[];
  content_types: Record<string, string[]>; // {platform: [content_types]}
  platforms: OptionItem[];
  voice_tones: OptionItem[];
}

interface PublicIdeaGenerationFormProps {
  options?: PublicIdeaGenerationOptions;
  onSubmit: (data: PublicIdeaGenerationFormData) => void;
  isGenerating: boolean;
}

export const PublicIdeaGenerationForm = ({
  options,
  onSubmit,
  isGenerating,
}: PublicIdeaGenerationFormProps) => {
  // Helper function to get content type labels
  const getContentTypeLabel = (contentType: string): string => {
    const contentTypeLabels: Record<string, string> = {
      post: "Post",
      story: "Story",
      reel: "Reel",
      video: "Vídeo",
      carousel: "Carrossel",
      live: "Live",
      custom: "Custom",
    };
    return contentTypeLabels[contentType] || contentType;
  };
  const form = useForm<PublicIdeaGenerationFormData>({
    resolver: zodResolver(ideaGenerationSchema),
    defaultValues: {
      title: "",
      description: "",
      objectives: [],
      platforms: [],
      content_types: {},
      voice_tone: "professional",
      product_description: "",
      value_proposition: "",
      campaign_urgency: "",
    },
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<Record<string, string[]>>(
    {}
  );

  const handleSubmit = (data: PublicIdeaGenerationFormData) => {
    // The form values are already updated by setValue calls
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
    form.setValue("platforms", newPlatforms);
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
    <div className="space-y-6">
      {/* Public User Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Nota:</strong> Você está usando a versão pública do gerador de
          ideias. As ideias geradas não serão salvas e não terão personalização
          baseada em perfil. Para uma experiência completa com ideias
          personalizadas e salvas,{" "}
          <a href="/login" className="text-primary hover:underline font-medium">
            faça login ou crie uma conta
          </a>
          .
        </AlertDescription>
      </Alert>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Campaign Objectives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivo da Campanha
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
                        form.setValue("objectives", [
                          ...current,
                          objective.value,
                        ]);
                      } else {
                        form.setValue(
                          "objectives",
                          current.filter((o) => o !== objective.value)
                        );
                      }
                    }}
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
          </CardContent>
        </Card>

        {/* Target Persona */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Persona Alvo
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
                  placeholder="Ex: 25-35 anos"
                  {...form.register("persona_age")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="persona_location">Localização</Label>
                <Input
                  id="persona_location"
                  placeholder="Ex: São Paulo, SP"
                  {...form.register("persona_location")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="persona_income">Renda</Label>
                <Input
                  id="persona_income"
                  placeholder="Ex: R$ 3.000 - 5.000"
                  {...form.register("persona_income")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="persona_interests">Interesses</Label>
                <Textarea
                  id="persona_interests"
                  placeholder="Ex: Tecnologia, fitness, viagens..."
                  rows={3}
                  {...form.register("persona_interests")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="persona_behavior">Comportamento</Label>
                <Textarea
                  id="persona_behavior"
                  placeholder="Ex: Ativos nas redes sociais, gostam de conteúdo educativo..."
                  rows={3}
                  {...form.register("persona_behavior")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona_pain_points">Dores e Necessidades</Label>
              <Textarea
                id="persona_pain_points"
                placeholder="Ex: Falta de tempo, dificuldade em organizar..."
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
              Plataformas de Redes Sociais
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
          </CardContent>
        </Card>

        {/* Content Types per Platform */}
        {selectedPlatforms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Tipos de Conteúdo
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
                    <Label className="text-base font-semibold">
                      {platform}
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {options?.content_types?.[platform]?.map(
                      (contentType: string) => {
                        // Get the label for the content type
                        const contentTypeLabel =
                          getContentTypeLabel(contentType);
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
              Tom de Voz
            </CardTitle>
            <CardDescription>
              Escolha o tom de voz que deseja para a campanha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              onValueChange={(value) => form.setValue("voice_tone", value)}
              value={form.watch("voice_tone")}
            >
              <SelectTrigger className="w-full">
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
          </CardContent>
        </Card>

        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Detalhes da Campanha
            </CardTitle>
            <CardDescription>
              Forneça mais detalhes para a geração de ideias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Campanha</Label>
                <Input
                  id="title"
                  placeholder="Ex: Campanha de Marketing Digital"
                  {...form.register("title")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Campanha</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Descrição detalhada da campanha..."
                  rows={2}
                  {...form.register("description")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_description">
                  Descrição do Produto
                </Label>
                <Textarea
                  id="product_description"
                  placeholder="Ex: Descrição detalhada do produto/serviço..."
                  rows={2}
                  {...form.register("product_description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value_proposition">Proposta de Valor</Label>
                <Textarea
                  id="value_proposition"
                  placeholder="Ex: Explique a proposta de valor da sua oferta..."
                  rows={2}
                  {...form.register("value_proposition")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign_urgency">Urgência da Campanha</Label>
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
    </div>
  );
};
