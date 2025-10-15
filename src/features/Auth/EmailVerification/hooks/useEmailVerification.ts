import { emailVerificationService } from "@/lib/services/emailVerificationService";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export type VerificationStatus = "idle" | "loading" | "success" | "error";

export interface UseEmailVerificationReturn {
  verificationStatus: VerificationStatus;
  verificationKey: string | null;
  handleNavigateToLogin: () => void;
  isValidKey: boolean;
  isVerifying: boolean;
}

export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verificationKey = searchParams.get("key");
  const isValidKey = Boolean(verificationKey);

  const handleNavigateToLogin = (): void => {
    navigate("/login");
  };

  const emailVerificationMutation = useMutation({
    mutationFn: emailVerificationService.verifyEmail,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Email verificado com sucesso!", {
          description:
            result.message || "Agora você pode fazer login em sua conta.",
          duration: 3000,
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Erro na verificação", {
          description: result.message || "Falha ao verificar o email.",
        });

        // If there are specific errors, log them
        if (result.errors) {
          console.error("Email verification errors:", result.errors);
        }
      }
    },
    onError: (error) => {
      console.error("Erro inesperado na verificação:", error);
      toast.error("Erro inesperado", {
        description:
          "Ocorreu um erro ao verificar seu email. Tente novamente mais tarde.",
      });
    },
  });

  const getVerificationStatus = (): VerificationStatus => {
    if (emailVerificationMutation.isPending) return "loading";
    if (
      emailVerificationMutation.isSuccess &&
      emailVerificationMutation.data?.success
    )
      return "success";
    if (
      emailVerificationMutation.isError ||
      (emailVerificationMutation.isSuccess &&
        !emailVerificationMutation.data?.success)
    )
      return "error";
    return "idle";
  };

  const { mutate: verifyEmail } = emailVerificationMutation;

  useEffect(() => {
    if (!verificationKey) {
      toast.error("Link inválido", {
        description:
          "Link de verificação inválido. Verifique seu email e tente novamente.",
      });
      return;
    }

    // Automatically trigger verification when component mounts with valid key
    verifyEmail(verificationKey);
  }, [verificationKey, verifyEmail]);

  return {
    verificationStatus: getVerificationStatus(),
    verificationKey,
    handleNavigateToLogin,
    isValidKey,
    isVerifying: emailVerificationMutation.isPending,
  };
};
