import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { Specialization } from "@/lib/global-options-api";
import { globalOptionsApi } from "@/lib/global-options-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Palette, Share2, Type, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const onboardingSchema = z.object({
  professional_name: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Nome profissional deve ter pelo menos 2 caracteres",
    }),
  profession: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Profissão deve ter pelo menos 2 caracteres",
    }),
  custom_profession: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Profissão personalizada deve ter pelo menos 2 caracteres",
    }),
  specialization: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Especialização deve ter pelo menos 2 caracteres",
    }),
  custom_specialization: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Especialização personalizada deve ter pelo menos 2 caracteres",
    }),
  linkedin_url: z
    .string()
    .url("URL do LinkedIn deve ser válida")
    .optional()
    .or(z.literal("")),
  instagram_username: z.string().optional(),
  youtube_channel: z.string().optional(),
  tiktok_username: z.string().optional(),
  primary_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional(),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional(),
  accent_color_1: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional(),
  accent_color_2: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional(),
  accent_color_3: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional(),
  primary_font: z.string().optional(),
  custom_primary_font: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Fonte personalizada deve ter pelo menos 2 caracteres",
    }),
  secondary_font: z.string().optional(),
  custom_secondary_font: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Fonte personalizada deve ter pelo menos 2 caracteres",
    }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const OnboardingForm = ({ onComplete, onSkip }: OnboardingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const watchedValues = watch();
  const selectedProfession = watchedValues.profession;
  const selectedSpecialization = watchedValues.specialization;
  const selectedPrimaryFont = watchedValues.primary_font;
  const selectedSecondaryFont = watchedValues.secondary_font;
  const customProfessionInput = watchedValues.custom_profession;

  // Buscar dados da API
  const { data: professions = [] } = useQuery({
    queryKey: ["professions"],
    queryFn: globalOptionsApi.getProfessions,
  });

  const { data: fonts = { predefined: [], custom: [] } } = useQuery({
    queryKey: ["fonts"],
    queryFn: globalOptionsApi.getFonts,
  });

  const { data: specializations } = useQuery({
    queryKey: ["specializations", selectedProfession],
    queryFn: async () => {
      if (selectedProfession && selectedProfession !== "Outro") {
        const profession = professions.find(
          (p) => p.name === selectedProfession
        );
        if (profession) {
          console.log("Buscando especializações para profissão:", profession);
          const result = await globalOptionsApi.getProfessionSpecializations(
            profession.id
          );
          console.log("Especializações encontradas:", result);
          return result;
        }
      }
      return { profession: null, specializations: [] };
    },
    enabled: !!selectedProfession && selectedProfession !== "Outro",
  });

  // Obter todas as fontes disponíveis
  const allAvailableFonts = [
    ...fonts.predefined.map((f) => f.name),
    ...fonts.custom.map((f) => f.name),
    "Outro",
  ];

  // Verificar se deve mostrar campo de especialização customizada
  const shouldShowCustomSpecializationField =
    selectedProfession === "Outro" &&
    customProfessionInput &&
    customProfessionInput.trim() &&
    !professions.some((p) => p.name === customProfessionInput.trim());

  // Obter todas as profissões disponíveis
  const allAvailableProfessions = [...professions.map((p) => p.name), "Outro"];

  // Obter especializações disponíveis para a profissão selecionada
  const availableSpecializations = specializations?.specializations || [];

  // Debug: Log das especializações
  console.log("Profissão selecionada:", selectedProfession);
  console.log("Especializações carregadas:", specializations);
  console.log("Especializações disponíveis:", availableSpecializations);

  // Mutations para criar opções customizadas
  const createProfessionMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomProfession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professions"] });
      toast.success("Profissão criada com sucesso!");
      setValue("custom_profession", "");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Erro ao criar profissão");
    },
  });

  const createSpecializationMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomSpecialization,
    onSuccess: () => {
      // Invalidar queries de especializações e profissões para garantir atualização
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      queryClient.invalidateQueries({ queryKey: ["professions"] });

      // Forçar refetch das especializações
      if (selectedProfession && selectedProfession !== "Outro") {
        const profession = professions.find(
          (p) => p.name === selectedProfession
        );
        if (profession) {
          queryClient.refetchQueries({
            queryKey: ["specializations", selectedProfession],
          });
        }
      }

      toast.success("Especialização criada com sucesso!");
      setValue("custom_specialization", "");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Erro ao criar especialização"
      );
    },
  });

  const createFontMutation = useMutation({
    mutationFn: globalOptionsApi.createCustomFont,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fonts"] });
      toast.success("Fonte criada com sucesso!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Erro ao criar fonte");
    },
  });

  // Handlers para criar opções customizadas
  const handleAddCustomProfession = () => {
    const customValue = watchedValues.custom_profession;
    if (customValue && customValue.trim()) {
      createProfessionMutation.mutate({ name: customValue.trim() });
    }
  };

  const handleAddCustomSpecialization = () => {
    const customValue = watchedValues.custom_specialization;
    if (customValue && customValue.trim()) {
      // Se é uma profissão customizada, precisamos criar a profissão primeiro
      if (selectedProfession === "Outro" && customProfessionInput) {
        // Criar profissão e depois especialização
        createProfessionMutation.mutate(
          { name: customProfessionInput.trim() },
          {
            onSuccess: (newProfession) => {
              // Agora criar a especialização
              createSpecializationMutation.mutate({
                name: customValue.trim(),
                profession: newProfession.id,
              });
            },
          }
        );
      } else {
        // Profissão já existe, criar apenas a especialização
        const profession = professions.find(
          (p) => p.name === selectedProfession
        );
        if (profession) {
          // Usar a nova API para criar especialização para qualquer profissão
          globalOptionsApi
            .createCustomSpecializationForProfession({
              name: customValue.trim(),
              profession: profession.id,
            })
            .then(() => {
              // Invalidar queries para atualizar a lista
              queryClient.invalidateQueries({ queryKey: ["specializations"] });
              queryClient.invalidateQueries({ queryKey: ["professions"] });

              // Forçar refetch das especializações
              if (selectedProfession && selectedProfession !== "Outro") {
                queryClient.refetchQueries({
                  queryKey: ["specializations", selectedProfession],
                });
              }

              toast.success("Especialização criada com sucesso!");
              setValue("custom_specialization", "");
            })
            .catch((error) => {
              toast.error(
                error.response?.data?.message || "Erro ao criar especialização"
              );
            });
        }
      }
    }
  };

  const handleAddCustomFont = (fontType: "primary" | "secondary") => {
    const customValue =
      watchedValues[
        fontType === "primary" ? "custom_primary_font" : "custom_secondary_font"
      ];
    if (customValue && customValue.trim()) {
      createFontMutation.mutate({ name: customValue.trim() });
      setValue(
        fontType === "primary"
          ? "custom_primary_font"
          : "custom_secondary_font",
        ""
      );
    }
  };

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      // Preparar dados para envio
      const submitData = {
        ...data,
        profession:
          data.profession === "Outro"
            ? data.custom_profession
            : data.profession,
        specialization:
          data.specialization === "Outro"
            ? data.custom_specialization
            : data.specialization,
        primary_font:
          data.primary_font === "Outro"
            ? data.custom_primary_font
            : data.primary_font,
        secondary_font:
          data.secondary_font === "Outro"
            ? data.custom_secondary_font
            : data.secondary_font,
      };

      const response = await api.post(
        "/api/v1/creator-profile/onboarding/",
        submitData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast.success("Dados salvos com sucesso!");
      onComplete?.();
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao salvar dados");
      } else {
        toast.error("Erro ao salvar dados");
      }
    },
  });

  const skipMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        "/api/v1/creator-profile/onboarding/skip/"
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      toast.success("Onboarding pulado com sucesso!");
      onSkip?.();
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Erro ao pular onboarding"
        );
      } else {
        toast.error("Erro ao pular onboarding");
      }
    },
  });

  const handleFormSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      await onboardingMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      await skipMutation.mutateAsync();
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyData = Object.values(watchedValues).some(
    (value) => value && value.toString().trim()
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Personalize sua Experiência</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Coletamos essas informações para personalizar suas campanhas e
          melhorar a criação de conteúdo. Todos os campos são opcionais e podem
          ser preenchidos posteriormente na página do perfil.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Informações Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Profissionais
            </CardTitle>
            <CardDescription>
              Como você gostaria de ser conhecido profissionalmente?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professional_name">Nome Profissional</Label>
                <Input
                  id="professional_name"
                  placeholder="Ex: Dr. João Silva"
                  {...register("professional_name")}
                />
                {errors.professional_name && (
                  <p className="text-sm text-destructive">
                    {errors.professional_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profissão</Label>
                <Select
                  onValueChange={(value) => setValue("profession", value)}
                  value={watchedValues.profession || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma profissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAvailableProfessions.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.profession && (
                  <p className="text-sm text-destructive">
                    {errors.profession.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Especialização</Label>
                <Select
                  onValueChange={(value) => setValue("specialization", value)}
                  value={watchedValues.specialization || ""}
                  disabled={!selectedProfession}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma especialização" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpecializations.map(
                      (specialization: Specialization) => (
                        <SelectItem
                          key={specialization.id}
                          value={specialization.name}
                        >
                          {specialization.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {errors.specialization && (
                  <p className="text-sm text-destructive">
                    {errors.specialization.message}
                  </p>
                )}
              </div>
            </div>

            {/* Campos condicionais para profissão e especialização personalizadas */}
            {selectedProfession === "Outro" && (
              <div className="space-y-2">
                <Label htmlFor="custom_profession">Qual é sua profissão?</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom_profession"
                    placeholder="Descreva sua profissão"
                    {...register("custom_profession")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomProfession}
                    disabled={
                      !watchedValues.custom_profession?.trim() ||
                      createProfessionMutation.isPending
                    }
                  >
                    {createProfessionMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Adicionar"
                    )}
                  </Button>
                </div>
                {errors.custom_profession && (
                  <p className="text-sm text-destructive">
                    {errors.custom_profession.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Sua profissão será salva para referência futura de outros
                  usuários.
                </p>
              </div>
            )}

            {/* Campo de especialização customizada que aparece automaticamente */}
            {shouldShowCustomSpecializationField && (
              <div className="space-y-2">
                <Label htmlFor="custom_specialization">
                  Qual é sua especialização em {customProfessionInput}?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="custom_specialization"
                    placeholder="Descreva sua especialização"
                    {...register("custom_specialization")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomSpecialization}
                    disabled={
                      !watchedValues.custom_specialization?.trim() ||
                      createSpecializationMutation.isPending
                    }
                  >
                    {createSpecializationMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Adicionar"
                    )}
                  </Button>
                </div>
                {errors.custom_specialization && (
                  <p className="text-sm text-destructive">
                    {errors.custom_specialization.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Sua especialização será salva para referência futura de outros
                  usuários.
                </p>
              </div>
            )}

            {/* Campo de especialização customizada para todas as profissões */}
            {selectedProfession && selectedProfession !== "Outro" && (
              <div className="space-y-2">
                <Label htmlFor="custom_specialization">
                  Adicionar especialização personalizada para{" "}
                  {selectedProfession}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="custom_specialization"
                    placeholder="Descreva uma especialização personalizada"
                    {...register("custom_specialization")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomSpecialization}
                    disabled={
                      !watchedValues.custom_specialization?.trim() ||
                      createSpecializationMutation.isPending
                    }
                  >
                    {createSpecializationMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Adicionar"
                    )}
                  </Button>
                </div>
                {errors.custom_specialization && (
                  <p className="text-sm text-destructive">
                    {errors.custom_specialization.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Sua especialização será salva para referência futura de outros
                  usuários.
                </p>
              </div>
            )}

            {/* Campo de especialização customizada quando "Outro" é selecionado */}
            {selectedSpecialization === "Outro" &&
              !shouldShowCustomSpecializationField && (
                <div className="space-y-2">
                  <Label htmlFor="custom_specialization">
                    Qual é sua especialização?
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom_specialization"
                      placeholder="Descreva sua especialização"
                      {...register("custom_specialization")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCustomSpecialization}
                      disabled={
                        !watchedValues.custom_specialization?.trim() ||
                        createSpecializationMutation.isPending
                      }
                    >
                      {createSpecializationMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                  </div>
                  {errors.custom_specialization && (
                    <p className="text-sm text-destructive">
                      {errors.custom_specialization.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Sua especialização será salva para referência futura de
                    outros usuários.
                  </p>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Redes Sociais
            </CardTitle>
            <CardDescription>
              Suas redes sociais para campanhas personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  placeholder="https://linkedin.com/in/seu-perfil"
                  {...register("linkedin_url")}
                />
                {errors.linkedin_url && (
                  <p className="text-sm text-destructive">
                    {errors.linkedin_url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram_username">Instagram</Label>
                <Input
                  id="instagram_username"
                  placeholder="@seu_usuario"
                  {...register("instagram_username")}
                />
                {errors.instagram_username && (
                  <p className="text-sm text-destructive">
                    {errors.instagram_username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_channel">YouTube</Label>
                <Input
                  id="youtube_channel"
                  placeholder="Nome do canal"
                  {...register("youtube_channel")}
                />
                {errors.youtube_channel && (
                  <p className="text-sm text-destructive">
                    {errors.youtube_channel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok_username">TikTok</Label>
                <Input
                  id="tiktok_username"
                  placeholder="@seu_usuario"
                  {...register("tiktok_username")}
                />
                {errors.tiktok_username && (
                  <p className="text-sm text-destructive">
                    {errors.tiktok_username.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brandbook - Cores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Paleta de Cores
            </CardTitle>
            <CardDescription>
              Defina as cores da sua marca para personalização visual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Cor Primária"
                value={watchedValues.primary_color}
                onChange={(color) => setValue("primary_color", color)}
                placeholder="#3B82F6"
              />

              <ColorPicker
                label="Cor Secundária"
                value={watchedValues.secondary_color}
                onChange={(color) => setValue("secondary_color", color)}
                placeholder="#EF4444"
              />

              <ColorPicker
                label="Cor de Destaque 1"
                value={watchedValues.accent_color_1}
                onChange={(color) => setValue("accent_color_1", color)}
                placeholder="#10B981"
              />

              <ColorPicker
                label="Cor de Destaque 2"
                value={watchedValues.accent_color_2}
                onChange={(color) => setValue("accent_color_2", color)}
                placeholder="#F59E0B"
              />

              <ColorPicker
                label="Cor de Destaque 3"
                value={watchedValues.accent_color_3}
                onChange={(color) => setValue("accent_color_3", color)}
                placeholder="#8B5CF6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Brandbook - Tipografia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Tipografia
            </CardTitle>
            <CardDescription>Defina as fontes da sua marca</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_font">Fonte Primária</Label>
                <Select
                  onValueChange={(value) => setValue("primary_font", value)}
                  value={watchedValues.primary_font || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAvailableFonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.primary_font && (
                  <p className="text-sm text-destructive">
                    {errors.primary_font.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_font">Fonte Secundária</Label>
                <Select
                  onValueChange={(value) => setValue("secondary_font", value)}
                  value={watchedValues.secondary_font || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAvailableFonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.secondary_font && (
                  <p className="text-sm text-destructive">
                    {errors.secondary_font.message}
                  </p>
                )}
              </div>
            </div>

            {/* Campos condicionais para fontes personalizadas */}
            {selectedPrimaryFont === "Outro" && (
              <div className="space-y-2">
                <Label htmlFor="custom_primary_font">
                  Qual é sua fonte primária?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="custom_primary_font"
                    placeholder="Nome da fonte"
                    {...register("custom_primary_font")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddCustomFont("primary")}
                    disabled={
                      !watchedValues.custom_primary_font?.trim() ||
                      createFontMutation.isPending
                    }
                  >
                    {createFontMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Adicionar"
                    )}
                  </Button>
                </div>
                {errors.custom_primary_font && (
                  <p className="text-sm text-destructive">
                    {errors.custom_primary_font.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Sua fonte será salva para referência futura de outros
                  usuários.
                </p>
              </div>
            )}

            {selectedSecondaryFont === "Outro" && (
              <div className="text-xs text-muted-foreground">
                <Label htmlFor="custom_secondary_font">
                  Qual é sua fonte secundária?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="custom_secondary_font"
                    placeholder="Nome da fonte"
                    {...register("custom_secondary_font")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddCustomFont("secondary")}
                    disabled={
                      !watchedValues.custom_secondary_font?.trim() ||
                      createFontMutation.isPending
                    }
                  >
                    {createFontMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Adicionar"
                    )}
                  </Button>
                </div>
                {errors.custom_secondary_font && (
                  <p className="text-sm text-destructive">
                    {errors.custom_secondary_font.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Sua fonte será salva para referência futura de outros
                  usuários.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Dados"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Pular Onboarding
          </Button>
        </div>

        {!hasAnyData && (
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Você pode pular o onboarding e preencher esses dados depois na
              página do perfil.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
