// @ts-nocheck
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface SlideThumbnailProps {
  slide: {
    title?: string;
    body?: string;
  };
  number: number;
  isActive: boolean;
  isValid: boolean;
  primaryColor: string;
  textColor: string;
  onClick: () => void;
}

export function SlideThumbnail({ 
  slide, 
  number, 
  isActive, 
  isValid,
  primaryColor, 
  textColor,
  onClick 
}: SlideThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-[4/5] rounded-lg border-2 transition-all
        hover:scale-105 hover:shadow-lg group
        ${isActive 
          ? 'border-blue-500 shadow-lg scale-105' 
          : 'border-gray-300 dark:border-gray-700 opacity-70 hover:opacity-100'
        }
      `}
      style={{ 
        backgroundColor: primaryColor,
        color: textColor
      }}
    >
      {/* Conteúdo do thumbnail */}
      <div className="p-2 h-full flex flex-col justify-between">
        {/* Número do slide */}
        <div className="text-xs font-bold text-center mb-1">
          {number}
        </div>
        
        {/* Título (truncado) */}
        <div className="text-[8px] leading-tight line-clamp-2 font-medium">
          {slide.title || 'Sem título'}
        </div>
        
        {/* Badge de validação */}
        <div className="flex justify-center mt-1">
          {isValid ? (
            <div className="bg-green-500 rounded-full p-0.5">
              <Check className="h-2 w-2 text-white" />
            </div>
          ) : (
            <div className="bg-red-500 rounded-full p-0.5">
              <AlertCircle className="h-2 w-2 text-white" />
            </div>
          )}
        </div>
      </div>
      
      {/* Indicador de ativo */}
      {isActive && (
        <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
      )}
      
      {/* Tooltip no hover */}
      <div className="absolute left-full ml-2 top-0 z-50 hidden group-hover:block bg-gray-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
        Slide {number}: {slide.title || 'Sem título'}
      </div>
    </button>
  );
}

interface SlideThumbnailBarProps {
  slides: any[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  primaryColor: string;
  textColor: string;
}

export function SlideThumbnailBar({ 
  slides, 
  currentSlideIndex, 
  onSelectSlide,
  primaryColor,
  textColor
}: SlideThumbnailBarProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Navegação Rápida
      </h4>
      <div className="space-y-2">
        {slides.map((slide, idx) => {
          const isValid = (slide.title?.length || 0) <= 50 && (slide.body?.length || 0) <= 120;
          
          return (
            <SlideThumbnail
              key={idx}
              slide={slide}
              number={idx + 1}
              isActive={idx === currentSlideIndex}
              isValid={isValid}
              primaryColor={primaryColor}
              textColor={textColor}
              onClick={() => onSelectSlide(idx)}
            />
          );
        })}
      </div>
      
      {/* Legenda */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-2 border-t">
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 rounded-full p-0.5">
            <Check className="h-2 w-2 text-white" />
          </div>
          <span>Válido</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-red-500 rounded-full p-0.5">
            <AlertCircle className="h-2 w-2 text-white" />
          </div>
          <span>Excede limite</span>
        </div>
      </div>
    </div>
  );
}

