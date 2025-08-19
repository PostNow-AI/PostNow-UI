import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { Share2 } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

interface SocialMediaFormData {
  linkedin_url?: string | null;
  instagram_username?: string | null;
  youtube_channel?: string | null;
  tiktok_username?: string | null;
}

interface SocialMediaSectionProps {
  form: UseFormReturn<SocialMediaFormData>;
}

export const SocialMediaSection = ({ form }: SocialMediaSectionProps) => {
  const {
    register,
    errors,
  } = useSocialMedia(form);

  return (
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
  );
};
