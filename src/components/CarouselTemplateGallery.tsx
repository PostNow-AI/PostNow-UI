// @ts-nocheck
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export interface CarouselTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  visualSystem: {
    primary_colors: [string, string, string];
    visual_style: string;
    typography: string;
  };
  tags: string[];
  recommended_for: string[];
}

export const CAROUSEL_TEMPLATES: CarouselTemplate[] = [
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    emoji: '🔥',
    description: 'Alto contraste e impacto visual para chamar atenção',
    visualSystem: {
      primary_colors: ['#DC2626', '#000000', '#FFFFFF'],
      visual_style: 'Bold Vibrante',
      typography: 'Anton'
    },
    tags: ['vibrante', 'vendas', 'urgência'],
    recommended_for: ['Promoções', 'Lançamentos', 'Motivação']
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    emoji: '💼',
    description: 'Profissional e confiável para negócios',
    visualSystem: {
      primary_colors: ['#1E3A8A', '#64748B', '#F8FAFC'],
      visual_style: 'Corporativo Profissional',
      typography: 'Inter'
    },
    tags: ['profissional', 'corporativo', 'b2b'],
    recommended_for: ['B2B', 'Empresas', 'Serviços']
  },
  {
    id: 'nature-green',
    name: 'Nature Green',
    emoji: '🌿',
    description: 'Fresco e sustentável com toques naturais',
    visualSystem: {
      primary_colors: ['#059669', '#D4AF37', '#F5F5DC'],
      visual_style: 'Minimalista Moderno',
      typography: 'Poppins'
    },
    tags: ['sustentável', 'natural', 'clean'],
    recommended_for: ['Sustentabilidade', 'Bem-estar', 'Orgânico']
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    emoji: '💎',
    description: 'Elegante e sofisticado para marcas premium',
    visualSystem: {
      primary_colors: ['#000000', '#D4AF37', '#FFFFFF'],
      visual_style: 'Elegante Sofisticado',
      typography: 'Playfair Display'
    },
    tags: ['luxo', 'premium', 'elegante'],
    recommended_for: ['Luxo', 'Premium', 'Exclusivo']
  },
  {
    id: 'tech-blue',
    name: 'Tech Blue',
    emoji: '🚀',
    description: 'Moderno e futurista para tech e inovação',
    visualSystem: {
      primary_colors: ['#0EA5E9', '#7C3AED', '#0F172A'],
      visual_style: 'Tech Futurista',
      typography: 'Roboto'
    },
    tags: ['tecnologia', 'inovação', 'moderno'],
    recommended_for: ['Tech', 'SaaS', 'Startup']
  },
  {
    id: 'creative-rainbow',
    name: 'Creative Rainbow',
    emoji: '🎨',
    description: 'Colorido e criativo para arte e design',
    visualSystem: {
      primary_colors: ['#F97316', '#8B5CF6', '#10B981'],
      visual_style: 'Criativo Artístico',
      typography: 'Bebas Neue'
    },
    tags: ['criativo', 'arte', 'colorido'],
    recommended_for: ['Arte', 'Design', 'Criatividade']
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    emoji: '🌸',
    description: 'Suave e delicado para beleza e bem-estar',
    visualSystem: {
      primary_colors: ['#FDF2F8', '#EC4899', '#D4AF37'],
      visual_style: 'Minimalista Moderno',
      typography: 'Poppins'
    },
    tags: ['suave', 'feminino', 'delicado'],
    recommended_for: ['Beleza', 'Bem-estar', 'Lifestyle']
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    emoji: '⚫',
    description: 'Escuro e moderno para tech e gaming',
    visualSystem: {
      primary_colors: ['#0F172A', '#64748B', '#0EA5E9'],
      visual_style: 'Tech Futurista',
      typography: 'Roboto'
    },
    tags: ['dark', 'gaming', 'tech'],
    recommended_for: ['Apps', 'Gaming', 'Tech']
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    emoji: '🧡',
    description: 'Energético e motivador para fitness e ação',
    visualSystem: {
      primary_colors: ['#F97316', '#FCD34D', '#FFFFFF'],
      visual_style: 'Bold Vibrante',
      typography: 'Inter'
    },
    tags: ['energia', 'fitness', 'ação'],
    recommended_for: ['Fitness', 'Energia', 'Motivação']
  },
  {
    id: 'academic',
    name: 'Academic',
    emoji: '📚',
    description: 'Sério e confiável para educação',
    visualSystem: {
      primary_colors: ['#1E3A8A', '#F5F5DC', '#8B4513'],
      visual_style: 'Corporativo Profissional',
      typography: 'Merriweather'
    },
    tags: ['educação', 'acadêmico', 'confiável'],
    recommended_for: ['Educação', 'Cursos', 'Livros']
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    emoji: '🍃',
    description: 'Suave e moderno com cores pastel',
    visualSystem: {
      primary_colors: ['#DBEAFE', '#FED7E2', '#FDE68A'],
      visual_style: 'Minimalista Moderno',
      typography: 'Poppins'
    },
    tags: ['pastel', 'suave', 'moderno'],
    recommended_for: ['Lifestyle', 'Moda', 'Casual']
  },
  {
    id: 'urban-grey',
    name: 'Urban Grey',
    emoji: '🏙️',
    description: 'Minimalista e urbano com tons de cinza',
    visualSystem: {
      primary_colors: ['#64748B', '#000000', '#FFFFFF'],
      visual_style: 'Minimalista Moderno',
      typography: 'Inter'
    },
    tags: ['minimalista', 'urbano', 'moderno'],
    recommended_for: ['Arquitetura', 'Design', 'Minimalismo']
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    emoji: '🌊',
    description: 'Fresco e tranquilo como o oceano',
    visualSystem: {
      primary_colors: ['#0EA5E9', '#06B6D4', '#FFFFFF'],
      visual_style: 'Minimalista Moderno',
      typography: 'Roboto'
    },
    tags: ['oceano', 'viagem', 'tranquilo'],
    recommended_for: ['Viagem', 'Praia', 'Turismo']
  },
  {
    id: 'wine-dine',
    name: 'Wine & Dine',
    emoji: '🍷',
    description: 'Sofisticado e elegante para gastronomia',
    visualSystem: {
      primary_colors: ['#7F1D1D', '#D4AF37', '#FFF5E6'],
      visual_style: 'Elegante Sofisticado',
      typography: 'Playfair Display'
    },
    tags: ['gastronomia', 'elegante', 'sofisticado'],
    recommended_for: ['Gastronomia', 'Restaurantes', 'Vinhos']
  },
  {
    id: 'retro-pop',
    name: 'Retro Pop',
    emoji: '🎪',
    description: 'Vibrante e nostálgico no estilo vintage',
    visualSystem: {
      primary_colors: ['#FBBF24', '#EC4899', '#06B6D4'],
      visual_style: 'Criativo Artístico',
      typography: 'Bebas Neue'
    },
    tags: ['retro', 'vintage', 'nostálgico'],
    recommended_for: ['Nostalgia', 'Vintage', 'Retrô']
  }
];

interface CarouselTemplateGalleryProps {
  onSelectTemplate: (template: CarouselTemplate) => void;
  onSkip: () => void;
}

export function CarouselTemplateGallery({ onSelectTemplate, onSkip }: CarouselTemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Extrair todas as tags únicas
  const allTags = Array.from(new Set(CAROUSEL_TEMPLATES.flatMap(t => t.tags)));

  // Filtrar templates
  const filteredTemplates = filterTag
    ? CAROUSEL_TEMPLATES.filter(t => t.tags.includes(filterTag))
    : CAROUSEL_TEMPLATES;

  const handleSelectTemplate = (template: CarouselTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha um Template</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Acelere a criação do seu carrossel usando um template profissional
        </p>
      </div>

      {/* Filtros por tag */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={filterTag === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterTag(null)}
        >
          Todos ({CAROUSEL_TEMPLATES.length})
        </Button>
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={filterTag === tag ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Grid de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`
              relative p-4 rounded-lg border-2 text-left transition-all
              hover:shadow-lg hover:scale-105
              ${selectedTemplate === template.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-300'
              }
            `}
          >
            {/* Badge de selecionado */}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}

            {/* Preview das cores */}
            <div className="flex items-center mb-3">
              <div className="flex space-x-1 mr-3">
                {template.visualSystem.primary_colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-2xl">{template.emoji}</span>
            </div>

            {/* Nome e descrição */}
            <h3 className="font-bold text-lg mb-1">{template.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {template.description}
            </p>

            {/* Tags e recomendações */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {template.recommended_for.slice(0, 2).map(rec => (
                  <Badge key={rec} variant="secondary" className="text-xs">
                    {rec}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {template.visualSystem.visual_style} • {template.visualSystem.typography}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Ações */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          Pular (criar do zero)
        </Button>
        <Button
          onClick={() => selectedTemplate && handleSelectTemplate(
            CAROUSEL_TEMPLATES.find(t => t.id === selectedTemplate)!
          )}
          disabled={!selectedTemplate}
          className="flex-1"
        >
          Usar Template Selecionado
        </Button>
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-center text-gray-500">
        💡 <strong>Dica:</strong> Templates são apenas pontos de partida. Você poderá personalizar tudo depois!
      </div>
    </Card>
  );
}

