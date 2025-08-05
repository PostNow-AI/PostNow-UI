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
    return Math.floor((profile.completeness_percentage / 100) * 34);
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
    handleSaveProfile,
    handleUploadAvatar,
    formatDate,
  };
};
