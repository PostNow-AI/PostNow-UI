import { useState, useCallback } from "react";
import ColorThief from "colorthief";

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
};

export const useExtractColors = () => {
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const extractColorsFromImage = useCallback(async (base64Image: string): Promise<string[]> => {
    setIsExtracting(true);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 5);
          const hexColors = palette.map(([r, g, b]: [number, number, number]) => rgbToHex(r, g, b));
          setExtractedColors(hexColors);
          setIsExtracting(false);
          resolve(hexColors);
        } catch {
          setIsExtracting(false);
          reject(new Error("Erro ao extrair cores"));
        }
      };

      img.onerror = () => {
        setIsExtracting(false);
        reject(new Error("Erro ao carregar imagem"));
      };

      img.src = base64Image;
    });
  }, []);

  const updateColor = useCallback((index: number, newColor: string) => {
    setExtractedColors((prev) => {
      const updated = [...prev];
      updated[index] = newColor.toUpperCase();
      return updated;
    });
  }, []);

  return { extractedColors, isExtracting, extractColorsFromImage, updateColor, setExtractedColors };
};
