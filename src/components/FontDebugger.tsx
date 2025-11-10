import { AVAILABLE_FONTS } from "@/config/fonts";
import { useEffect, useState } from "react";

export const FontDebugger: React.FC = () => {
  const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

  useEffect(() => {
    // Check which fonts are actually loaded
    const checkFonts = async () => {
      const loaded: string[] = [];

      for (const font of AVAILABLE_FONTS) {
        if (document.fonts.check(`12px "${font.family}"`)) {
          loaded.push(font.family);
        }
      }

      setLoadedFonts(loaded);
    };

    // Wait for fonts to load
    document.fonts.ready.then(checkFonts);
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-muted">
      <h3 className="font-bold mb-2">Font Loading Debug</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Total fonts configured: {AVAILABLE_FONTS.length}
        <br />
        Fonts loaded in browser: {loadedFonts.length}
      </p>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {AVAILABLE_FONTS.map((font) => {
          const isLoaded = loadedFonts.includes(font.family);
          return (
            <div
              key={font.name}
              className={`text-sm p-2 rounded ${
                isLoaded
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span className="font-medium">{font.name}</span>
              <span className="ml-2 text-xs">
                ({font.family}) - {isLoaded ? "✓ Loaded" : "✗ Not Loaded"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="font-medium">Font Test:</h4>
        {["Inter", "Roboto", "Poppins", "Lobster", "Dancing Script"].map(
          (fontName) => (
            <div key={fontName}>
              <span className="text-sm text-muted-foreground">
                {fontName}:{" "}
              </span>
              <span style={{ fontFamily: fontName }}>
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FontDebugger;
