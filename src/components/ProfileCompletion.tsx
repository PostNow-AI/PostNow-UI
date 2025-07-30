import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Loading,
} from "@/components/ui";
import {
  creatorProfileApi,
  type CreatorProfile,
} from "@/lib/creator-profile-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema for profile completion
const profileCompletionSchema = z.object({
  // Important fields (Level 2)
  specific_profession: z.string().optional(),
  target_audience: z.string().optional(),
  communication_tone: z.string().optional(),
  expertise_areas: z.array(z.string()).optional(),
  preferred_duration: z.string().optional(),
  complexity_level: z.string().optional(),
  theme_diversity: z.number().min(0).max(10).optional(),
  publication_frequency: z.string().optional(),

  // Optional fields (Level 3)
  instagram_username: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  twitter_username: z.string().optional(),
  tiktok_username: z.string().optional(),
  revenue_stage: z.string().optional(),
  team_size: z.string().optional(),
  revenue_goal: z.string().optional(),
  authority_goal: z.string().optional(),
  leads_goal: z.string().optional(),
  has_designer: z.boolean().optional(),
  current_tools: z.array(z.string()).optional(),
  tools_budget: z.string().optional(),
  preferred_hours: z.array(z.string()).optional(),
});

type ProfileCompletionData = z.infer<typeof profileCompletionSchema>;

interface ProfileCompletionProps {
  profile: CreatorProfile;
}

export const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<ProfileCompletionData>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      specific_profession: profile.specific_profession || "",
      target_audience: profile.target_audience || "",
      communication_tone: profile.communication_tone || "",
      expertise_areas: profile.expertise_areas || [],
      preferred_duration: profile.preferred_duration || "",
      complexity_level: profile.complexity_level || "",
      theme_diversity: profile.theme_diversity || 5,
      publication_frequency: profile.publication_frequency || "",
      instagram_username: profile.instagram_username || "",
      linkedin_url: profile.linkedin_url || "",
      twitter_username: profile.twitter_username || "",
      tiktok_username: profile.tiktok_username || "",
      revenue_stage: profile.revenue_stage || "",
      team_size: profile.team_size || "",
      revenue_goal: profile.revenue_goal || "",
      authority_goal: profile.authority_goal || "",
      leads_goal: profile.leads_goal || "",
      has_designer: profile.has_designer || false,
      current_tools: profile.current_tools || [],
      tools_budget: profile.tools_budget || "",
      preferred_hours: profile.preferred_hours || [],
    },
  });

  const { register, handleSubmit, setValue, watch } = form;

  // Fetch choices and suggestions
  const { data: choices } = useQuery({
    queryKey: ["profile-choices"],
    queryFn: creatorProfileApi.getChoices,
  });

  const { data: suggestions } = useQuery({
    queryKey: ["profile-suggestions"],
    queryFn: creatorProfileApi.getSuggestions,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: creatorProfileApi.updateProfile,
    onSuccess: (data) => {
      toast.success("Perfil atualizado!", {
        description: `${data.profile.completeness_percentage}% completo`,
      });

      // Update the query cache
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({
        queryKey: ["profile-completion-status"],
      });

      setActiveSection(null);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao atualizar perfil";
      toast.error("Erro na atualização", {
        description: message,
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileCompletionData) => {
    updateMutation.mutate(data);
  };

  // Handle adding expertise areas
  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      const currentAreas = watch("expertise_areas") || [];
      if (!currentAreas.includes(expertiseInput.trim())) {
        setValue("expertise_areas", [...currentAreas, expertiseInput.trim()]);
      }
      setExpertiseInput("");
    }
  };

  // Handle removing expertise area
  const handleRemoveExpertise = (area: string) => {
    const currentAreas = watch("expertise_areas") || [];
    setValue(
      "expertise_areas",
      currentAreas.filter((a) => a !== area)
    );
  };

  // Handle adding tools
  const handleAddTool = () => {
    if (toolsInput.trim()) {
      const currentTools = watch("current_tools") || [];
      if (!currentTools.includes(toolsInput.trim())) {
        setValue("current_tools", [...currentTools, toolsInput.trim()]);
      }
      setToolsInput("");
    }
  };

  // Handle removing tool
  const handleRemoveTool = (tool: string) => {
    const currentTools = watch("current_tools") || [];
    setValue(
      "current_tools",
      currentTools.filter((t) => t !== tool)
    );
  };

  // Handle toggling preferred hours
  const handleToggleHour = (hour: string) => {
    const currentHours = watch("preferred_hours") || [];
    if (currentHours.includes(hour)) {
      setValue(
        "preferred_hours",
        currentHours.filter((h) => h !== hour)
      );
    } else {
      setValue("preferred_hours", [...currentHours, hour]);
    }
  };

  // Calculate section completeness
  const getSectionCompleteness = (section: string) => {
    switch (section) {
      case "professional":
        const profFields = [
          profile.specific_profession,
          profile.target_audience,
          profile.communication_tone,
          profile.expertise_areas?.length,
        ];
        return (profFields.filter(Boolean).length / profFields.length) * 100;

      case "content":
        const contentFields = [
          profile.preferred_duration,
          profile.complexity_level,
          profile.theme_diversity,
          profile.publication_frequency,
        ];
        return (
          (contentFields.filter(Boolean).length / contentFields.length) * 100
        );

      case "social":
        const socialFields = [
          profile.instagram_username,
          profile.linkedin_url,
          profile.twitter_username,
          profile.tiktok_username,
        ];
        return (
          (socialFields.filter(Boolean).length / socialFields.length) * 100
        );

      case "business":
        const businessFields = [
          profile.revenue_stage,
          profile.team_size,
          profile.revenue_goal,
          profile.authority_goal,
          profile.leads_goal,
        ];
        return (
          (businessFields.filter(Boolean).length / businessFields.length) * 100
        );

      case "resources":
        const resourceFields = [
          profile.has_designer,
          profile.current_tools?.length,
          profile.tools_budget,
          profile.preferred_hours?.length,
        ];
        return (
          (resourceFields.filter(Boolean).length / resourceFields.length) * 100
        );

      default:
        return 0;
    }
  };

  const sections = [
    {
      id: "professional",
      title: "Contexto Profissional",
      description: "Informações sobre sua área de atuação",
      completeness: getSectionCompleteness("professional"),
    },
    {
      id: "content",
      title: "Preferências de Conteúdo",
      description: "Como você gosta de criar e consumir conteúdo",
      completeness: getSectionCompleteness("content"),
    },
    {
      id: "social",
      title: "Redes Sociais",
      description: "Seus perfis para análise personalizada",
      completeness: getSectionCompleteness("social"),
    },
    {
      id: "business",
      title: "Contexto de Negócio",
      description: "Suas metas e estágio atual",
      completeness: getSectionCompleteness("business"),
    },
    {
      id: "resources",
      title: "Recursos Disponíveis",
      description: "Ferramentas e time que você possui",
      completeness: getSectionCompleteness("resources"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Completude do Perfil</span>
            <span className="text-2xl font-bold text-primary">
              {profile.completeness_percentage}%
            </span>
          </CardTitle>
          <CardDescription>
            Quanto mais informações, melhores as sugestões personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${profile.completeness_percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {34 - Math.floor((profile.completeness_percentage / 100) * 34)}{" "}
            campos restantes
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() =>
                setActiveSection(
                  activeSection === section.id ? null : section.id
                )
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">
                    {Math.round(section.completeness)}%
                  </div>
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${section.completeness}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground">
                    {activeSection === section.id ? "▼" : "▶"}
                  </div>
                </div>
              </div>
            </CardHeader>

            {activeSection === section.id && (
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Professional Context */}
                  {section.id === "professional" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="specific_profession">
                          Profissão Específica
                        </Label>
                        <Input
                          {...register("specific_profession")}
                          placeholder="Ex: Advogado tributarista, Coach executivo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="target_audience">Público-alvo</Label>
                        <Input
                          {...register("target_audience")}
                          placeholder="Ex: Pequenas empresas, Pessoas físicas"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="communication_tone">
                          Tom de Comunicação
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {choices?.communication_tones.map((tone) => (
                            <button
                              key={tone.value}
                              type="button"
                              onClick={() =>
                                setValue("communication_tone", tone.value)
                              }
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                watch("communication_tone") === tone.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {tone.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Áreas de Expertise</Label>
                        <div className="flex gap-2">
                          <Input
                            value={expertiseInput}
                            onChange={(e) => setExpertiseInput(e.target.value)}
                            placeholder="Adicionar área de especialização"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), handleAddExpertise())
                            }
                          />
                          <Button type="button" onClick={handleAddExpertise}>
                            Adicionar
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {watch("expertise_areas")?.map((area) => (
                            <span
                              key={area}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
                            >
                              {area}
                              <button
                                type="button"
                                onClick={() => handleRemoveExpertise(area)}
                                className="text-primary hover:text-primary/70"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {suggestions?.expertise_areas
                            .slice(0, 8)
                            .map((area) => (
                              <button
                                key={area}
                                type="button"
                                onClick={() => {
                                  const current =
                                    watch("expertise_areas") || [];
                                  if (!current.includes(area)) {
                                    setValue("expertise_areas", [
                                      ...current,
                                      area,
                                    ]);
                                  }
                                }}
                                className="px-2 py-1 text-xs rounded border border-border hover:border-primary transition-colors"
                              >
                                + {area}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Preferences */}
                  {section.id === "content" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Duração Preferida</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {choices?.content_durations.map((duration) => (
                            <button
                              key={duration.value}
                              type="button"
                              onClick={() =>
                                setValue("preferred_duration", duration.value)
                              }
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                watch("preferred_duration") === duration.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {duration.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Nível de Complexidade</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {choices?.complexity_levels.map((level) => (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() =>
                                setValue("complexity_level", level.value)
                              }
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                watch("complexity_level") === level.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theme_diversity">
                          Diversidade de Temas: {watch("theme_diversity")}
                        </Label>
                        <input
                          {...register("theme_diversity", {
                            valueAsNumber: true,
                          })}
                          type="range"
                          min="0"
                          max="10"
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Foco específico</span>
                          <span>Máxima variedade</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Frequência de Publicação</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {choices?.frequencies.map((freq) => (
                            <button
                              key={freq.value}
                              type="button"
                              onClick={() =>
                                setValue("publication_frequency", freq.value)
                              }
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                watch("publication_frequency") === freq.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {freq.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Media */}
                  {section.id === "social" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram_username">Instagram</Label>
                        <Input
                          {...register("instagram_username")}
                          placeholder="@seuusuario"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin_url">LinkedIn</Label>
                        <Input
                          {...register("linkedin_url")}
                          placeholder="https://linkedin.com/in/seuperfil"
                          type="url"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter_username">Twitter/X</Label>
                        <Input
                          {...register("twitter_username")}
                          placeholder="@seuusuario"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tiktok_username">TikTok</Label>
                        <Input
                          {...register("tiktok_username")}
                          placeholder="@seuusuario"
                        />
                      </div>
                    </div>
                  )}

                  {/* Business Context */}
                  {section.id === "business" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Estágio de Receita</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {choices?.revenue_stages.map((stage) => (
                            <button
                              key={stage.value}
                              type="button"
                              onClick={() =>
                                setValue("revenue_stage", stage.value)
                              }
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                watch("revenue_stage") === stage.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {stage.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tamanho da Equipe</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {choices?.team_sizes.map((size) => (
                            <button
                              key={size.value}
                              type="button"
                              onClick={() => setValue("team_size", size.value)}
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                watch("team_size") === size.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenue_goal">Meta de Receita</Label>
                        <Input
                          {...register("revenue_goal")}
                          placeholder="Ex: R$ 50k/mês"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="authority_goal">
                          Meta de Autoridade
                        </Label>
                        <Input
                          {...register("authority_goal")}
                          placeholder="Ex: 1000+ conexões qualificadas"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leads_goal">Meta de Leads</Label>
                        <Input
                          {...register("leads_goal")}
                          placeholder="Ex: 2-3 leads/mês via conteúdo"
                        />
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {section.id === "resources" && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          {...register("has_designer")}
                          type="checkbox"
                          id="has_designer"
                          className="rounded"
                        />
                        <Label htmlFor="has_designer">Tenho um designer</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Ferramentas Atuais</Label>
                        <div className="flex gap-2">
                          <Input
                            value={toolsInput}
                            onChange={(e) => setToolsInput(e.target.value)}
                            placeholder="Adicionar ferramenta"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), handleAddTool())
                            }
                          />
                          <Button type="button" onClick={handleAddTool}>
                            Adicionar
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {watch("current_tools")?.map((tool) => (
                            <span
                              key={tool}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
                            >
                              {tool}
                              <button
                                type="button"
                                onClick={() => handleRemoveTool(tool)}
                                className="text-primary hover:text-primary/70"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {suggestions?.tools.slice(0, 8).map((tool) => (
                            <button
                              key={tool}
                              type="button"
                              onClick={() => {
                                const current = watch("current_tools") || [];
                                if (!current.includes(tool)) {
                                  setValue("current_tools", [...current, tool]);
                                }
                              }}
                              className="px-2 py-1 text-xs rounded border border-border hover:border-primary transition-colors"
                            >
                              + {tool}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tools_budget">
                          Orçamento para Ferramentas
                        </Label>
                        <Input
                          {...register("tools_budget")}
                          placeholder="Ex: R$ 200-500/mês"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Horários Preferenciais</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {suggestions?.preferred_hours.map((hour) => (
                            <button
                              key={hour}
                              type="button"
                              onClick={() => handleToggleHour(hour)}
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                watch("preferred_hours")?.includes(hour)
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {hour}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="min-w-[120px]"
                    >
                      {updateMutation.isPending ? (
                        <Loading text="Salvando..." size="sm" />
                      ) : (
                        "Salvar Alterações"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
