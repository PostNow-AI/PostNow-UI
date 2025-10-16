import { passwordResetService } from "@/lib/services/passwordResetService";
import { handleApiError } from "@/lib/utils/errorHandling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const passwordResetConfirmSchema = z
  .object({
    newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A confirmação da senha deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type PasswordResetConfirmFormData = z.infer<
  typeof passwordResetConfirmSchema
>;

export function usePasswordResetConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const uid = searchParams.get("uidb36");
  const token = searchParams.get("key");

  const isValidParams = Boolean(uid && token);

  const form = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
  });

  const passwordResetConfirmMutation = useMutation({
    mutationFn: (data: PasswordResetConfirmFormData) =>
      passwordResetService.confirmPasswordReset({
        new_password1: data.newPassword,
        new_password2: data.confirmPassword,
        uid: uid!,
        token: token!,
      }),
    onSuccess: (result) => {
      // Clear all cached data
      queryClient.clear();

      toast.success("Senha redefinida com sucesso!", {
        description: result.message || "Você foi automaticamente conectado.",
        duration: 3000,
      });

      // Redirect to dashboard or intended page
      setTimeout(() => {
        navigate("/ideabank");
      }, 2000);
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro na redefinição",
        defaultDescription: "Ocorreu um erro ao redefinir sua senha.",
      });
      toast.error(errorResult.title, {
        description: errorResult.description,
      });
    },
  });

  const onSubmit = async (data: PasswordResetConfirmFormData) => {
    if (!isValidParams) {
      toast.error("Link inválido", {
        description: "O link de redefinição de senha é inválido ou expirou.",
      });
      return;
    }

    passwordResetConfirmMutation.mutate(data);
  };

  return {
    form,
    isLoading: passwordResetConfirmMutation.isPending,
    onSubmit,
    isSuccess: passwordResetConfirmMutation.isSuccess,
    isError: passwordResetConfirmMutation.isError,
    isValidParams,
    uid,
    token,
  };
}
