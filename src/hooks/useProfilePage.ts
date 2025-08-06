import { useAuth } from "@/hooks/useAuth";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProfilePage = () => {
  const { user } = useAuth();

  // Fetch creator profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: creatorProfileApi.getProfile,
    retry: false,
  });

  const getUserName = () => {
    if (!user) return "Usuário";
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email ||
      "Usuário"
    );
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return (
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  const handleSaveProfile = () => {
    toast.info("Em desenvolvimento", {
      description:
        "A funcionalidade de edição de perfil será implementada em breve.",
    });
  };

  const handleUploadAvatar = () => {
    toast.info("Em desenvolvimento", {
      description:
        "A funcionalidade de upload de avatar será implementada em breve.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getCompletedFieldsCount = () => {
    if (!profile) return 0;

    // Count filled onboarding fields
    const onboardingFields = [
      profile.professional_name,
      profile.profession,
      profile.specialization,
      profile.linkedin_url,
      profile.instagram_username,
      profile.youtube_channel,
      profile.tiktok_username,
      profile.primary_color,
      profile.secondary_color,
      profile.accent_color_1,
      profile.accent_color_2,
      profile.accent_color_3,
      profile.primary_font,
      profile.secondary_font,
    ];

    return onboardingFields.filter((field) => field && field.toString().trim())
      .length;
  };

  const getStatusConfig = () => {
    if (!profile)
      return {
        text: "⏳ Pendente",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      };

    if (profile.onboarding_skipped) {
      return {
        text: "⏭️ Pulado",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      };
    }

    return profile.onboarding_completed
      ? {
          text: "✅ Completo",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        }
      : {
          text: "⏳ Pendente",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
  };

  return {
    // Data
    user,
    profile,
    isLoading,
    error,

    // Computed values
    userName: getUserName(),
    userInitials: getUserInitials(),
    statusConfig: getStatusConfig(),
    completedFieldsCount: getCompletedFieldsCount(),

    // Handlers
    handleSaveProfile,
    handleUploadAvatar,
    formatDate,
  };
};
