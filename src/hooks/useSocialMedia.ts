import { type UseFormReturn } from "react-hook-form";

interface SocialMediaFormData {
  linkedin_url?: string | null;
  instagram_username?: string | null;
  youtube_channel?: string | null;
  tiktok_username?: string | null;
}

export const useSocialMedia = (form: UseFormReturn<SocialMediaFormData>) => {
  const { register, formState: { errors } } = form;

  // Função para validar URLs do LinkedIn
  const validateLinkedInUrl = (url: string) => {
    if (!url) return true;
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    return linkedinRegex.test(url) || "URL do LinkedIn inválida";
  };

  // Função para validar usernames do Instagram
  const validateInstagramUsername = (username: string) => {
    if (!username) return true;
    const instagramRegex = /^@?[a-zA-Z0-9._]+$/;
    return instagramRegex.test(username) || "Username do Instagram inválido";
  };

  // Função para validar usernames do TikTok
  const validateTikTokUsername = (username: string) => {
    if (!username) return true;
    const tiktokRegex = /^@?[a-zA-Z0-9._]+$/;
    return tiktokRegex.test(username) || "Username do TikTok inválido";
  };

  return {
    register,
    errors,
    validateLinkedInUrl,
    validateInstagramUsername,
    validateTikTokUsername,
  };
};

