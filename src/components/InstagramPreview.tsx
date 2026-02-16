// @ts-nocheck
import React, { useMemo, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

interface InstagramPreviewProps {
  slide: {
    title?: string;
    body?: string;
    swipe_cta?: string;
  };
  visualSystem: {
    primary_colors: string[];
    visual_style: string;
    typography: string;
  };
  number: number;
  total: number;
  username?: string;
  className?: string;
}

// Função para calcular contraste (WCAG 2.1)
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function InstagramPreview({
  slide,
  visualSystem,
  number,
  total,
  username = "seu_perfil",
  className = "",
}: InstagramPreviewProps) {
  const backgroundColor = visualSystem.primary_colors[0] || '#1E3A8A';
  const originalTextColor = visualSystem.primary_colors[1] || '#FFFFFF';
  const originalAccentColor = visualSystem.primary_colors[2] || '#F97316';

  const fontFamily = visualSystem.typography || 'Inter';

  // Carregar fonte do Google Fonts dinamicamente
  useEffect(() => {
    const fontName = fontFamily.replace(/\s+/g, '+');
    const linkId = `google-font-${fontName}`;
    
    // Verificar se a fonte já foi carregada
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      console.log(`🔤 Carregando fonte: ${fontFamily} do Google Fonts`);
    }
  }, [fontFamily]);

  // Ajustar cores para garantir contraste AAA (7:1)
  const adjustedTextColor = useMemo(() => {
    const contrastWithOriginal = calculateContrastRatio(backgroundColor, originalTextColor);
    if (contrastWithOriginal >= 7) return originalTextColor;

    const contrastWithWhite = calculateContrastRatio(backgroundColor, '#FFFFFF');
    if (contrastWithWhite >= 7) return '#FFFFFF';

    const contrastWithBlack = calculateContrastRatio(backgroundColor, '#000000');
    if (contrastWithBlack >= 7) return '#000000';

    return originalTextColor;
  }, [backgroundColor, originalTextColor]);

  const adjustedAccentColor = useMemo(() => {
    const contrastWithOriginal = calculateContrastRatio(backgroundColor, originalAccentColor);
    if (contrastWithOriginal >= 7) return originalAccentColor;

    const contrastWithWhite = calculateContrastRatio(backgroundColor, '#FFFFFF');
    if (contrastWithWhite >= 7) return '#FFFFFF';

    const contrastWithBlack = calculateContrastRatio(backgroundColor, '#000000');
    if (contrastWithBlack >= 7) return '#000000';

    return originalAccentColor;
  }, [backgroundColor, originalAccentColor]);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header do Instagram */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{username}</span>
        </div>
        <button className="p-1" aria-label="Mais opções">
          <MoreHorizontal className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>
      </div>

      {/* Carrossel Slide - Formato 4:5 do Instagram */}
      <div 
        className="relative w-full aspect-[4/5] flex flex-col items-center justify-center p-8"
        style={{ 
          backgroundColor,
          fontFamily: `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        }}
      >
        {/* Estilo Visual Badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
          <span 
            className="text-[10px] font-medium" 
            style={{ 
              color: adjustedTextColor,
              fontFamily: `"${fontFamily}", sans-serif`
            }}
          >
            {visualSystem.visual_style}
          </span>
        </div>

        {/* Conteúdo do Slide */}
        <div className="text-center space-y-4 max-w-[85%]">
          {/* Título */}
          {slide.title && (
            <h2 
              className="text-3xl font-bold leading-tight"
              style={{ 
                color: adjustedTextColor,
                fontFamily: `"${fontFamily}", sans-serif`
              }}
            >
              {slide.title}
            </h2>
          )}

          {/* Corpo */}
          {slide.body && (
            <p 
              className="text-base leading-relaxed"
              style={{ 
                color: adjustedTextColor,
                fontFamily: `"${fontFamily}", sans-serif`
              }}
            >
              {slide.body}
            </p>
          )}

          {/* CTA */}
          {slide.swipe_cta && (
            <div 
              className="text-sm font-semibold pt-2"
              style={{ 
                color: adjustedAccentColor,
                fontFamily: `"${fontFamily}", sans-serif`
              }}
            >
              {slide.swipe_cta}
            </div>
          )}
        </div>

        {/* Indicador de slide */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
          {Array.from({ length: total }).map((_, idx) => (
            <div
              key={idx}
              className="h-1 rounded-full transition-all"
              style={{
                width: idx === number - 1 ? '24px' : '6px',
                backgroundColor: idx === number - 1 ? adjustedTextColor : `${adjustedTextColor}40`
              }}
            />
          ))}
        </div>

        {/* Número do slide (pequeno) */}
        <div className="absolute bottom-3 right-3 px-1.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
          <span className="text-[10px] font-medium" style={{ color: adjustedTextColor }}>
            {number}/{total}
          </span>
        </div>
      </div>

      {/* Ações do Instagram */}
      <div className="px-3 py-2 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <button aria-label="Curtir">
              <Heart className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <button aria-label="Comentar">
              <MessageCircle className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <button aria-label="Compartilhar">
              <Send className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
          </div>
          <button aria-label="Salvar">
            <Bookmark className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{username}</span>
          {' '}Carrossel gerado com IA
        </p>
      </div>
    </div>
  );
}
