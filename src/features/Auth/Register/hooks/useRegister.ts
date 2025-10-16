import { authApi, authUtils } from "@/lib/auth";
import { handleApiError } from "@/lib/utils/errorHandling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  registerSchema,
  type RegisterFormData,
} from "../constants/registerSchema";

export function useRegister() {
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      // Invalidate and refetch user-related queries

      // Show success toast
      toast.success("Conta criada com sucesso! Bem-vindo ao Sonora.");

      // Small delay to ensure authentication state propagates
      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigate("/email-sent");
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro no cadastro",
        defaultDescription: "Não foi possível criar a conta. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    registerMutation.mutate({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  const handleGoogleRegister = async () => {
    try {
      authUtils.loginWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha no cadastro com Google"
      );
    }
  };

  return {
    form,
    isLoading: registerMutation.isPending,
    onSubmit,
    handleGoogleRegister,
    isSuccess: registerMutation.isSuccess,
    isError: registerMutation.isError,
  };
}
