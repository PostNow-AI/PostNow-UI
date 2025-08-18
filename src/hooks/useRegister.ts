import { authApi, authUtils } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Por favor, digite um endereço de email válido"),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra minúscula, maiúscula e um número"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

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
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha no cadastro");
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    registerMutation.mutate({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
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
