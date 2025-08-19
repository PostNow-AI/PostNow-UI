import { socialAccountsService } from "@/lib/services/socialAccountsService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export interface SocialAccount {
  id: number;
  provider: string;
  extra_data?: {
    picture?: string;
  };
}

export const useDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user picture from social accounts
  const { data: userPicture } = useQuery({
    queryKey: ["user-picture", user?.id],
    queryFn: async (): Promise<string | null> => {
      try {
        const response = await socialAccountsService.getSocialAccounts();
        const socialAccounts: SocialAccount[] = response.social_accounts || [];
        const googleAccount = socialAccounts.find(
          (acc: SocialAccount) => acc.provider === "google"
        );

        return googleAccount?.extra_data?.picture || null;
      } catch (error) {
        console.error("Erro ao buscar foto do usuário:", error);
        return null;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserInitials = (): string => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const getUserName = (): string => {
    if (!user) return "Usuário";
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.email ||
      "Usuário"
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    user,
    userPicture,
    isMobileMenuOpen,
    getUserInitials,
    getUserName,
    handleLogout,
    toggleMobileMenu,
    closeMobileMenu,
  };
};
