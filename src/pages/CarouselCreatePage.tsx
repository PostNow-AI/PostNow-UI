
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function CarouselCreatePage() {
  const navigate = useNavigate();

  const origins = [
    {
      id: 'wizard',
      title: '🆕 Assistente Multi-Etapa',
      description: 'Novo fluxo interativo com preview e controle total',
      icon: '🧙',
      available: true,
      route: '/carousel/wizard',
      badge: 'Recomendado',
    },
    {
      id: 'manual',
      title: 'Input Manual (Antigo)',
      description: 'Geração direta sem preview',
      icon: '✏️',
      available: true,
      route: '/carousel/create/manual',
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {origins.map((origin) => (
          <Card 
            key={origin.id} 
            className={`transition-all relative ${
              origin.available 
                ? 'hover:shadow-lg cursor-pointer border-2' 
                : 'opacity-50'
            } ${origin.badge ? 'border-blue-500' : ''}`}
          >
            {origin.badge && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {origin.badge}
              </div>
            )}
            <CardHeader>
              <div className="text-4xl mb-2">{origin.icon}</div>
              <CardTitle>{origin.title}</CardTitle>
              <CardDescription>{origin.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => origin.route && navigate(origin.route)}
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

