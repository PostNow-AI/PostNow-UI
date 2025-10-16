import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
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
  disabled = false,
}: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState(value || "#3B82F6");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setCustomColor(value);
    }
  }, [value]);

  const handleColorSelect = (color: string) => {
    if (!onChange) return;
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleColorChange = (color: string) => {
    if (!onChange) return;
    setCustomColor(color);
    onChange(color);
  };

  const handleCustomColorInputChange = (color: string) => {
    if (!onChange) return;
    setCustomColor(color);
    if (color.match(/^#[0-9A-F]{6}$/i)) {
      onChange(color);
    }
  };

  return (
    <div className="flex flex-col w-[40px]">
      {label && <Label className="mb-2">{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-[40px] h-10 p-0 border-0 rounded-4xl"
            style={{ backgroundColor: value || "#f3f4f6" }}
          >
            <span className="sr-only">Selecionar cor</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 z-[9999] pointer-events-auto">
          <div className="space-y-4">
            {/* React Colorful Color Picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Seletor de Cores</Label>
              <div className="flex justify-center">
                <HexColorPicker
                  color={customColor}
                  onChange={handleColorChange}
                  style={{ width: "300px", height: "150px" }}
                />
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
                      "w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
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
                  onChange={(e) => handleCustomColorInputChange(e.target.value)}
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
    </div>
  );
};
