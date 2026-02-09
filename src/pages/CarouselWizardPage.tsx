// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Palette, CheckCircle } from 'lucide-react';
import { useCarouselEdit } from '@/hooks/useCarouselEdit';
import { InstagramPreview } from '@/components/InstagramPreview';
import { CarouselTemplateGallery, type CarouselTemplate } from '@/components/CarouselTemplateGallery';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { profileApi } from '@/features/Auth/Profile/services';

// Types
interface SessionData {
  session_id: string;
  theme: string;
  slide_count: number;
  status: string;
  expires_at: string;
}

interface StructureData {
  theme: string;
  semantic_analysis: any;
  slides_structure: any[];
  estimated_credits: {
    structure: number;
    texts: number;
    images: number;
  };
}

interface TextsData {
  slides: any[];
  visual_system: any;
}

interface PromptsData {
  image_prompts: any[];
  logo_placement: any;
  total_estimated_time: string;
}

// Step Indicator Component
function StepsIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 0, name: 'Template' },
    { num: 1, name: 'Tema' },
    { num: 2, name: 'Carrossel' },  // Estrutura + Textos + Visual UNIFICADO
    { num: 3, name: 'Prompts' },
  ];

  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= step.num
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step.num}
          </div>
          <span className="ml-2 text-sm">{step.name}</span>
          {index < steps.length - 1 && (
            <div className="w-12 h-1 mx-4 bg-gray-200" />
          )}
        </div>
      ))}
    </div>
  );
}

// Step 1: Init
function StepInit({ onSubmit, isLoading, initialTheme = '', initialSlideCount = 7, initialVoiceTone = 'Profissional', selectedTemplate = null }: any) {
  const [theme, setTheme] = useState(initialTheme);
  const [slideCount, setSlideCount] = useState(initialSlideCount);
  const [voiceTone, setVoiceTone] = useState(initialVoiceTone);
  const [customTone, setCustomTone] = useState('');
  
  // Lista de tons disponíveis
  const voiceTones = [
    'Profissional',
    'Inspirador',
    'Educativo',
    'Entusiasmado',
    'Reflexivo',
    'Humorístico',
    'Empático',
    'Motivacional',
    'Confiante',
    'Casual',
    'Urgente',
    'Descontraído',
    'Amigável',
    'Autoritário',
    'Conversacional',
    'Técnico',
    'Divertido',
    'Sério',
    'Caloroso',
    'Direto',
    'Outro'
  ];
  
  // Atualizar estados se os valores iniciais mudarem
  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);
  
  useEffect(() => {
    setSlideCount(initialSlideCount);
  }, [initialSlideCount]);
  
  useEffect(() => {
    setVoiceTone(initialVoiceTone);
  }, [initialVoiceTone]);

  const handleSubmit = () => {
    const finalTone = voiceTone === 'Outro' ? customTone : voiceTone;
    onSubmit({ 
      theme, 
      slide_count: slideCount,
      voice_tone: finalTone
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Novo Carrossel</h2>
      
      {/* Mostrar template selecionado se houver */}
      {selectedTemplate && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{selectedTemplate.emoji}</span>
              <div>
                <h3 className="font-bold text-lg">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTemplate.description}
                </p>
                <div className="flex space-x-1 mt-2">
                  {selectedTemplate.visualSystem.primary_colors.map((color: string, idx: number) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              ✨ Template aplicado!
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tema do Carrossel *
          </label>
          <textarea
            className="w-full border rounded-md p-3 h-32"
            placeholder="Ex: 7 motivos para você participar do ecossistema de startup de Brasília"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Mínimo 10 caracteres
          </p>
        </div>

        {/* 🆕 Tom/Emoção */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tom/Emoção do Carrossel *
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Define o estilo de comunicação de todo o carrossel (afeta estrutura e textos)
          </p>
          <select
            className="w-full border rounded-md p-3 mb-2"
            value={voiceTone}
            onChange={(e) => {
              setVoiceTone(e.target.value);
              if (e.target.value !== 'Outro') {
                setCustomTone('');
              }
            }}
          >
            {voiceTones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
          
          {voiceTone === 'Outro' && (
            <input
              type="text"
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              placeholder="Digite o tom desejado..."
              className="w-full border rounded-md p-3"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Número de Slides
          </label>
          <select
            className="w-full border rounded-md p-3"
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value))}
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} slides
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={theme.length < 10 || isLoading || (voiceTone === 'Outro' && !customTone.trim())}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando sessão...
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </Card>
  );
}

// Step 2 UNIFICADO: Structure + Texts + Visual
function StepStructureAndTexts({ 
  data, 
  savedAdjustments, 
  savedEditedSlides, 
  onNext, 
  onBack, 
  onRegenerate, 
  isLoading,
  isGenerating,
  realProgress  // NOVO: progresso real do backend
}: any) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);
  
  // Buscar perfil do usuário para obter o Instagram handle
  const { data: userProfile } = useQuery({
    queryKey: ['creator-profile'],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  // Extrair slides salvos (pode vir como objeto ou array)
  const savedSlides = savedEditedSlides?.slides || savedEditedSlides;
  
  const { editedData, hasChanges, updateField, resetChanges, getAdjustments} = 
    useCarouselEdit(data?.slides || [], Array.isArray(savedSlides) ? savedSlides : null);
  
  // Estados para Sistema Visual editável
  const [editablePalette, setEditablePalette] = useState<string[]>([]);
  const [editableStyle, setEditableStyle] = useState('');
  const [editableTypography, setEditableTypography] = useState('');
  const [visualSystemChanged, setVisualSystemChanged] = useState(false);
  const [availableStyles, setAvailableStyles] = useState<Array<{id: number; name: string; description: string}>>([]);
  const [userBrandColors, setUserBrandColors] = useState<string[]>([]);
  
  // Buscar paleta de cores do perfil do usuário
  useEffect(() => {
    api.get('/api/v1/creator-profile/profile/')
      .then(res => {
        const colors = [
          res.data.color_1,
          res.data.color_2,
          res.data.color_3,
          res.data.color_4,
          res.data.color_5
        ].filter(Boolean);
        setUserBrandColors(colors);
      })
      .catch(err => {
        console.error('Erro ao buscar paleta do perfil:', err);
        setUserBrandColors(['#1E3A8A', '#3B82F6', '#F97316', '#10B981', '#8B5CF6']);
      });
  }, []);
  
  // Buscar estilos visuais disponíveis
  useEffect(() => {
    api.get('/api/v1/carousel/visual-styles/')
      .then(res => {
        if (res.data.success) {
          setAvailableStyles(res.data.data);
        }
      })
      .catch(err => {
        console.error('Erro ao buscar estilos visuais:', err);
        setAvailableStyles([
          { id: 1, name: 'Minimalista profissional', description: '' },
          { id: 2, name: 'Moderno e vibrante', description: '' },
          { id: 3, name: 'Elegante e sofisticado', description: '' }
        ]);
      });
  }, []);
  
  // Inicializar estados do sistema visual
  useEffect(() => {
    if (data?.visual_system) {
      setEditablePalette(data.visual_system.primary_colors?.slice(0, 3) || ['#1E3A8A', '#3B82F6', '#F97316']);
      setEditableStyle(data.visual_system.visual_style || 'Moderno e Profissional');
      
      // ✅ CORRIGIDO: Extrair tipografia corretamente
      let typography = 'Inter'; // default
      if (data.visual_system.typography_system) {
        if (typeof data.visual_system.typography_system === 'object') {
          typography = data.visual_system.typography_system.family || 'Inter';
        } else if (typeof data.visual_system.typography_system === 'string') {
          typography = data.visual_system.typography_system;
        }
      } else if (data.visual_system.typography) {
        typography = data.visual_system.typography;
      }
      
      // Se tem vírgula, pegar só a primeira fonte
      if (typography.includes(',')) {
        typography = typography.split(',')[0].trim();
      }
      
      setEditableTypography(typography);
      console.log('📦 Sistema Visual carregado:', {
        colors: data.visual_system.primary_colors,
        style: data.visual_system.visual_style,
        typography: typography,
        typography_system: data.visual_system.typography_system
      });
    }
  }, [data?.visual_system]);
  
  // Restaurar dados completos salvos ao voltar da Etapa 4
  useEffect(() => {
    if (savedEditedSlides) {
      if (savedEditedSlides.visual_system) {
        setEditablePalette(savedEditedSlides.visual_system.primary_colors || editablePalette);
        setEditableStyle(savedEditedSlides.visual_system.visual_style || editableStyle);
        setEditableTypography(savedEditedSlides.visual_system.typography || editableTypography);
        setVisualSystemChanged(true);
      }
    }
  }, [savedEditedSlides]);
  
  const updatePalette = (index: number, color: string) => {
    const newPalette = [...editablePalette];
    newPalette[index] = color;
    setEditablePalette(newPalette);
    setVisualSystemChanged(true);
  };
  
  // LOADING STATES (novo para preview intermediário)
  // LOADING STATE COM PROGRESSO REAL
  if (isGenerating) {
    return (
      <Card className="p-8">
        <div className="text-center mb-6">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
          
          {/* Barra de Progresso */}
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${realProgress.progress_percent || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {realProgress.progress_percent || 0}% concluído
            </p>
          </div>
          
          {/* Mensagem de Status */}
          <p className="font-semibold text-lg mb-2">
            {realProgress.phase_name || 'Iniciando...'}
          </p>
          
          {/* Descrição da Fase */}
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-4">
            {realProgress.phase === 'semantic_analysis' && 
              'Analisando o tema e identificando os melhores tons e estilos visuais...'}
            {realProgress.phase === 'structure' && 
              'Criando a estrutura narrativa e organizando os slides...'}
            {realProgress.phase === 'visual_system' && 
              'Definindo paleta de cores, tipografia e estilo visual...'}
            {realProgress.phase === 'texts' && 
              'Refinando títulos, conteúdos e CTAs de cada slide...'}
            {realProgress.phase === 'complete' && 
              'Finalizando e preparando para edição!'}
            {!realProgress.phase && 
              'Gerando carrossel completo... Isso pode levar de 1 a 5 minutos dependendo do número de slides.'}
          </p>
          
          {/* Tempo estimado */}
          {realProgress.progress_percent && realProgress.progress_percent < 100 && (
            <p className="text-xs text-gray-400 mt-4">
              ⏱️ Tempo estimado restante: ~{Math.ceil((100 - realProgress.progress_percent) / 4)} segundos
            </p>
          )}
          
          {/* Aviso se demorar muito */}
          {!realProgress.progress_percent && (
            <p className="text-xs text-orange-500 mt-6 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg max-w-md mx-auto">
              💡 <strong>Dica:</strong> A geração pode demorar alguns minutos. Não feche esta página!
            </p>
          )}
        </div>
        
        {/* 🆕 Preview da Estrutura quando progresso > 40% */}
        {realProgress.progress_percent && realProgress.progress_percent >= 40 && data?.slides_structure && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Estrutura Gerada
              </h3>
              <span className="text-xs text-gray-500">{data.slides_structure.length} slides</span>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {data.slides_structure.map((slide: any, idx: number) => (
                <div 
                  key={idx} 
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{slide.title || 'Título do Slide'}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {slide.content || 'Conteúdo será refinado...'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              ⏳ Aguarde enquanto refinamos os textos e finalizamos o sistema visual...
            </p>
          </div>
        )}
      </Card>
    );
  }
  
  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Aguardando dados...</p>
        </div>
      </Card>
    );
  }

  const currentSlide = editedData[currentSlideIndex] || { title: '', body: '', swipe_cta: '' };
  const totalSlides = editedData.length;
  
  const titleLength = currentSlide?.title?.length || 0;
  const bodyLength = currentSlide?.body?.length || 0;
  const titleValid = titleLength <= 50;
  const bodyValid = bodyLength <= 150;

  const handleNext = () => {
    const allValid = editedData.every((slide: any) => 
      (slide.title?.length || 0) <= 50 && 
      (slide.body?.length || 0) <= 150
    );

    if (!allValid) {
      alert('Alguns slides excedem o limite de caracteres. Por favor, ajuste antes de continuar.');
      return;
    }

    const adjustments: any = {};
    
    if (hasChanges) {
      Object.assign(adjustments, getAdjustments());
    }
    
    if (visualSystemChanged) {
      adjustments.visual_system = {
        primary_colors: editablePalette,
        visual_style: editableStyle,
        typography: editableTypography
      };
    }
    
    onNext(adjustments, {
      slides: editedData,
      visual_system: {
        primary_colors: editablePalette,
        visual_style: editableStyle,
        typography: editableTypography
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-2 py-2">
      {/* Layout em Grid: Editor (esquerda) + Preview (direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* EDITOR - 60% (3 colunas) */}
        <Card className="lg:col-span-3 p-3">
          {/* Header Compacto */}
          <div className="mb-2">
            <h2 className="text-base font-bold">
              Carrossel Gerado
              {hasChanges && <span className="ml-1 text-[10px] text-orange-600">(●)</span>}
            </h2>
            <p className="text-[10px] text-gray-500">
              Editando slide {currentSlideIndex + 1} de {totalSlides}
            </p>
          </div>

          {/* Sistema Visual - Ultra Compacto */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-2 rounded border border-purple-200 dark:border-purple-700 mb-2">
            <div className="flex items-center mb-1.5">
              <Palette className="h-3 w-3 mr-1 text-purple-600" />
              <h3 className="font-semibold text-[11px]">Sistema Visual (Todos os Slides)</h3>
              {visualSystemChanged && <span className="ml-1 text-orange-600 text-[10px]">●</span>}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Paleta de Cores */}
              <div>
                <label className="block text-[10px] font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Paleta
                </label>
                <div className="flex space-x-1">
                  {editablePalette.map((color, idx) => (
                    <Popover key={idx} open={showColorPicker === idx} onOpenChange={(open) => setShowColorPicker(open ? idx : null)}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full border border-gray-300 hover:border-blue-500 cursor-pointer hover:scale-110 transition-all"
                          style={{ backgroundColor: color }}
                          title={`${idx === 0 ? 'Primária' : idx === 1 ? 'Secundária' : 'Acento'}`}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="start">
                        <p className="text-[10px] font-semibold mb-1">
                          {idx === 0 ? 'Cor Primária' : idx === 1 ? 'Cor Secundária' : 'Cor de Acento'}
                        </p>
                        
                        <div className="mb-2">
                          <p className="text-[9px] text-gray-600 mb-1">Cores da marca:</p>
                          <div className="grid grid-cols-5 gap-1">
                            {userBrandColors.map((brandColor, bIdx) => (
                              <button
                                key={bIdx}
                                type="button"
                                onClick={() => {
                                  updatePalette(idx, brandColor);
                                  setShowColorPicker(null);
                                }}
                                className="w-full h-6 rounded border hover:border-blue-500 transition-all"
                                style={{ backgroundColor: brandColor }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => updatePalette(idx, e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const hex = e.target.value;
                              if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
                                updatePalette(idx, hex);
                              }
                            }}
                            className="flex-1 px-1 py-1 text-[10px] border rounded font-mono uppercase"
                            maxLength={7}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
              
              {/* Estilo Visual */}
              <div>
                <label className="block text-[10px] font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Estilo
                </label>
                <Select value={editableStyle} onValueChange={(value) => { setEditableStyle(value); setVisualSystemChanged(true); }}>
                  <SelectTrigger className="h-7 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStyles.length > 0 ? (
                      availableStyles.map(s => (
                        <SelectItem key={s.id} value={s.name} className="text-[11px]">
                          {s.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Minimalista profissional" className="text-[11px]">Minimalista</SelectItem>
                        <SelectItem value="Moderno e vibrante" className="text-[11px]">Moderno</SelectItem>
                        <SelectItem value="Elegante e sofisticado" className="text-[11px]">Elegante</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Tipografia */}
              <div>
                <label className="block text-[10px] font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Fonte
                </label>
                <Select value={editableTypography} onValueChange={(value) => { setEditableTypography(value); setVisualSystemChanged(true); }}>
                  <SelectTrigger className="h-7 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter" className="text-[11px]">Inter</SelectItem>
                    <SelectItem value="Poppins" className="text-[11px]">Poppins</SelectItem>
                    <SelectItem value="Montserrat" className="text-[11px]">Montserrat</SelectItem>
                    <SelectItem value="Roboto" className="text-[11px]">Roboto</SelectItem>
                    <SelectItem value="Playfair Display" className="text-[11px]">Playfair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Edição do Slide - Ultra Compacto */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-[10px]">
                  {currentSlideIndex + 1}
                </span>
                <h3 className="font-semibold text-[11px]">Slide {currentSlideIndex + 1}</h3>
              </div>
              <span className="text-[10px] text-gray-500">
                {currentSlideIndex + 1} / {totalSlides}
              </span>
            </div>

            <div className="space-y-2">
              {/* Estrutura Original do Slide */}
              {data?.slides_structure?.[currentSlideIndex] && (
                <div className="p-2 rounded-md border border-blue-200 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-900/20">
                  <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 mb-1">
                    Estrutura do Slide {currentSlideIndex + 1}
                  </p>
                  <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-100">
                    {data.slides_structure[currentSlideIndex].title || 'Título do slide'}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400">
                    {data.slides_structure[currentSlideIndex].content || 'Conteúdo da estrutura'}
                  </p>
                </div>
              )}
              {/* Título */}
              <div>
                <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  TÍTULO (máx. 50)
                  <span className={`ml-1 ${titleValid ? 'text-gray-500' : 'text-red-600'}`}>
                    {titleLength}/50
                  </span>
                </label>
                <input
                  type="text"
                  value={currentSlide?.title || ''}
                  onChange={(e) => updateField(currentSlideIndex, 'title', e.target.value)}
                  className={`w-full px-2 py-1.5 text-xs font-semibold border rounded outline-none transition-colors ${
                    titleValid ? 'border-gray-300 focus:border-blue-500' : 'border-red-500'
                  }`}
                  placeholder="Título do slide"
                  maxLength={50}
                />
              </div>

              {/* Corpo */}
              {currentSlide?.body !== undefined && (
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                    CORPO (máx. 150)
                    <span className={`ml-1 ${bodyValid ? 'text-gray-500' : 'text-red-600'}`}>
                      {bodyLength}/150
                    </span>
                  </label>
                  <textarea
                    value={currentSlide.body || ''}
                    onChange={(e) => updateField(currentSlideIndex, 'body', e.target.value)}
                    className={`w-full px-2 py-1.5 text-[11px] border rounded outline-none transition-colors resize-none ${
                      bodyValid ? 'border-gray-300 focus:border-blue-500' : 'border-red-500'
                    }`}
                    rows={2}
                    placeholder="Corpo do slide"
                    maxLength={150}
                  />
                </div>
              )}

              {/* CTA */}
              {currentSlide?.swipe_cta !== undefined && (
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                    CTA (opcional)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.swipe_cta || ''}
                    onChange={(e) => updateField(currentSlideIndex, 'swipe_cta', e.target.value)}
                    className="w-full px-2 py-1.5 text-[11px] border border-gray-300 rounded outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ex: Deslize →"
                  />
                </div>
              )}
            </div>

            {/* Navegação */}
            <div className="flex items-center justify-between mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="h-7 text-[10px] px-2"
              >
                ← Ant
              </Button>
              <span className="text-[10px] text-gray-500">
                {currentSlideIndex + 1}/{totalSlides}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSlideIndex(Math.min(totalSlides - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === totalSlides - 1}
                className="h-7 text-[10px] px-2"
              >
                Prox →
              </Button>
            </div>
          </div>

          {/* Botões de Ação - Ultra Compactos */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200">
            {hasChanges && (
              <Button variant="outline" size="sm" onClick={resetChanges} className="h-7 text-[10px] px-2">
                Reverter
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px]" onClick={onBack}>
              Voltar
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isLoading} className="h-7 text-[10px] px-2">
              🔄
            </Button>
            <Button 
              size="sm"
              onClick={handleNext} 
              disabled={isLoading || !titleValid || !bodyValid} 
              className="flex-1 h-7 text-[10px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Prompts'
              )}
            </Button>
          </div>
        </Card>

        {/* PREVIEW INSTAGRAM - 40% (2 colunas) */}
        <div className="lg:col-span-2">
          <div className="sticky top-2">
            <p className="text-[10px] text-center text-gray-500 mb-2">
              👁️ Preview em Tempo Real
            </p>
            {currentSlide && editedData.length > 0 ? (
              <InstagramPreview
                slide={currentSlide}
                visualSystem={{
                  primary_colors: editablePalette,
                  visual_style: editableStyle,
                  typography: editableTypography
                }}
                number={currentSlideIndex + 1}
                total={totalSlides}
                username={userProfile?.business_instagram_handle || 'seu_perfil'}
                className="w-full max-w-sm mx-auto"
              />
            ) : (
              <Card className="p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-sm">Carregando preview...</p>
              </Card>
            )}
            <p className="text-[10px] text-center text-gray-500 mt-2">
              💡 Atualiza instantaneamente. <strong>Sem custo!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Prompts
function StepPrompts({ data, onNext, onBack, isLoading }: any) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  
  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Aguardando prompts...</p>
        </div>
      </Card>
    );
  }

  const currentPrompt = data.image_prompts[currentPromptIndex];
  const totalPrompts = data.image_prompts.length;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Prompts de Imagem</h2>
      
      <div className="space-y-6">
        {/* Alerta destacado */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">ÚLTIMA CHANCE ANTES DE GASTAR CRÉDITOS</h3>
              <div className="space-y-1 text-sm">
                <p>Tempo estimado: <strong>{data.total_estimated_time}</strong></p>
                <p>Custo total: <strong>~{(totalPrompts * 0.23).toFixed(2)} créditos</strong> ({totalPrompts} imagens × 0.23)</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  As imagens serão geradas em paralelo (3 por vez). Você poderá acompanhar o progresso na próxima tela.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview do Prompt Atual */}
        <div className="border-2 rounded-lg p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white font-bold">
                {currentPromptIndex + 1}
              </span>
              <div>
                <p className="font-semibold text-lg">Prompt do Slide {currentPrompt?.sequence}</p>
                <p className="text-xs text-gray-500">Tempo estimado: {currentPrompt?.estimated_time}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {currentPromptIndex + 1} / {totalPrompts}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">PROMPT COMPLETO</p>
              <p className="text-sm whitespace-pre-wrap">{currentPrompt?.prompt}</p>
              <p className="text-xs text-gray-500 mt-2">{currentPrompt?.prompt?.length || 0} caracteres</p>
            </div>

            {currentPrompt?.visual_elements && currentPrompt.visual_elements.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">ELEMENTOS VISUAIS</p>
                <div className="flex flex-wrap gap-2">
                  {currentPrompt.visual_elements.map((element: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-xs">
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navegação entre prompts */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPromptIndex(Math.max(0, currentPromptIndex - 1))}
            disabled={currentPromptIndex === 0}
          >
            ← Anterior
          </Button>
          <span className="text-sm text-gray-500">
            Prompt {currentPromptIndex + 1} de {totalPrompts}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPromptIndex(Math.min(totalPrompts - 1, currentPromptIndex + 1))}
            disabled={currentPromptIndex === totalPrompts - 1}
          >
            Próximo →
          </Button>
        </div>

        {/* Dica informativa */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
          <p className="flex items-start">
            <span className="mr-2">💡</span>
            <span>Os prompts foram otimizados automaticamente para gerar imagens de alta qualidade. Na próxima versão você poderá editá-los.</span>
          </p>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext} disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando...
            </>
          ) : (
            '🚀 CONFIRMAR E GERAR IMAGENS'
          )}
        </Button>
      </div>
    </Card>
  );
}

// Main Wizard Component
export default function CarouselWizardPage() {
  const [currentStep, setCurrentStep] = useState(0); // ✅ Começar na Etapa 0 (Templates)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Estados para preservar dados do Step 1 ao voltar
  const [initialTheme, setInitialTheme] = useState('');
  const [initialSlideCount, setInitialSlideCount] = useState(7);
  const [initialVoiceTone, setInitialVoiceTone] = useState('Profissional'); // 🆕 Tom/Emoção
  const [selectedTemplate, setSelectedTemplate] = useState<CarouselTemplate | null>(null);
  
  // Estados para preservar ajustes e dados editados ao voltar
  const [savedStep2Adjustments, setSavedStep2Adjustments] = useState<any>(null);
  const [savedStep3EditedSlides, setSavedStep3EditedSlides] = useState<any>(null);

  // Função para voltar
  const handleGoBack = () => {
    if (currentStep > 0) { // ✅ Permitir voltar até a Etapa 0
      setCurrentStep(currentStep - 1);
    }
  };

  // Step 1: Initialize
  const initMutation = useMutation({
    mutationFn: async (data: { theme: string; slide_count: number; voice_tone: string }) => {
      // Salvar dados do formulário antes de enviar
      setInitialTheme(data.theme);
      setInitialSlideCount(data.slide_count);
      setInitialVoiceTone(data.voice_tone); // 🆕 Salvar tom escolhido
      
      const response = await api.post('/api/v1/carousel/generate/init/', data);
      return response.data;
    },
    onSuccess: (data: SessionData) => {
      setSessionId(data.session_id);
      setCurrentStep(2);
      // REMOVIDO: structureMutation.mutate(); - Agora gerenciado pelo useEffect
    },
  });

  // Step 2 UNIFICADO: Structure + Texts + Visual
  const [realProgress, setRealProgress] = useState({
    phase: '',
    phase_name: 'Iniciando...',
    progress_percent: 0
  });
  
  const structureMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/api/v1/carousel/generate/${sessionId}/structure/`,
        {}, // body vazio
        { timeout: 300000 } // 5 minutos (aumentado para evitar broken pipe)
      );
      
      return response.data;
    },
    gcTime: 300000, // 5 minutos de cache
    retry: 0,  // Não retentar automaticamente
    onSuccess: () => {
      setCurrentStep(2); // Avança para Step 2 (editor completo)
    },
  });
  
  // Polling de status para progresso real
  const statusQuery = useQuery({
    queryKey: ['carousel-generation-status', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await api.get(`/api/v1/carousel/generate/${sessionId}/status/`);
      return response.data;
    },
    enabled: structureMutation.isPending && !!sessionId,
    refetchInterval: 2000, // Poll a cada 2 segundos
    gcTime: 0, // Não fazer cache
    staleTime: 0 // Sempre buscar dados frescos
  });
  
  // useEffect para atualizar progresso quando statusQuery retornar dados
  useEffect(() => {
    if (statusQuery.data?.data?.progress_data) {
      console.log('📊 Progresso atualizado:', statusQuery.data.data.progress_data);
      setRealProgress(statusQuery.data.data.progress_data);
    }
  }, [statusQuery.data]);

  // Step 3: Prompts (antiga Step 4)
  const promptsMutation = useMutation({
    mutationFn: async (adjustments?: any) => {
      const response = await api.post(
        `/api/v1/carousel/generate/${sessionId}/image-prompts/`,
        { adjustments },
        { timeout: 180000 } // 3 minutos
      );
      return response.data;
    },
    gcTime: 300000, // 5 minutos de cache
    retry: 0,
    onSuccess: () => {
      setCurrentStep(3); // Avança para Step 3 (prompts)
    },
  });

  // Step 4: Finalize (antiga Step 5)
  const finalizeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/api/v1/carousel/generate/${sessionId}/finalize/`
      );
      return response.data;
    },
    onSuccess: () => {
      setCurrentStep(4); // Avança para Step 4 (loading de geração)
      navigate(`/carousel/generating/${sessionId}`);
    },
  });

  // Auto-trigger do Step 2 quando sessionId estiver disponível (MOVIDO PARA DEPOIS DAS MUTATIONS)
  useEffect(() => {
    console.log('🔍 useEffect Step 2 Check:', {
      currentStep,
      sessionId,
      hasData: !!structureMutation.data,
      isPending: structureMutation.isPending,
      isError: structureMutation.isError
    });
    
    if (currentStep === 2 && sessionId && !structureMutation.data && !structureMutation.isPending && !structureMutation.isError) {
      console.log('🚀 Auto-trigger Step 2 com sessionId:', sessionId);
      structureMutation.mutate();
    }
  }, [currentStep, sessionId, structureMutation.data, structureMutation.isPending, structureMutation.isError]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <StepsIndicator currentStep={currentStep} />
      </div>

      {currentStep === 0 && (
        <CarouselTemplateGallery
          onSelectTemplate={(template) => {
            setSelectedTemplate(template);
            setCurrentStep(1);
          }}
          onSkip={() => {
            setSelectedTemplate(null);
            setCurrentStep(1);
          }}
        />
      )}
      
      {currentStep === 1 && (
        <StepInit 
          onSubmit={initMutation.mutate} 
          isLoading={initMutation.isPending}
          initialTheme={initialTheme}
          initialSlideCount={initialSlideCount}
          initialVoiceTone={initialVoiceTone}
          selectedTemplate={selectedTemplate}
        />
      )}
      
      {currentStep === 2 && (
        <StepStructureAndTexts
          data={structureMutation.data?.data}
          savedAdjustments={savedStep2Adjustments}
          savedEditedSlides={savedStep3EditedSlides}
          isGenerating={structureMutation.isPending}
          realProgress={realProgress}
          onNext={(adjustments?: any, savedData?: any) => {
            // Salvar ajustes e dados editados
            setSavedStep2Adjustments(adjustments);
            setSavedStep3EditedSlides(savedData);
            
            // Avançar para prompts (antiga etapa 4, agora etapa 3)
            promptsMutation.mutate(adjustments);
          }}
          onBack={handleGoBack}
          onRegenerate={() => {
            structureMutation.reset();
            setRealProgress({ phase: '', phase_name: 'Iniciando...', progress_percent: 0 });
            structureMutation.mutate();
          }}
          isLoading={promptsMutation.isPending}
        />
      )}
      
      {/* Step 3: Prompts (antiga Step 4) */}
      {currentStep === 3 && (
        <StepPrompts
          data={promptsMutation.data?.data}
          onNext={() => finalizeMutation.mutate()}
          onBack={handleGoBack}
          isLoading={finalizeMutation.isPending}
        />
      )}
    </div>
  );
}

