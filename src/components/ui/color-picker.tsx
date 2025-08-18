import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
  placeholder?: string;
}

const predefinedColors = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#84CC16", // Lime
  "#6366F1", // Indigo
  "#F43F5E", // Rose
  "#14B8A6", // Teal
  "#FBBF24", // Amber
  "#A855F7", // Violet
  "#22C55E", // Emerald
  "#000000", // Black
  "#FFFFFF", // White
];

export const ColorPicker = ({
  value,
  onChange,
  label,
  placeholder,
}: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState(value || "#3B82F6");
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  // Inicializar com uma cor padrão se não houver valor
  useEffect(() => {
    if (value && value.match(/^#[0-9A-F]{6}$/i)) {
      const rgb = hexToRgb(value);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        setCustomColor(value);
      }
    } else {
      // Se não houver valor, usar a cor padrão
      setCustomColor("#3B82F6");
      setHue(217); // Azul
      setSaturation(100);
      setLightness(50);
    }
  }, [value]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    if (color.match(/^#[0-9A-F]{6}$/i)) {
      onChange(color);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 p-0 border-2"
              style={{ backgroundColor: value || "#f3f4f6" }}
            >
              <span className="sr-only">Selecionar cor</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              {/* Controle de Matiz */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Matiz (Hue)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => {
                      const newHue = parseInt(e.target.value);
                      setHue(newHue);
                      const color = hslToHex(newHue, saturation, lightness);
                      onChange(color);
                      setCustomColor(color);
                    }}
                    className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))`,
                    }}
                  />
                  <span className="text-sm w-12 text-center">{hue}°</span>
                </div>
              </div>

              {/* Espectro de Cores */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Espectro de Cores</Label>
                <div className="relative">
                  <div
                    className="w-full h-32 rounded border cursor-crosshair relative overflow-hidden"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(${hue}, 0%, 50%), 
                        hsl(${hue}, 100%, 50%)
                      ), linear-gradient(to top, 
                        hsl(${hue}, 100%, 0%), 
                        hsl(${hue}, 100%, 50%), 
                        hsl(${hue}, 100%, 100%)
                      )`,
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;

                      // Calcular saturação e luminosidade baseado na posição
                      const s = Math.max(
                        0,
                        Math.min(100, (x / rect.width) * 100)
                      );
                      const l = Math.max(
                        0,
                        Math.min(100, ((rect.height - y) / rect.height) * 100)
                      );

                      // Atualizar estados
                      setSaturation(s);
                      setLightness(l);

                      // Gerar nova cor
                      const color = hslToHex(hue, s, l);
                      onChange(color);
                      setCustomColor(color);
                    }}
                    title="Clique para selecionar uma cor"
                  >
                    {/* Indicador de posição */}
                    <div
                      className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none shadow-lg"
                      style={{
                        left: `${(saturation / 100) * 100}%`,
                        top: `${((100 - lightness) / 100) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Cores Predefinidas */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Cores Predefinidas
                </Label>
                <div className="grid grid-cols-8 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded border-2 transition-all hover:scale-110",
                        value === color ? "border-foreground" : "border-border"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Cor Personalizada */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cor Personalizada</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={placeholder || "#FFFFFF"}
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="flex-1"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: customColor || "#f3f4f6" }}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          placeholder={placeholder || "#FFFFFF"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

// Funções auxiliares para conversão de cores
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}
