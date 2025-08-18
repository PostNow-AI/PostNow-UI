import { Button, Separator } from "@/components/ui";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BrandbookSection } from "./profile/ProfileEditForm/BrandbookSection";
import { ProfessionalInfoSection } from "./profile/ProfileEditForm/ProfessionalInfoSection";
import { SocialMediaSection } from "./profile/ProfileEditForm/SocialMediaSection";

const profileEditSchema = z.object({
  professional_name: z.string().optional().or(z.literal("")),
  profession: z.string().optional().or(z.literal("")),
  specialization: z.string().optional().or(z.literal("")),
  linkedin_url: z
    .string()
    .url("URL do LinkedIn deve ser válida")
    .optional()
    .or(z.literal("")),
  instagram_username: z.string().optional().or(z.literal("")),
  youtube_channel: z.string().optional().or(z.literal("")),
  tiktok_username: z.string().optional().or(z.literal("")),
  primary_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional()
    .or(z.literal(""))
    .or(z.literal(undefined))
    .or(z.literal(null)),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional()
    .or(z.literal(""))
    .or(z.literal(undefined))
    .or(z.literal(null)),
  accent_color_1: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional()
    .or(z.literal(""))
    .or(z.literal(undefined))
    .or(z.literal(null)),
  accent_color_2: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional()
    .or(z.literal(""))
    .or(z.literal(undefined))
    .or(z.literal(null)),
  accent_color_3: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato #FFFFFF")
    .optional()
    .or(z.literal(""))
    .or(z.literal(undefined))
    .or(z.literal(null)),
  primary_font: z.string().optional().or(z.literal("")),
  secondary_font: z.string().optional().or(z.literal("")),
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
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    updateProfileMutation.mutate(cleanedData);
  };

  return (
    <div className="p-6 space-y-6">
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <ProfessionalInfoSection form={form} />

        <SocialMediaSection form={form} />

        <BrandbookSection form={form} />

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
