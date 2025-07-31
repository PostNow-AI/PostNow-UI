import { Input, Label } from "@/components/ui";
import { type ProfileCompletionData } from "@/types/profile-completion";
import { type UseFormReturn } from "react-hook-form";

interface SocialSectionProps {
  form: UseFormReturn<ProfileCompletionData>;
}

export const SocialSection = ({ form }: SocialSectionProps) => {
  const { register } = form;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="instagram_username">Instagram</Label>
        <Input {...register("instagram_username")} placeholder="@seuusuario" />
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
        <Input {...register("twitter_username")} placeholder="@seuusuario" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tiktok_username">TikTok</Label>
        <Input {...register("tiktok_username")} placeholder="@seuusuario" />
      </div>
    </div>
  );
};
