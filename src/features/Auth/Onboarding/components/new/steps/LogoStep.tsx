import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { useExtractColors } from "@/hooks/useExtractColors";
import { PreviewColorButton } from "../PreviewColorButton";

// Limite de tamanho do logo (500KB)
const MAX_LOGO_SIZE_KB = 500;
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_KB * 1024;

interface LogoStepProps {
  value: string;
  onChange: (value: string) => void;
  suggestedColors?: string[];
  onColorsExtracted?: (colors: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LogoStep = ({
  value,
  onChange,
  suggestedColors,
  onColorsExtracted,
  onNext,
  onBack,
}: LogoStepProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { extractedColors, isExtracting, extractColorsFromImage, updateColor, setExtractedColors } = useExtractColors();
  // Logo é opcional
  const isValid = true;

  // Inicializar com cores já salvas ou extrair se tem logo mas não tem cores
  useEffect(() => {
    if (suggestedColors && suggestedColors.length > 0) {
      // Já tem cores salvas, usar elas
      setExtractedColors(suggestedColors);
    } else if (value && value.startsWith("data:image")) {
      // Tem logo mas não tem cores, extrair (primeira vez no step)
      extractColorsFromImage(value)
        .then((colors) => onColorsExtracted?.(colors))
        .catch(() => onColorsExtracted?.([]));
    }
    // Só rodar na montagem inicial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler para edição de cor individual
  const handleColorChange = useCallback((index: number, newColor: string) => {
    updateColor(index, newColor);
    // Atualiza as cores sugeridas com a nova cor
    const updatedColors = [...extractedColors];
    updatedColors[index] = newColor.toUpperCase();
    onColorsExtracted?.(updatedColors);
  }, [extractedColors, updateColor, onColorsExtracted]);

  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (file: File) => {
    setSizeError(null);

    if (!file.type.startsWith("image/")) {
      setSizeError("Por favor, selecione uma imagem.");
      return;
    }

    // Validar tamanho do arquivo antes de processar
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setSizeError(`O logo deve ter no máximo ${MAX_LOGO_SIZE_KB}KB. Seu arquivo tem ${Math.round(file.size / 1024)}KB.`);
      return;
    }

    setIsUploading(true);

    // Converter para base64 para armazenar localmente
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      onChange(base64);
      setIsUploading(false);

      // Extrair cores do novo logo
      try {
        const colors = await extractColorsFromImage(base64);
        onColorsExtracted?.(colors);
      } catch {
        onColorsExtracted?.([]);
      }
    };
    reader.readAsDataURL(file);
  }, [onChange, extractColorsFromImage, onColorsExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleRemove = useCallback(() => {
    onChange("");
    setExtractedColors([]);
    onColorsExtracted?.([]);
  }, [onChange, setExtractedColors, onColorsExtracted]);

  return (
    <MicroStepLayout
      step={11}
      totalSteps={TOTAL_STEPS}
      title="Adicione seu logo"
      subtitle="Opcional - vamos extrair as cores automaticamente!"
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
      nextLabel={value ? "Continuar" : "Pular"}
    >
      <div className="space-y-4">
        {value ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden border-2 border-primary bg-muted">
              <img
                src={value}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {isExtracting && (
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground text-center">Extraindo cores...</p>
              </div>
            )}

            {extractedColors.length > 0 && !isExtracting && (
              <div className="bg-muted/50 rounded-xl p-4 mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Cores extraídas (toque para editar)
                </p>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {extractedColors.map((color, i) => (
                    <PreviewColorButton
                      key={i}
                      color={color}
                      onChange={(newColor) => handleColorChange(i, newColor)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <label
            htmlFor="logo-upload"
            className={cn(
              "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              className="sr-only"
              onChange={handleInputChange}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">Carregando...</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {isDragging ? (
                    <Upload className="h-8 w-8 text-primary" />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-primary" />
                  )}
                </div>
                <span className="font-medium mb-1">
                  {isDragging ? "Solte a imagem aqui" : "Clique para enviar"}
                </span>
                <span className="text-sm text-muted-foreground text-center">
                  ou arraste e solte seu logo aqui
                </span>
                <span className="text-xs text-muted-foreground mt-2">
                  PNG, JPG ou SVG (máx. {MAX_LOGO_SIZE_KB}KB)
                </span>
              </>
            )}
          </label>
        )}

        {/* Mensagem de erro de tamanho */}
        {sizeError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive text-center"
          >
            {sizeError}
          </motion.p>
        )}
      </div>
    </MicroStepLayout>
  );
};
