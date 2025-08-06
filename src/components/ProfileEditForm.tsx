import { Button, Separator } from "@/components/ui";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ProfessionalInfoSection } from "./profile/ProfileEditForm/ProfessionalInfoSection";

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
    updateProfileMutation.mutate(data);
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

      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <ProfessionalInfoSection form={form} />

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
