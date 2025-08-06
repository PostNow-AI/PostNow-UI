import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Camera, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface ImagePickerProps {
  value?: string;
  onChange: (value: string) => void;
  onError?: (error: string) => void;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  className?: string;
  disabled?: boolean;
}

export const ImagePicker = ({
  value,
  onChange,
  onError,
  maxSize = 1048576, // 1MB default
  acceptedFormats = ["image/jpeg", "image/png", "image/gif"],
  className,
  disabled = false,
}: ImagePickerProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Formato não suportado. Formatos aceitos: ${acceptedFormats
        .map((format) => format.split("/")[1].toUpperCase())
        .join(", ")}`;
    }

    return null;
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      const error = validateFile(file);
      if (error) {
        onError?.(error);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        onError?.("Erro ao ler o arquivo");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      onError?.("Erro ao processar o arquivo");
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label>Imagem de Perfil</Label>
      
      {/* Image Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-32 rounded-lg object-cover border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!disabled ? handleClick : undefined}
        >
          <div className="space-y-2">
            <div className="flex justify-center">
              {isLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isLoading ? "Processando..." : "Clique para selecionar ou arraste uma imagem"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF até {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Button */}
      {value && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isLoading}
          className="w-full"
        >
          <Camera className="mr-2 h-4 w-4" />
          {isLoading ? "Processando..." : "Alterar Imagem"}
        </Button>
      )}
    </div>
  );
}; 