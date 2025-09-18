import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Textarea,
} from "@/components/ui";
import { ColorPicker } from "@/components/ui/color-picker";
import { ImagePicker } from "@/components/ui/image-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Building2, Loader2, Palette, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileEditSchema = z.object({
  // Step 1: Personal information
  professional_name: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 2;
    }, "Nome profissional deve ter pelo menos 2 caracteres"),
  profession: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 2;
    }, "Profissão deve ter pelo menos 2 caracteres"),
  instagram_handle: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 1;
    }, "Instagram deve ter pelo menos 1 caractere"),
  whatsapp_number: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 10;
    }, "WhatsApp deve ter pelo menos 10 dígitos"),

  // Step 2: Business information
  business_name: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 2;
    }, "Nome do negócio deve ter pelo menos 2 caracteres"),
  specialization: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 2;
    }, "Especialização deve ter pelo menos 2 caracteres"),
  business_instagram_handle: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 1;
    }, "Instagram do negócio deve ter pelo menos 1 caractere"),
  business_website: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.includes(".") && val.length > 3;
    }, "Website deve ser uma URL válida"),
  business_city: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 2;
    }, "Cidade deve ter pelo menos 2 caracteres"),
  business_description: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 10;
    }, "Descrição deve ter pelo menos 10 caracteres"),

  // Step 3: Branding
  logo: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.includes("http") || val.includes("data:");
    }, "Logo deve ser uma URL ou imagem válida"),
  voice_tone: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return val.trim().length >= 2;
    }, "Tom de voz deve ter pelo menos 2 caracteres"),
  color_1: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return /^#[0-9A-F]{6}$/i.test(val);
    }, "Cor deve estar no formato #FFFFFF"),
  color_2: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return /^#[0-9A-F]{6}$/i.test(val);
    }, "Cor deve estar no formato #FFFFFF"),
  color_3: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return /^#[0-9A-F]{6}$/i.test(val);
    }, "Cor deve estar no formato #FFFFFF"),
  color_4: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return /^#[0-9A-F]{6}$/i.test(val);
    }, "Cor deve estar no formato #FFFFFF"),
  color_5: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.literal(null))
    .refine((val) => {
      if (!val || val === "") return true;
      return /^#[0-9A-F]{6}$/i.test(val);
    }, "Cor deve estar no formato #FFFFFF"),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  initialData?: Partial<ProfileEditFormData>;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const ProfileEditForm = ({
  initialData,
  onComplete,
  onCancel,
}: ProfileEditFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: initialData,
  });

  const updateProfileMutation = useMutation({
    mutationFn: creatorProfileApi.updateProfile,
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

  const handleFormSubmit = (data: ProfileEditFormData) => {
    // Clean up empty values before sending
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => {
        // Remove campos vazios, null, undefined ou apenas espaços em branco
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );

    // Se não há dados para enviar, mostrar mensagem
    if (Object.keys(cleanedData).length === 0) {
      toast.info("Nenhuma alteração foi feita no perfil.");
      return;
    }

    updateProfileMutation.mutate(cleanedData);
  };

  return (
    <div className="p-6 space-y-6">
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Step 1: Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professional_name">Nome Profissional</Label>
                <Input
                  id="professional_name"
                  placeholder="Seu nome profissional"
                  {...form.register("professional_name")}
                />
                {form.formState.errors.professional_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.professional_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">Profissão</Label>
                <Input
                  id="profession"
                  placeholder="Sua profissão"
                  {...form.register("profession")}
                />
                {form.formState.errors.profession && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.profession.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_handle">Instagram Pessoal</Label>
                <Input
                  id="instagram_handle"
                  placeholder="seu_usuario (sem @)"
                  {...form.register("instagram_handle")}
                />
                {form.formState.errors.instagram_handle && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.instagram_handle.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  placeholder="(11) 99999-9999"
                  {...form.register("whatsapp_number")}
                />
                {form.formState.errors.whatsapp_number && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.whatsapp_number.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações do Negócio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Nome do Negócio</Label>
                <Input
                  id="business_name"
                  placeholder="Nome da sua empresa/marca"
                  {...form.register("business_name")}
                />
                {form.formState.errors.business_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Especialização</Label>
                <Input
                  id="specialization"
                  placeholder="Sua especialização"
                  {...form.register("specialization")}
                />
                {form.formState.errors.specialization && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.specialization.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_instagram_handle">
                  Instagram do Negócio
                </Label>
                <Input
                  id="business_instagram_handle"
                  placeholder="usuario_negocio (sem @)"
                  {...form.register("business_instagram_handle")}
                />
                {form.formState.errors.business_instagram_handle && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business_instagram_handle.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_website">Website</Label>
                <Input
                  id="business_website"
                  placeholder="https://seusite.com"
                  {...form.register("business_website")}
                />
                {form.formState.errors.business_website && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business_website.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_city">Cidade</Label>
                <Input
                  id="business_city"
                  placeholder="Sua cidade"
                  {...form.register("business_city")}
                />
                {form.formState.errors.business_city && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business_city.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_description">Descrição do Negócio</Label>
              <Textarea
                id="business_description"
                placeholder="Descreva seu negócio e o que você faz"
                {...form.register("business_description")}
              />
              {form.formState.errors.business_description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.business_description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Brandbook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImagePicker
              value={form.watch("logo") || ""}
              onChange={(value) => form.setValue("logo", value)}
              onError={(error) => {
                // Handle error by setting form error
                form.setError("logo", { type: "manual", message: error });
              }}
              maxSize={5 * 1024 * 1024} // 5MB
              acceptedFormats={[
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp",
              ]}
            />
            {form.formState.errors.logo && (
              <p className="text-sm text-destructive">
                {form.formState.errors.logo.message}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="voice_tone">Tom de Voz</Label>
              <Select
                value={form.watch("voice_tone") || ""}
                onValueChange={(value) => form.setValue("voice_tone", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom de voz..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal e Profissional</SelectItem>
                  <SelectItem value="casual">Casual e Amigável</SelectItem>
                  <SelectItem value="inspirador">
                    Inspirador e Motivacional
                  </SelectItem>
                  <SelectItem value="educativo">
                    Educativo e Didático
                  </SelectItem>
                  <SelectItem value="engraçado">
                    Descontraído e Engraçado
                  </SelectItem>
                  <SelectItem value="autoridade">
                    Autoridade no Assunto
                  </SelectItem>
                  <SelectItem value="empático">
                    Empático e Compreensivo
                  </SelectItem>
                  <SelectItem value="minimalista">
                    Direto e Minimalista
                  </SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.voice_tone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.voice_tone.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <Label>Paleta de Cores</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <ColorPicker
                    key={num}
                    label={`Cor ${num}`}
                    value={
                      form.watch(`color_${num}` as keyof ProfileEditFormData) ||
                      ""
                    }
                    onChange={(color) =>
                      form.setValue(
                        `color_${num}` as keyof ProfileEditFormData,
                        color
                      )
                    }
                    placeholder="#ffffff"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={updateProfileMutation.isPending}
            >
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex-1 sm:flex-none"
          >
            {updateProfileMutation.isPending ? (
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
