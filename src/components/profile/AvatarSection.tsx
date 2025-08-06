import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage, Input } from "@/components/ui";
import { Camera } from "lucide-react";

interface AvatarSectionProps {
  avatarData: string;
  userName: string;
  userInitials: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarSection = ({
  avatarData,
  userName,
  userInitials,
  onFileSelect,
}: AvatarSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
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

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
  );
}; 