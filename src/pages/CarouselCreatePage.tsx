import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CarouselCreatePage() {
  const navigate = useNavigate();

  const origins = [
    {
      id: 'manual',
      title: 'Input Manual',
      description: 'Digite o tema e deixe a IA criar',
      icon: '✏️',
      available: true,
    },
    {
      id: 'from_post',
      title: 'Expandir Post Diário',
      description: 'Transforme um post em carrossel',
      icon: '📄',
      available: false, // Sprint 2
    },
    {
      id: 'opportunity',
      title: 'Oportunidade',
      description: 'Use tendências e datas comemorativas',
      icon: '🎯',
      available: false, // Sprint 3
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Criar Carrossel</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Escolha como você quer criar seu carrossel Instagram
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {origins.map((origin) => (
          <Card 
            key={origin.id} 
            className={`transition-all ${
              origin.available 
                ? 'hover:shadow-lg cursor-pointer' 
                : 'opacity-50'
            }`}
          >
            <CardHeader>
              <div className="text-4xl mb-2">{origin.icon}</div>
              <CardTitle>{origin.title}</CardTitle>
              <CardDescription>{origin.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate(`/carousel/create/${origin.id}`)}
                disabled={!origin.available}
                className="w-full"
                variant={origin.available ? 'default' : 'secondary'}
              >
                {origin.available ? 'Selecionar' : 'Em breve'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/carousel')}
        >
          ← Voltar para Carrosséis
        </Button>
      </div>
    </div>
  );
}

