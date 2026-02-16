// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CarouselSlideViewDialog } from '@/features/Carousel/components/CarouselSlideViewDialog';
import { useState } from 'react';

interface CarouselSlide {
  id: number;
  sequence_order: number;
  title: string;
  content: string;
  image_url: string;
  image_description: string;
  has_arrow: boolean;
  has_numbering: boolean;
}

interface CarouselPost {
  id: number;
  post_name: string;
  slide_count: number;
  narrative_type: string;
  logo_placement: string;
  slides: CarouselSlide[];
  generation_source: {
    source_type: string;
    source_type_display: string;
    original_theme: string;
  };
  metrics: {
    generation_time: number;
    generation_source: string;
  };
  created_at: string;
  updated_at: string;
}

export default function CarouselViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSlide, setSelectedSlide] = useState<CarouselSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['carousel', id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/carousel/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });

  const carousel: CarouselPost | undefined = response?.data || response;

  const handleSlideClick = (slide: CarouselSlide) => {
    setSelectedSlide(slide);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSlide(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(7)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-64 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !carousel) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar carrossel. Tente novamente.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/carousel')} className="mt-4">
          Voltar para Carrosséis
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{carousel.post_name}</h1>
          <div className="flex gap-2 items-center flex-wrap">
            <Badge variant="secondary">
              {carousel.slide_count} slides
            </Badge>
            <Badge variant="outline">
              {carousel.generation_source?.source_type_display || 'Manual'}
            </Badge>
            {carousel.metrics && (
              <span className="text-sm text-gray-500">
                Gerado em {carousel.metrics.generation_time.toFixed(1)}s
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/carousel')}>
            ← Voltar
          </Button>
          <Button variant="outline" disabled>
            Editar
          </Button>
          <Button disabled>
            Publicar
          </Button>
        </div>
      </div>

      {carousel.generation_source?.original_theme && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Tema original:</strong> {carousel.generation_source.original_theme}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carousel.slides.map((slide) => (
          <Card 
            key={slide.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSlideClick(slide)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  Slide {slide.sequence_order}/{carousel.slide_count}
                </div>
                {slide.image_url ? (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                {slide.title && (
                  <h3 className="font-bold mb-2 text-lg">{slide.title}</h3>
                )}
                {slide.content && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {slide.content}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de visualização e edição de slide */}
      <CarouselSlideViewDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        slide={selectedSlide}
        totalSlides={carousel.slide_count}
      />
    </div>
  );
}

