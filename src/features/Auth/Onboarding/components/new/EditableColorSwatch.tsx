import { cn } from "@/lib/utils";
import { ColorPickerPopover } from "./ColorPickerPopover";

interface EditableColorSwatchProps {
  color: string;
  onChange: (color: string) => void;
  size?: "sm" | "md" | "lg";
  showHex?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12 min-w-[48px]",
  md: "w-14 h-14 min-w-[56px]",
  lg: "w-16 h-16 min-w-[64px]",
};

export const EditableColorSwatch = ({
  color,
  onChange,
  size = "md",
  showHex = true,
  className,
}: EditableColorSwatchProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <ColorPickerPopover color={color} onChange={onChange}>
        <button
          type="button"
          className={cn(
            sizeClasses[size],
            "rounded-xl border-2 border-border transition-all",
            "hover:border-primary hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "active:scale-95",
            "touch-manipulation"
          )}
          style={{ backgroundColor: color }}
          aria-label={`Editar cor ${color}`}
        />
      </ColorPickerPopover>

      {showHex && (
        <span className="text-xs text-muted-foreground font-mono">
          {color.toUpperCase()}
        </span>
      )}
    </div>
  );
};
