import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { PreviewColorButton } from "./PreviewColorButton";

interface ColorPalette {
  name: string;
  colors: string[];
}

interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  palettes?: ColorPalette[];
  logoPalette?: string[];
}

export const ColorPicker = ({
  colors,
  onChange,
  palettes,
  logoPalette,
}: ColorPickerProps) => {
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  const handlePaletteSelect = (palette: ColorPalette) => {
    setSelectedPalette(palette.name);
    onChange(palette.colors);
  };

  const handleLogoPaletteSelect = () => {
    if (logoPalette?.length === 5) {
      setSelectedPalette("logo");
      onChange(logoPalette);
    }
  };

  // Verifica se a paleta do logo está selecionada
  const isLogoPaletteSelected = selectedPalette === "logo" ||
    (logoPalette?.length === 5 && JSON.stringify(colors) === JSON.stringify(logoPalette));

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color.toUpperCase();
    onChange(newColors);
    setSelectedPalette(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Paletas pré-definidas - ocupa o espaço disponível */}
      {palettes && (
        <div className="flex-1 space-y-2">
          {/* Paleta do Logo - card especial */}
          {logoPalette?.length === 5 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleLogoPaletteSelect}
              className={cn(
                "w-full p-2 rounded-xl border-2 transition-all",
                "hover:border-primary/50",
                "focus:outline-none",
                "touch-manipulation active:scale-[0.98]",
                isLogoPaletteSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <div className="flex gap-1 h-7 mb-1">
                {logoPalette.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="flex-1 first:rounded-l-lg last:rounded-r-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">Cores do seu logo</span>
                {isLogoPaletteSelected && (
                  <Check className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
            </motion.button>
          )}

          {/* Outras paletas */}
          <div className="grid grid-cols-2 gap-2">
            {palettes.map((palette, index) => {
              const isSelected = selectedPalette === palette.name;

              return (
                <motion.button
                  key={palette.name}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handlePaletteSelect(palette)}
                  className={cn(
                    "relative p-2 rounded-xl border-2 transition-all",
                    "hover:border-primary/50",
                    "focus:outline-none",
                    "touch-manipulation active:scale-[0.98]",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}

                  <div className="flex gap-1 h-7 mb-1">
                    {palette.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex-1 first:rounded-l-lg last:rounded-r-lg"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-medium">{palette.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cores escolhidas - fixo na parte inferior */}
      {palettes && (
        <div className="shrink-0 mt-auto p-4 rounded-2xl bg-primary/5 border-2 border-primary shadow-lg shadow-primary/20 space-y-3">
          <div>
            <span className="text-sm font-medium">Cores escolhidas</span>
            <p className="text-xs text-muted-foreground">Clique e altere as cores</p>
          </div>
          <div className="flex gap-1 h-12 rounded-xl overflow-hidden">
            {colors.map((color, index) => (
              <PreviewColorButton
                key={index}
                color={color}
                onChange={(newColor) => handleColorChange(index, newColor)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
