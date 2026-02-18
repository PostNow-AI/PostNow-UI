import { useState, useCallback } from "react";
import ColorThief from "colorthief";

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
};

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

// Calcula a distância entre duas cores no espaço RGB
const colorDistance = (color1: string, color2: string): number => {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  return Math.sqrt(
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
  );
};

// Filtra cores muito similares, mantendo apenas as distintas
const filterSimilarColors = (colors: string[], minDistance: number = 50): string[] => {
  const uniqueColors: string[] = [];

  for (const color of colors) {
    const isTooSimilar = uniqueColors.some(
      existingColor => colorDistance(color, existingColor) < minDistance
    );

    if (!isTooSimilar) {
      uniqueColors.push(color);
    }
  }

  return uniqueColors;
};

// Cores neutras para completar quando não tem 5 cores
const neutralColors = ["#F5F5F5", "#E0E0E0", "#9E9E9E", "#616161", "#212121"];

// Garante que sempre retorna 5 cores, completando com neutras se necessário
const ensureFiveColors = (colors: string[]): string[] => {
  if (colors.length >= 5) {
    return colors.slice(0, 5);
  }

  const result = [...colors];
  let neutralIndex = 0;

  while (result.length < 5 && neutralIndex < neutralColors.length) {
    const neutralColor = neutralColors[neutralIndex];
    // Só adiciona se não for muito similar às cores existentes
    const isTooSimilar = result.some(
      existingColor => colorDistance(neutralColor, existingColor) < 30
    );

    if (!isTooSimilar) {
      result.push(neutralColor);
    }
    neutralIndex++;
  }

  // Se ainda não tiver 5, adiciona as neutras restantes
  while (result.length < 5) {
    result.push(neutralColors[result.length % neutralColors.length]);
  }

  return result;
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
          // Extrair mais cores para ter mais opções de filtragem
          const palette = colorThief.getPalette(img, 10);
          const hexColors = palette.map(([r, g, b]: [number, number, number]) => rgbToHex(r, g, b));

          // Filtrar cores muito similares
          const uniqueColors = filterSimilarColors(hexColors);

          // Garantir que sempre retorna 5 cores
          const finalColors = ensureFiveColors(uniqueColors);

          setExtractedColors(finalColors);
          setIsExtracting(false);
          resolve(finalColors);
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
