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
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Palette, Share2, Type, User, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileEditSchema = z.object({
  professional_name: z
    .string()
    .min(2, "Nome profissional deve ter pelo menos 2 caracteres")
    .optional(),
  profession: z
    .string()
    .min(2, "Profissão deve ter pelo menos 2 caracteres")
    .optional(),
  specialization: z
    .string()
    .min(2, "Especialização deve ter pelo menos 2 caracteres")
    .optional(),
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
  secondary_font: z.string().optional(),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  initialData?: Partial<ProfileEditFormData>;
  onComplete?: () => void;
  onCancel?: () => void;
}

// Predefined options
const professionOptions = [
  "Advogado",
  "Coach",
  "Consultor",
  "Médico",
  "Psicólogo",
  "Dentista",
  "Contador",
  "Arquiteto",
  "Designer",
  "Programador",
  "Professor",
  "Fisioterapeuta",
  "Nutricionista",
  "Personal Trainer",
  "Outro",
];

const specializationOptions = [
  "Tributário",
  "Trabalhista",
  "Civil",
  "Executivo",
  "Empresarial",
  "Financeiro",
  "Digital",
  "Estratégico",
  "Cardiologia",
  "Ortopedia",
  "Psicologia Clínica",
  "Psicologia Organizacional",
  "Endodontia",
  "Ortodontia",
  "Contabilidade Tributária",
  "Contabilidade Societária",
  "Arquitetura Residencial",
  "Arquitetura Comercial",
  "Design Gráfico",
  "Design de Produto",
  "Desenvolvimento Web",
  "Desenvolvimento Mobile",
  "Clínica Geral",
  "Pediatria",
  "Educação Física",
  "Nutrição Esportiva",
  "Nutrição Clínica",
  "Outro",
];

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Poppins",
  "Montserrat",
  "Lato",
  "Source Sans Pro",
  "Nunito",
  "Ubuntu",
  "Raleway",
  "Playfair Display",
  "Merriweather",
  "PT Sans",
  "Noto Sans",
  "Work Sans",
  "Outro",
];

export const ProfileEditForm = ({
  initialData,
  onComplete,
  onCancel,
}: ProfileEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: initialData,
  });

  const watchedValues = watch();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileEditFormData) => {
      const response = await creatorProfileApi.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      toast.success("Perfil atualizado com sucesso!");
      onComplete?.();
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Erro ao atualizar perfil"
        );
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    },
  });

  const handleFormSubmit = async (data: ProfileEditFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Editar Perfil do Criador</h1>
          <p className="text-muted-foreground">
            Atualize suas informações profissionais e preferências de marca
          </p>
        </div>
        {onCancel && (
          <Button variant="outline" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
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
                    {professionOptions.map((profession) => (
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma especialização" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializationOptions.map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialization && (
                  <p className="text-sm text-destructive">
                    {errors.specialization.message}
                  </p>
                )}
              </div>
            </div>
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
                    {fontOptions.map((font) => (
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
                    {fontOptions.map((font) => (
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
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}

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
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
