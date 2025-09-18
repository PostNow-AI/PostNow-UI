import { useAuth } from "@/hooks/useAuth";
import { creatorProfileApi } from "@/lib/creator-profile-api";
import { useQuery } from "@tanstack/react-query";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getCompletedFieldsCount = () => {
    if (!profile) return 0;

    // Count filled onboarding fields from backend structure
    const onboardingFields = [
      // Step 1: Personal information
      profile.professional_name,
      profile.profession,
      profile.instagram_handle,
      profile.whatsapp_number,

      // Step 2: Business information
      profile.business_name,
      profile.specialization,
      profile.business_instagram_handle,
      profile.business_website,
      profile.business_city,
      profile.business_description,

      // Step 3: Branding
      profile.voice_tone,
      profile.color_1,
      profile.color_2,
      profile.color_3,
      profile.color_4,
      profile.color_5,
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
    formatDate,
  };
};
