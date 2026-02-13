import { motion } from "framer-motion";
import { ColorPickerPopover } from "./ColorPickerPopover";

interface PreviewColorButtonProps {
  color: string;
  onChange: (color: string) => void;
}

export const PreviewColorButton = ({
  color,
  onChange,
}: PreviewColorButtonProps) => {
  return (
    <ColorPickerPopover color={color} onChange={onChange}>
      <motion.button
        type="button"
        className="flex-1 h-full hover:opacity-80 transition-opacity touch-manipulation cursor-pointer"
        style={{ backgroundColor: color }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        aria-label={`Editar cor ${color}`}
      />
    </ColorPickerPopover>
  );
};
