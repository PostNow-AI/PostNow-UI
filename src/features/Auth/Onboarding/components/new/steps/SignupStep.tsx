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
import { Eye, EyeClosed, Check, X, Loader2, ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

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

// Email validation states
type EmailValidationStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export const SignupStep = ({
  onSuccess,
  onBack,
}: SignupStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailValidationStatus>("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Cache de validação de email para evitar requisições duplicadas
  const emailValidationCache = useRef<Map<string, { available: boolean; message: string }>>(new Map());
  const queryClient = useQueryClient();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Debounced email validation with cache
  const checkEmail = useCallback(async (email: string) => {
    // Basic validation first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailStatus("idle");
      setEmailMessage("");
      return;
    }

    // Normalizar email para cache (lowercase)
    const normalizedEmail = email.toLowerCase().trim();

    // Verificar cache primeiro
    const cachedResult = emailValidationCache.current.get(normalizedEmail);
    if (cachedResult) {
      if (cachedResult.available) {
        setEmailStatus("available");
        setEmailMessage("Email disponível");
      } else {
        setEmailStatus("taken");
        setEmailMessage(cachedResult.message);
      }
      return;
    }

    setEmailStatus("checking");
    setEmailMessage("");

    try {
      const result = await authApi.checkEmailAvailability(email);

      // Armazenar no cache
      const message = result.available ? "Email disponível" : (result.message || "Este email já está cadastrado");
      emailValidationCache.current.set(normalizedEmail, {
        available: result.available,
        message,
      });

      if (result.available) {
        setEmailStatus("available");
        setEmailMessage("Email disponível");
      } else {
        setEmailStatus("taken");
        setEmailMessage(message);
      }
    } catch {
      // On error, don't block - let the registration handle it
      setEmailStatus("idle");
      setEmailMessage("");
    }
  }, []);

  // Watch email field and validate with debounce
  const emailValue = form.watch("email");
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset status if email is empty
    if (!emailValue) {
      setEmailStatus("idle");
      setEmailMessage("");
      return;
    }

    // Debounce the API call (500ms)
    debounceTimerRef.current = setTimeout(() => {
      checkEmail(emailValue);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [emailValue, checkEmail]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      queryClient.clear();
      toast.success("Conta criada com sucesso!");
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

      {/* Título */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <BetaLogo />
          <h1 className="text-xl font-bold mt-2">Crie sua conta</h1>
        </motion.div>
      </div>

      {/* CONTEÚDO - Flexível no meio */}
      <main className="flex-1 px-4 overflow-hidden">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col max-w-md mx-auto"
        >
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="first_name" className="text-sm">Nome</Label>
                <Input
                  {...register("first_name")}
                  id="first_name"
                  placeholder="Seu nome"
                  className="h-11"
                  autoComplete="given-name"
                />
                {errors.first_name && (
                  <p className="text-destructive text-xs">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="last_name" className="text-sm">Sobrenome</Label>
                <Input
                  {...register("last_name")}
                  id="last_name"
                  placeholder="Seu sobrenome"
                  className="h-11"
                  autoComplete="family-name"
                />
                {errors.last_name && (
                  <p className="text-destructive text-xs">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className={cn(
                    "h-11 pr-10",
                    emailStatus === "taken" && "border-destructive focus-visible:ring-destructive",
                    emailStatus === "available" && "border-green-500 focus-visible:ring-green-500"
                  )}
                />
                {/* Email validation indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailStatus === "checking" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {emailStatus === "available" && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {emailStatus === "taken" && (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              {/* Show email validation message or form error */}
              {emailStatus === "taken" && emailMessage && (
                <p className="text-destructive text-xs">{emailMessage}</p>
              )}
              {emailStatus === "available" && emailMessage && (
                <p className="text-green-600 text-xs">{emailMessage}</p>
              )}
              {errors.email && emailStatus !== "taken" && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">Senha</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  className="h-11 pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
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

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm">Confirmar senha</Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                  className="h-11 pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                  aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
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
          </div>
        </motion.form>
      </main>

      {/* FOOTER - Fixo embaixo */}
      <footer className="shrink-0 px-4 pb-safe pt-2 pb-4 space-y-3">
        <div className="max-w-md mx-auto space-y-3">
          <Button
            type="submit"
            disabled={registerMutation.isPending || emailStatus === "taken" || emailStatus === "checking"}
            onClick={handleSubmit(onSubmit)}
            className="w-full h-11 text-base"
          >
            {registerMutation.isPending ? <Loader /> : "Criar conta"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <GoogleOAuthButton
            onClick={handleGoogleSignup}
            className="w-full h-11"
          >
            Continuar com Google
          </GoogleOAuthButton>
        </div>
      </footer>
    </div>
  );
};
