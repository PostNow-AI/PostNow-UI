import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BetaLogo } from "@/components/ui/beta-logo";
import { Loader } from "@/components/ui/loader";
import { GoogleOAuthButton } from "@/features/Auth/Login/components/GoogleOAuthButton";
import { authApi, authUtils } from "@/lib/auth";
import { handleApiError } from "@/lib/utils/errorHandling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  first_name: z.string().min(1, "Nome é obrigatório"),
  last_name: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupStepProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const SignupStep = ({
  onSuccess,
  onBack,
}: SignupStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      queryClient.clear();
      // Toast removido - não interromper fluxo do paywall
      await new Promise((resolve) => setTimeout(resolve, 100));
      onSuccess();
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro no cadastro",
        defaultDescription: "Não foi possível criar a conta. Tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    registerMutation.mutate({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  const handleGoogleSignup = () => {
    try {
      // Salvar flag para saber que veio do onboarding
      localStorage.setItem("postnow_from_onboarding", "true");
      authUtils.loginWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao fazer cadastro com Google"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <BetaLogo />
            <h1 className="text-2xl font-bold mt-4">Crie sua conta</h1>
            <p className="text-muted-foreground mt-2">
              Para salvar seu perfil e receber ideias personalizadas
            </p>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  {...register("first_name")}
                  id="first_name"
                  placeholder="Seu nome"
                  className="h-12"
                />
                {errors.first_name && (
                  <p className="text-destructive text-xs">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  {...register("last_name")}
                  id="last_name"
                  placeholder="Seu sobrenome"
                  className="h-12"
                />
                {errors.last_name && (
                  <p className="text-destructive text-xs">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                type="email"
                id="email"
                placeholder="seu@email.com"
                className="h-12"
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Crie uma senha"
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-12 text-base"
            >
              {registerMutation.isPending ? <Loader /> : "Criar conta"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Google button */}
          <GoogleOAuthButton
            onClick={handleGoogleSignup}
            className="w-full h-12"
          >
            Continuar com Google
          </GoogleOAuthButton>

          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground"
          >
            Voltar
          </button>
        </motion.div>
      </main>
    </div>
  );
};
