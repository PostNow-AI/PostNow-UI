import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PREDEFINED_COLORS } from "../../constants/colors";

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}

export const ColorPickerPopover = ({
  color,
  onChange,
  children,
  align = "center",
}: ColorPickerPopoverProps) => {
  const [localColor, setLocalColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  const handleHexInputChange = (hex: string) => {
    setLocalColor(hex);
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(hex.toUpperCase());
    }
  };

  const handlePredefinedSelect = (presetColor: string) => {
    handleColorChange(presetColor);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-5 z-[9999]"
        align={align}
        sideOffset={8}
      >
        <div className="space-y-5">
          {/* Color Picker */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Escolha a cor</Label>
            <div className="flex justify-center">
              <HexColorPicker
                color={localColor}
                onChange={handleColorChange}
                style={{ width: "100%", height: "160px" }}
              />
            </div>
          </div>

          {/* Predefined Colors - Mobile friendly grid */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cores rápidas</Label>
            <div className="grid grid-cols-4 gap-3">
              {PREDEFINED_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className={cn(
                    "w-14 h-14 rounded-xl border-2 transition-all",
                    "hover:scale-105 active:scale-95",
                    "touch-manipulation",
                    localColor.toUpperCase() === presetColor.toUpperCase()
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-border"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePredefinedSelect(presetColor)}
                />
              ))}
            </div>
          </div>

          {/* HEX Input */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Código HEX</Label>
            <div className="flex gap-3 items-center">
              <Input
                value={localColor.toUpperCase()}
                onChange={(e) => handleHexInputChange(e.target.value)}
                placeholder="#000000"
                className="flex-1 font-mono text-center h-12 text-lg"
                maxLength={7}
              />
              <div
                className="w-14 h-14 rounded-xl border-2 border-border shrink-0"
                style={{ backgroundColor: localColor }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
