import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Palette, Sparkles } from "lucide-react";
import { useState } from "react";
import { EditableColorSwatch } from "./EditableColorSwatch";
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
  const [showCustom, setShowCustom] = useState(false);

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
    <div className="space-y-6">
      {/* Paletas pré-definidas */}
      {palettes && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Paletas sugeridas
            </span>
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              className="text-sm text-primary hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Palette className="h-3.5 w-3.5" />
              {showCustom ? "Ver paletas" : "Personalizar"}
            </button>
          </div>

          {!showCustom && (
            <div className="space-y-3">
              {/* Paleta do Logo - card especial */}
              {logoPalette?.length === 5 && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleLogoPaletteSelect}
                  className={cn(
                    "relative w-full p-3 rounded-xl border-2 transition-all",
                    "hover:border-primary/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "touch-manipulation active:scale-[0.98]",
                    isLogoPaletteSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  )}
                >
                  {isLogoPaletteSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}

                  <div className="flex gap-1 mb-2">
                    {logoPalette.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex-1 h-8 rounded-md first:rounded-l-lg last:rounded-r-lg"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Cores do seu logo</span>
                  </div>
                </motion.button>
              )}

              {/* Outras paletas */}
              <div className="grid grid-cols-2 gap-3">
                {palettes.map((palette, index) => {
                  const isSelected = selectedPalette === palette.name;

                  return (
                    <motion.button
                      key={palette.name}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handlePaletteSelect(palette)}
                      className={cn(
                        "relative p-3 rounded-xl border-2 transition-all",
                        "hover:border-primary/50",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        "touch-manipulation active:scale-[0.98]",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}

                      <div className="flex gap-1 mb-2">
                        {palette.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="flex-1 h-8 rounded-md first:rounded-l-lg last:rounded-r-lg"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <span className="text-sm font-medium">{palette.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cores personalizadas */}
      {(showCustom || !palettes) && (
        <div className="space-y-3">
          <span className="text-sm font-medium text-muted-foreground">
            Suas cores da marca
          </span>
          <p className="text-xs text-muted-foreground">
            Toque em uma cor para editá-la
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            {colors.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <EditableColorSwatch
                  color={color}
                  onChange={(newColor) => handleColorChange(index, newColor)}
                  size="lg"
                  showHex={true}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Preview das cores */}
      <div className="p-4 rounded-xl bg-muted/50 space-y-2">
        <span className="text-xs text-muted-foreground">Preview (toque para editar)</span>
        <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
          {colors.map((color, index) => (
            <PreviewColorButton
              key={index}
              color={color}
              onChange={(newColor) => handleColorChange(index, newColor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
