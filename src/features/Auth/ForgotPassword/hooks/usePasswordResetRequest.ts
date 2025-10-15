import { passwordResetService } from "@/lib/services/passwordResetService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const passwordResetRequestSchema = z.object({
  email: z.string().email("Por favor, digite um endereço de email válido"),
});

export type PasswordResetRequestFormData = z.infer<
  typeof passwordResetRequestSchema
>;

export function usePasswordResetRequest() {
  const navigate = useNavigate();

  const form = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  const passwordResetMutation = useMutation({
    mutationFn: passwordResetService.requestPasswordReset,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Email enviado!", {
          description:
            result.message ||
            "Verifique sua caixa de entrada para redefinir sua senha.",
          duration: 5000,
        });

        // Navigate to email sent page or back to login
        navigate("/login");
      } else {
        toast.error("Erro ao enviar email", {
          description:
            result.message || "Não foi possível enviar o email de redefinição.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Erro inesperado", {
        description:
          error.message || "Ocorreu um erro ao processar sua solicitação.",
      });
    },
  });

  const onSubmit = async (data: PasswordResetRequestFormData) => {
    passwordResetMutation.mutate(data);
  };

  return {
    form,
    isLoading: passwordResetMutation.isPending,
    onSubmit,
    isSuccess: passwordResetMutation.isSuccess,
    isError: passwordResetMutation.isError,
  };
}
