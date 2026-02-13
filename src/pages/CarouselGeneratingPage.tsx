// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusData {
  session_id: string;
  status: string;
  credits_consumed: number;
  theme: string;
  task_status?: string;
  progress?: {
    current: number;
    total: number;
    status: string;
  };
  carousel_id?: number;
  error?: string;
}

export default function CarouselGeneratingPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: statusData, isLoading } = useQuery<{ success: boolean; data: StatusData }>({
    queryKey: ['carousel-status', sessionId],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/carousel/generate/${sessionId}/status/`
      );
      return response.data;
    },
    refetchInterval: (data) => {
      // Parar polling quando completar ou falhar
      if (data?.data?.status === 'completed' || data?.data?.status === 'failed') {
        return false;
      }
      return 3000; // 3 segundos
    },
    retry: 3,
  });

  // Redirecionar quando completo
  if (statusData?.data?.status === 'completed' && statusData.data.carousel_id) {
    setTimeout(() => {
      navigate(`/carousel/${statusData.data.carousel_id}`);
    }, 2000);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center max-w-2xl mx-auto">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Carregando status...</p>
        </Card>
      </div>
    );
  }

  const status = statusData?.data;

  if (!status) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sessão não encontrada</h2>
          <Button onClick={() => navigate('/carousel')}>
            Voltar para Carrosséis
          </Button>
        </Card>
      </div>
    );
  }

  // Status: Failed
  if (status.status === 'failed') {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Erro na Geração</h2>
          <p className="text-gray-600 mb-4">
            {status.error || 'Ocorreu um erro ao gerar o carrossel.'}
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/carousel/wizard')} className="w-full">
              Tentar Novamente
            </Button>
            <Button
              onClick={() => navigate('/carousel')}
              variant="outline"
              className="w-full"
            >
              Voltar para Carrosséis
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Status: Completed
  if (status.status === 'completed') {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center max-w-2xl mx-auto">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Carrossel Completo!</h2>
          <p className="text-gray-600 mb-4">
            Seu carrossel foi gerado com sucesso.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Créditos consumidos: <strong>{status.credits_consumed.toFixed(2)}</strong>
          </p>
          <p className="text-xs text-gray-400">
            Redirecionando em 2 segundos...
          </p>
        </Card>
      </div>
    );
  }

  // Status: Generating
  const progressPercent = status.progress
    ? (status.progress.current / status.progress.total) * 100
    : 0;

  return (
    <div className="container mx-auto py-8">
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold mb-2">
            Gerando seu carrossel...
          </h1>
          <p className="text-gray-600 mb-6">
            {status.theme}
          </p>

          {status.progress && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${progressPercent}%` }}
                >
                  {progressPercent > 10 && `${Math.round(progressPercent)}%`}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {status.progress.current} de {status.progress.total} imagens geradas
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {status.progress.status}
              </p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-sm mb-2">Status da Geração:</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>Estado:</span>
                <span className="font-medium">
                  {status.status === 'generating_images' ? 'Gerando imagens' : status.status}
                </span>
              </div>
              {status.task_status && (
                <div className="flex items-center justify-between">
                  <span>Task Celery:</span>
                  <span className="font-medium">{status.task_status}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Créditos consumidos:</span>
                <span className="font-medium">{status.credits_consumed.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            <p>⏱️ Este processo pode levar alguns minutos.</p>
            <p className="mt-1">💡 Você pode fechar esta página e voltar depois.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

