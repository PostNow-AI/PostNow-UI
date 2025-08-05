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
import { type User } from "@/types/auth";

interface BasicUserInfoProps {
  user: User | null;
  userName: string;
  userInitials: string;
  onSaveProfile: () => void;
  onUploadAvatar: () => void;
}

export const BasicUserInfo = ({
  user,
  userName,
  userInitials,
  onSaveProfile,
  onUploadAvatar,
}: BasicUserInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Seus dados pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" onClick={onUploadAvatar}>
            Alterar Foto
          </Button>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                defaultValue={user?.first_name || ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                defaultValue={user?.last_name || ""}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email || ""} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">ID do Usuário</Label>
            <Input
              id="userId"
              defaultValue={user?.id?.toString() || ""}
              readOnly
            />
          </div>
        </div>

        <Button onClick={onSaveProfile} className="w-full">
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
};
