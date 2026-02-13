// @ts-nocheck
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VisualSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: string[];
  style: string;
  typography: string;
  userBrandColors: string[];
  availableStyles: Array<{ id: number; name: string; description: string }>;
  onSave: (visualSystem: { palette: string[]; style: string; typography: string }) => void;
}

export const VisualSystemModal = ({
  isOpen,
  onClose,
  palette,
  style,
  typography,
  userBrandColors,
  availableStyles,
  onSave,
}: VisualSystemModalProps) => {
  // Estados locais para edição
  const [localPalette, setLocalPalette] = useState<string[]>(palette);
  const [localStyle, setLocalStyle] = useState(style);
  const [localTypography, setLocalTypography] = useState(typography);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);

  // Sincronizar com props quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setLocalPalette(palette);
      setLocalStyle(style);
      setLocalTypography(typography);
    }
  }, [isOpen, palette, style, typography]);

  const updateColor = (index: number, color: string) => {
    const newPalette = [...localPalette];
    newPalette[index] = color;
    setLocalPalette(newPalette);
  };

  const handleSave = () => {
    onSave({
      palette: localPalette,
      style: localStyle,
      typography: localTypography,
    });
    onClose();
  };

  const handleCancel = () => {
    // Resetar para valores originais
    setLocalPalette(palette);
    setLocalStyle(style);
    setLocalTypography(typography);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl">
            <span className="flex items-center">
              <span className="mr-2">🎨</span>
              Configurar Sistema Visual
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Paleta de Cores */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Paleta de Cores</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Selecione 3 cores que representam a identidade visual do seu carrossel.
              A ordem importa: primária, secundária e acento.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {localPalette.map((color, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {idx === 0 ? 'Cor Primária' : idx === 1 ? 'Cor Secundária' : 'Cor de Acento'}
                  </label>
                  
                  <div className="relative">
                    {/* Círculo colorido clicável */}
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(showColorPicker === idx ? null : idx)}
                      className="w-full h-24 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition-all hover:scale-105 shadow-md"
                      style={{ backgroundColor: color }}
                      title={`${color} - Clique para mudar`}
                    />
                    
                    <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
                      {color}
                    </p>
                    
                    {/* Popup com paleta da marca + HEX manual */}
                    {showColorPicker === idx && (
                      <div className="absolute top-28 left-0 z-50 bg-white dark:bg-gray-800 border-2 border-gray-300 rounded-lg shadow-xl p-4 w-full">
                        {/* Paleta da marca */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Cores da sua marca:
                          </p>
                          <div className="grid grid-cols-5 gap-2">
                            {userBrandColors.map((brandColor, bIdx) => (
                              <button
                                key={bIdx}
                                type="button"
                                onClick={() => {
                                  updateColor(idx, brandColor);
                                  setShowColorPicker(null);
                                }}
                                className="w-full h-12 rounded border-2 border-gray-200 hover:border-blue-500 hover:scale-110 transition-all"
                                style={{ backgroundColor: brandColor }}
                                title={brandColor}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Seletor HEX manual */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Ou escolha manualmente:
                          </p>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => updateColor(idx, e.target.value)}
                              className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                            />
                            <input
                              type="text"
                              value={color}
                              onChange={(e) => {
                                const hex = e.target.value;
                                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                                  updateColor(idx, hex);
                                }
                              }}
                              placeholder="#FFFFFF"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(null)}
                          className="mt-3 w-full text-sm bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                          Fechar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estilo Visual */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Estilo Visual</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Escolha o estilo que melhor representa a linguagem visual do seu conteúdo.
            </p>
            
            <select
              value={localStyle}
              onChange={(e) => setLocalStyle(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              {availableStyles.length > 0 ? (
                availableStyles.map((s) => (
                  <option key={s.id} value={s.name} title={s.description}>
                    {s.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="Minimalista profissional">Minimalista profissional</option>
                  <option value="Moderno e vibrante">Moderno e vibrante</option>
                  <option value="Elegante e sofisticado">Elegante e sofisticado</option>
                  <option value="Criativo e ousado">Criativo e ousado</option>
                  <option value="Clean e corporativo">Clean e corporativo</option>
                  <option value="Divertido e descontraído">Divertido e descontraído</option>
                  <option value="Técnico e preciso">Técnico e preciso</option>
                  <option value="Artístico e expressivo">Artístico e expressivo</option>
                </>
              )}
            </select>
          </div>

          {/* Tipografia */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Tipografia</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Selecione a família tipográfica que será usada nos textos do carrossel.
            </p>
            
            <select
              value={localTypography}
              onChange={(e) => setLocalTypography(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <optgroup label="Sans-serif (Modernas)">
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Nunito">Nunito</option>
              </optgroup>
              <optgroup label="Serif (Elegantes)">
                <option value="Playfair Display">Playfair Display</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Lora">Lora</option>
                <option value="Crimson Text">Crimson Text</option>
                <option value="Libre Baskerville">Libre Baskerville</option>
              </optgroup>
              <optgroup label="Display (Impactantes)">
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Oswald">Oswald</option>
                <option value="Raleway">Raleway</option>
                <option value="Anton">Anton</option>
                <option value="Righteous">Righteous</option>
              </optgroup>
              <optgroup label="Monospace (Técnicas)">
                <option value="Fira Code">Fira Code</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
                <option value="Source Code Pro">Source Code Pro</option>
                <option value="IBM Plex Mono">IBM Plex Mono</option>
              </optgroup>
            </select>
          </div>

          {/* Preview em Tempo Real */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Preview</h3>
            <div 
              className="w-full h-48 rounded-lg p-6 flex flex-col justify-center items-center"
              style={{ 
                backgroundColor: localPalette[0],
                fontFamily: localTypography
              }}
            >
              <h4 
                className="text-2xl font-bold mb-2"
                style={{ color: localPalette[1] }}
              >
                Título do Slide
              </h4>
              <p 
                className="text-sm"
                style={{ color: localPalette[1] }}
              >
                Este é um exemplo de como seu carrossel ficará
              </p>
              <div 
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: localPalette[2],
                  color: '#FFFFFF'
                }}
              >
                Deslize para continuar →
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Aplicar a Todos os Slides
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
