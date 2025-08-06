import { cn } from "@/lib/utils";
import { useState } from "react";
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
  const [customColor, setCustomColor] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);

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
          <PopoverContent className="w-64 p-4">
            <div className="space-y-4">
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
