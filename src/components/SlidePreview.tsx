// @ts-nocheck
import React, { useMemo } from 'react';

interface SlidePreviewProps {
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

function adjustColorForContrast(bgColor: string, fgColor: string, targetRatio: number = 7): string {
  const ratio = calculateContrastRatio(bgColor, fgColor);
  
  // Se já tem contraste suficiente, retorna a cor original
  if (ratio >= targetRatio) return fgColor;
  
  // Calcular luminância do fundo
  const bgRgb = hexToRgb(bgColor);
  if (!bgRgb) return fgColor;
  
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  // Se fundo é claro (luminância > 0.5), usar texto escuro
  // Se fundo é escuro (luminância <= 0.5), usar texto claro
  return bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function SlidePreview({ 
  slide, 
  visualSystem, 
  number, 
  total, 
  className = '' 
}: SlidePreviewProps) {
  // Extrair cores
  const backgroundColor = visualSystem.primary_colors[0] || '#1E3A8A';
  const textColor = visualSystem.primary_colors[1] || '#FFFFFF';
  const accentColor = visualSystem.primary_colors[2] || '#F97316';
  
  // Ajustar cores para garantir contraste WCAG AAA (7:1)
  const adjustedTextColor = useMemo(() => 
    adjustColorForContrast(backgroundColor, textColor, 7),
    [backgroundColor, textColor]
  );
  
  const adjustedAccentColor = useMemo(() => {
    const ratio = calculateContrastRatio(backgroundColor, accentColor);
    // Se accent não tem contraste suficiente, ajusta
    return ratio >= 4.5 ? accentColor : adjustColorForContrast(backgroundColor, accentColor, 4.5);
  }, [backgroundColor, accentColor]);
  
  // Mapear estilos visuais para classes CSS
  const styleClasses: Record<string, string> = {
    'Bold Vibrante': 'font-bold',
    'Minimalista Moderno': 'font-light',
    'Elegante Sofisticado': 'font-serif',
    'Tech Futurista': 'font-mono tracking-wide',
    'Criativo Artístico': 'font-medium',
    'Corporativo Profissional': 'font-normal',
    'default': 'font-normal'
  };
  
  const styleClass = styleClasses[visualSystem.visual_style] || styleClasses['default'];
  
  // Mapear tipografia
  const fontFamilyMap: Record<string, string> = {
    'Inter': 'font-sans',
    'Poppins': 'font-sans',
    'Roboto': 'font-sans',
    'Playfair Display': 'font-serif',
    'Merriweather': 'font-serif',
    'Bebas Neue': 'tracking-wider uppercase',
    'Anton': 'tracking-wide uppercase font-black',
    'default': 'font-sans'
  };
  
  const typographyClass = fontFamilyMap[visualSystem.typography] || fontFamilyMap['default'];
  
  return (
    <div 
      className={`
        aspect-[4/5] rounded-lg shadow-2xl p-6 flex flex-col justify-between
        transition-all duration-300 relative overflow-hidden
        ${styleClass} ${typographyClass} ${className}
      `}
      style={{ 
        backgroundColor: backgroundColor,
        color: adjustedTextColor
      }}
    >
      {/* Efeito de gradiente sutil baseado no estilo */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustedAccentColor} 100%)`
        }}
      />
      
      {/* Conteúdo do slide */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Título */}
        <h2 
          className="text-2xl font-bold mb-4 leading-tight"
          style={{ color: adjustedTextColor }}
        >
          {slide.title || 'Título do Slide'}
        </h2>
        
        {/* Corpo do texto */}
        <p 
          className="text-base flex-1"
          style={{ color: adjustedTextColor }}
        >
          {slide.body || 'Corpo do texto aparecerá aqui. Edite os campos ao lado para ver as mudanças em tempo real.'}
        </p>
        
        {/* CTA de swipe (se houver) */}
        {slide.swipe_cta && number < total && (
          <div 
            className="mt-4 flex items-center gap-2 text-sm font-medium"
            style={{ color: adjustedAccentColor }}
          >
            <span>{slide.swipe_cta}</span>
            <span className="text-xl animate-pulse">→</span>
          </div>
        )}
      </div>
      
      {/* Footer com número do slide */}
      <div className="relative z-10 flex justify-between items-center mt-4 pt-4 border-t border-current border-opacity-20">
        <span 
          className="text-sm font-medium"
          style={{ color: adjustedTextColor, opacity: 0.7 }}
        >
          {number}/{total}
        </span>
        
        {/* Placeholder para logo */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
          style={{ 
            backgroundColor: adjustedAccentColor,
            color: backgroundColor
          }}
        >
          📷
        </div>
      </div>
      
      {/* Badge do estilo visual */}
      <div 
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-black bg-opacity-30 backdrop-blur-sm"
        style={{ color: adjustedTextColor }}
      >
        {visualSystem.visual_style}
      </div>
    </div>
  );
}

