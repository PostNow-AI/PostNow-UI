import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BetaLogo } from "@/components/ui/beta-logo";
import { Loader } from "@/components/ui/loader";
import { GoogleOAuthButton } from "@/features/Auth/Login/components/GoogleOAuthButton";
import { authApi, authUtils } from "@/lib/auth";
import { subscriptionApiService } from "@/lib/subscription-api";
import { handleApiError } from "@/lib/utils/errorHandling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, EyeClosed, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginStepProps {
  onSuccess: () => void;
  onSignupClick: () => void;
  onBack: () => void;
}

export const LoginStep = ({
  onSuccess,
  onSignupClick,
  onBack,
}: LoginStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      queryClient.clear();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if user is admin/superuser - bypass subscription check
      if (data?.user?.is_superuser || data?.user?.is_staff) {
        toast.success("Bem-vindo, admin!");
        navigate("/admin/daily-posts");
        return;
      }

      // Check if user already has active subscription
      try {
        const subscription = await subscriptionApiService.getUserSubscription();
        if (subscription?.status === "active" || subscription?.status === "trialing") {
          // User has active subscription, go directly to the system
          toast.success("Bem-vindo de volta!");
          navigate("/ideabank");
          return;
        }
      } catch (error) {
        console.error("[LoginStep] Error checking subscription:", error);
      }

      // No active subscription, continue to paywall
      toast.success("Login realizado! Finalize sua assinatura.");
      onSuccess();
    },
    onError: (error: unknown) => {
      const errorResult = handleApiError(error, {
        defaultTitle: "Erro no login",
        defaultDescription: "Verifique suas credenciais e tente novamente.",
      });
      toast.error(errorResult.description);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    try {
      // Salvar flag para saber que veio do onboarding
      localStorage.setItem("postnow_from_onboarding", "true");
      authUtils.loginWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao fazer login com Google"
      );
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* HEADER - Apenas botão voltar */}
      <header className="shrink-0 bg-background">
        <div className="px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-2"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <BetaLogo />
            <h1 className="text-2xl font-bold mt-4">Entrar na sua conta</h1>
            <p className="text-muted-foreground mt-2">
              Seus dados do onboarding serão sincronizados automaticamente
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                type="email"
                id="email"
                placeholder="seu@email.com"
                className="h-12"
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 text-base"
            >
              {loginMutation.isPending ? <Loader /> : "Entrar"}
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
            onClick={handleGoogleLogin}
            className="w-full h-12"
          >
            Continuar com Google
          </GoogleOAuthButton>

          {/* Signup link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={onSignupClick}
              className="text-primary font-medium hover:underline"
            >
              Criar conta
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
};
