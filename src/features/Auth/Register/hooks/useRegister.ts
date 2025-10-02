import { authApi, authUtils } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  registerSchema,
  type RegisterFormData,
} from "../constants/registerSchema";

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

      // Show success toast
      toast.success("Conta criada com sucesso! Bem-vindo ao Sonora.");

      // Small delay to ensure authentication state propagates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate to home page
      navigate("/ideabank");

      queryClient.invalidateQueries({ queryKey: ["monthly-credits"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha no cadastro");
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
