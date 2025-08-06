import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { api } from "@/lib/api";
import { type User } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const userProfileSchema = z.object({
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface BasicUserInfoProps {
  user: User | null;
  userName: string;
  userInitials: string;
  onSaveProfile: () => void;
  avatar?: string;
  onAvatarChange?: (avatar: string) => void;
}

export const BasicUserInfo = ({
  user,
  userName,
  userInitials,
  onSaveProfile,
  avatar,
  onAvatarChange,
}: BasicUserInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarData, setAvatarData] = useState(avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
  });

  const handleSaveProfile = async (data: UserProfileFormData) => {
    setIsSubmitting(true);
    try {
      await api.patch("/api/v1/creator-profile/user/profile/", data);
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      onSaveProfile();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar perfil";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      // Validate file size (1MB)
      if (file.size > 1048576) {
        toast.error("Arquivo muito grande. Tamanho máximo: 1MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Formato não suportado. Use JPEG, PNG ou GIF.");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        try {
          await api.post("/api/v1/creator-profile/user/avatar/", {
            avatar: base64,
          });
          setAvatarData(base64);
          onAvatarChange?.(base64);
          toast.success("Avatar atualizado com sucesso!");
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao fazer upload do avatar";
          toast.error(errorMessage);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Erro ao processar o arquivo");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Seus dados pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
                {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-24 w-24 transition-transform group-hover:scale-105">
              <AvatarImage src={avatarData || ""} alt={userName} />
              <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Clique na imagem para alterar
          </p>
          
          {/* Hidden file input */}
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* User Details Form */}
        <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                {...register("first_name")}
                disabled={!isEditing}
                className={errors.first_name ? "border-destructive" : ""}
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                {...register("last_name")}
                disabled={!isEditing}
                className={errors.last_name ? "border-destructive" : ""}
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} readOnly />
            <p className="text-xs text-muted-foreground">
              O email não pode ser alterado
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                Editar Informações
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
