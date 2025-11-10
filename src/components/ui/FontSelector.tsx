import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AVAILABLE_FONTS,
  getFontsByCategory,
  type FontFamily,
} from "@/config/fonts";
import { cn } from "@/lib/utils";

interface FontSelectorProps {
  value?: string;
  onValueChange: (font: string) => void;
  className?: string;
  placeholder?: string;
  showCategories?: boolean;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onValueChange,
  className,
  placeholder = "Select a font",
  showCategories = true,
}) => {
  const renderFontItem = (font: FontFamily) => {
    // Add fallback fonts
    const getFontFamilyWithFallback = (fontName: string, category: string) => {
      switch (category) {
        case "serif":
          return `"${fontName}", serif`;
        case "handwriting":
          return `"${fontName}", cursive`;
        default:
          return `"${fontName}", sans-serif`;
      }
    };

    const fontFamilyWithFallback = getFontFamilyWithFallback(
      font.family,
      font.category
    );

    return (
      <SelectItem key={font.name} value={font.name} className="cursor-pointer">
        <div className="flex flex-col">
          <span
            className="font-medium"
            style={{ fontFamily: fontFamilyWithFallback }}
          >
            {font.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {font.description}
          </span>
        </div>
      </SelectItem>
    );
  };

  if (!showCategories) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {AVAILABLE_FONTS.map(renderFontItem)}
        </SelectContent>
      </Select>
    );
  }

  const categories = [
    { name: "sans-serif", label: "Sans Serif Fonts" },
    { name: "serif", label: "Serif Fonts" },
    { name: "display", label: "Display Fonts" },
    { name: "handwriting", label: "Handwriting Fonts" },
  ] as const;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {categories.map((category) => {
          const fonts = getFontsByCategory(category.name);
          if (fonts.length === 0) return null;

          return (
            <div key={category.name}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b">
                {category.label}
              </div>
              {fonts.map(renderFontItem)}
            </div>
          );
        })}
      </SelectContent>
    </Select>
  );
};

// Font preview component
interface FontPreviewProps {
  fontFamily: string;
  text?: string;
  className?: string;
}

export const FontPreview: React.FC<FontPreviewProps> = ({
  fontFamily,
  text = "The quick brown fox jumps over the lazy dog",
  className,
}) => {
  // Add fallback fonts based on category
  const getFontFamilyWithFallback = (fontName: string) => {
    const serif = [
      "Playfair Display",
      "Merriweather",
      "Crimson Text",
      "Libre Baskerville",
      "Cormorant Garamond",
    ];
    const cursive = ["Dancing Script", "Lobster", "Pacifico"];

    if (serif.includes(fontName)) {
      return `"${fontName}", serif`;
    } else if (cursive.includes(fontName)) {
      return `"${fontName}", cursive`;
    } else {
      return `"${fontName}", sans-serif`;
    }
  };

  const fontFamilyWithFallback = getFontFamilyWithFallback(fontFamily);

  return (
    <div
      className={cn(
        "p-4 border rounded-lg bg-background text-foreground",
        className
      )}
      style={{ fontFamily: fontFamilyWithFallback }}
    >
      <div
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: fontFamilyWithFallback }}
      >
        {fontFamily}
      </div>
      <div
        className="text-lg mb-2"
        style={{ fontFamily: fontFamilyWithFallback }}
      >
        {text}
      </div>
      <div className="text-sm text-muted-foreground">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
        <br />
        abcdefghijklmnopqrstuvwxyz
        <br />
        0123456789 !@#$%^&*()
      </div>
    </div>
  );
};

export default FontSelector;
