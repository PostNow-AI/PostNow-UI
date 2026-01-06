import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const formSchema = z.object({
  theme: z.string()
    .min(10, 'Tema deve ter pelo menos 10 caracteres')
    .max(500, 'Tema deve ter no máximo 500 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

export default function CarouselManualFormPage() {
  const navigate = useNavigate();
  const [generationProgress, setGenerationProgress] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      setGenerationProgress('Iniciando geração...');
      const response = await api.post('/carousel/generate/', data);
      return response.data;
    },
    onSuccess: (response) => {
      const carouselData = response.data;
      toast.success('Carrossel gerado com sucesso!');
      navigate(`/carousel/${carouselData.id}`);
    },
    onError: (error: any) => {
      console.error('Erro ao gerar carrossel:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao gerar carrossel';
      toast.error(errorMessage);
      setGenerationProgress('');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Criar Carrossel - Input Manual</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Digite um tema e a IA criará um carrossel completo de 7 slides para você
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tema do Carrossel</CardTitle>
          <CardDescription>
            Descreva sobre o que você quer que seja o carrossel. Quanto mais específico, melhor será o resultado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Exemplo: 7 dicas para aumentar produtividade no trabalho remoto"
                        rows={5}
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Mínimo 10 caracteres. Seja específico sobre o que deseja criar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mutation.isPending && (
                <Alert>
                  <Loader className="h-4 w-4" />
                  <AlertDescription>
                    {generationProgress || 'Gerando carrossel... Isso pode levar até 60 segundos.'}
                  </AlertDescription>
                </Alert>
              )}

              {mutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {mutation.error?.response?.data?.message || 'Ocorreu um erro ao gerar o carrossel'}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/carousel/create')}
                  disabled={mutation.isPending}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending || !form.formState.isValid}
                  className="flex-1"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Carrossel'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Dicas para melhores resultados:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Seja específico sobre o nicho ou público-alvo</li>
          <li>Mencione o formato desejado (dicas, passos, checklist, etc.)</li>
          <li>Indique o número de itens se relevante (ex: "5 dicas", "7 passos")</li>
          <li>A IA usará automaticamente o estilo visual e tom de voz do seu perfil</li>
        </ul>
      </div>
    </div>
  );
}

