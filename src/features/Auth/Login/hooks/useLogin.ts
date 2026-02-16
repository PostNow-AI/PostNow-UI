import { authApi, authUtils } from "@/lib/auth";
import { handleApiError } from "@/lib/utils/errorHandling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Por favor, digite um endereço de email válido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Invalidate and refetch user-related queries
      queryClient.clear();

      // Show success toast
      toast.success("Bem-vindo de volta! Você entrou com sucesso.");

      // Small delay to ensure authentication state propagates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if user is admin and came from admin route
      const from = location.state?.from?.pathname || "/ideabank";
      const isAdmin = data?.user?.is_superuser || data?.user?.is_staff;

      // If admin without specific destination, go to admin dashboard
      if (isAdmin && from === "/ideabank") {
        navigate("/admin/daily-posts", { replace: true });
        return;
      }

      // Navigate to intended destination or home page
      navigate(from, { replace: true });
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro no login",
        defaultDescription:
          "Não foi possível fazer login. Verifique suas credenciais.",
      });
      toast.error(errorResult.description);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
    try {
      authUtils.loginWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha no login com Google"
      );
    }
  };

  return {
    form,
    isLoading: loginMutation.isPending,
    onSubmit,
    handleGoogleLogin,
    isSuccess: loginMutation.isSuccess,
    isError: loginMutation.isError,
  };
}
