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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Share2, Target, Type, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ideaGenerationSchema = z.object({
  objectives: z.array(z.string()).min(1, "Selecione pelo menos um objetivo"),
  persona_age: z.string().optional(),
  persona_location: z.string().optional(),
  persona_income: z.string().optional(),
  persona_interests: z.string().optional(),
  persona_behavior: z.string().optional(),
  persona_pain_points: z.string().optional(),
  platforms: z.array(z.string()).min(1, "Selecione pelo menos uma plataforma"),
  content_types: z.record(z.string(), z.array(z.string())).optional(),
});

export type IdeaGenerationFormData = z.infer<typeof ideaGenerationSchema>;

interface OptionItem {
  value: string;
  label: string;
}

interface IdeaGenerationOptions {
  objectives: OptionItem[];
  content_types: OptionItem[];
  platforms: OptionItem[];
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
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<Record<string, string[]>>(
    {}
  );

  const form = useForm<IdeaGenerationFormData>({
    resolver: zodResolver(ideaGenerationSchema),
    defaultValues: {
      objectives: [],
      platforms: [],
      content_types: {},
    },
  });

  const handleSubmit = (data: IdeaGenerationFormData) => {
    data.platforms = selectedPlatforms;
    data.content_types = contentTypes;
    onSubmit(data);
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    } else {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
      setContentTypes((prev) => {
        const newTypes = { ...prev };
        delete newTypes[platform];
        return newTypes;
      });
    }
  };

  const handleContentTypeChange = (
    platform: string,
    contentType: string,
    checked: boolean
  ) => {
    setContentTypes((prev) => {
      const currentTypes = prev[platform] || [];
      if (checked) {
        return { ...prev, [platform]: [...currentTypes, contentType] };
      } else {
        return {
          ...prev,
          [platform]: currentTypes.filter((t) => t !== contentType),
        };
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                className="flex items-center space-x-2"
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
                <Label htmlFor={objective.value}>{objective.label}</Label>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="space-y-2">
            <Label htmlFor="persona_interests">Interesses</Label>
            <Textarea
              id="persona_interests"
              placeholder="Ex: Tecnologia, fitness, viagens..."
              {...form.register("persona_interests")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="persona_behavior">Comportamento</Label>
            <Textarea
              id="persona_behavior"
              placeholder="Ex: Ativos nas redes sociais, gostam de conteúdo educativo..."
              {...form.register("persona_behavior")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="persona_pain_points">Dores e Necessidades</Label>
            <Textarea
              id="persona_pain_points"
              placeholder="Ex: Falta de tempo, dificuldade em organizar..."
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {options?.platforms?.map((platform: OptionItem) => (
              <div key={platform.value} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.value}
                  checked={selectedPlatforms.includes(platform.value)}
                  onCheckedChange={(checked) =>
                    handlePlatformChange(platform.value, checked as boolean)
                  }
                />
                <Label htmlFor={platform.value}>{platform.label}</Label>
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
          <CardContent className="space-y-4">
            {selectedPlatforms.map((platform) => (
              <div key={platform} className="space-y-2">
                <Label className="text-sm font-medium">{platform}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {options?.content_types?.map((contentType: OptionItem) => (
                    <div
                      key={contentType.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`${platform}-${contentType.value}`}
                        checked={
                          contentTypes[platform]?.includes(contentType.value) ||
                          false
                        }
                        onCheckedChange={(checked) =>
                          handleContentTypeChange(
                            platform,
                            contentType.value,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`${platform}-${contentType.value}`}
                        className="text-xs"
                      >
                        {contentType.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isGenerating}>
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
