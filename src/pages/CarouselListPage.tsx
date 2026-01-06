import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus } from 'lucide-react';

interface CarouselSlide {
  id: number;
  sequence_order: number;
  title: string;
  image_url: string;
}

interface CarouselListItem {
  id: number;
  post_name: string;
  slide_count: number;
  slides: CarouselSlide[];
  generation_source: {
    source_type_display: string;
  };
  created_at: string;
}

export default function CarouselListPage() {
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['carousels'],
    queryFn: async () => {
      const res = await api.get('/carousel/');
      return res.data;
    },
  });

  const carousels: CarouselListItem[] = response?.data || response || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar carrosséis. Tente novamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Carrosséis</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {carousels.length} {carousels.length === 1 ? 'carrossel criado' : 'carrosséis criados'}
          </p>
        </div>
        <Button onClick={() => navigate('/carousel/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Carrossel
        </Button>
      </div>

      {carousels.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mb-4 text-6xl">📸</div>
          <h3 className="text-xl font-semibold mb-2">
            Nenhum carrossel ainda
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Crie seu primeiro carrossel Instagram e deixe a IA fazer o trabalho pesado!
          </p>
          <Button onClick={() => navigate('/carousel/create')}>
            Criar Primeiro Carrossel
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carousels.map((carousel) => (
            <Card
              key={carousel.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(`/carousel/${carousel.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">
                    {carousel.post_name}
                  </CardTitle>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {carousel.slide_count} slides
                  </Badge>
                  {carousel.generation_source && (
                    <Badge variant="outline" className="text-xs">
                      {carousel.generation_source.source_type_display}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {carousel.slides && carousel.slides.length > 0 && (
                  <div className="grid grid-cols-3 gap-1">
                    {carousel.slides.slice(0, 3).map((slide) => (
                      <div
                        key={slide.id}
                        className="relative aspect-square overflow-hidden rounded"
                      >
                        {slide.image_url ? (
                          <img
                            src={slide.image_url}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              {slide.sequence_order}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 text-xs text-gray-500">
                  Criado em {new Date(carousel.created_at).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

