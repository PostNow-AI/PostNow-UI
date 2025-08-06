import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { useProfile } from "@/hooks/useProfile";
import { useUserForm } from "@/hooks/useUserForm";
import { type User } from "@/types/auth";
import { AvatarSection } from "./AvatarSection";
import { UserFormSection } from "./UserFormSection";

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
  const { updateUserProfile, uploadAvatar, isUpdatingUserProfile } =
    useProfile();

  const { processFile, isProcessing } = useAvatarUpload({
    onUpload: (avatarData: string) => {
      uploadAvatar(avatarData, {
        onSuccess: () => {
          onAvatarChange?.(avatarData);
        },
      });
    },
  });

  const userForm = useUserForm({
    user,
    onSubmit: (data) => {
      updateUserProfile(data, {
        onSuccess: () => {
          onSaveProfile();
        },
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Seus dados pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AvatarSection
          avatarData={avatar || ""}
          userName={userName}
          userInitials={userInitials}
          onFileSelect={handleFileSelect}
        />

        <UserFormSection
          user={user}
          form={userForm.form}
          isEditing={userForm.isEditing}
          isSubmitting={isUpdatingUserProfile || isProcessing}
          onStartEditing={userForm.startEditing}
          onCancel={userForm.handleCancel}
          onSubmit={userForm.handleSubmit}
        />
      </CardContent>
    </Card>
  );
};
