// @ts-nocheck - Legacy file pending TypeScript migration
/**
 * Step de Briefing do wizard de criação.
 */

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { MessageSquare, FileText, Sparkles } from "lucide-react";
import type { BriefingFormData } from "../../constants";
import { useBriefingForm } from "../../hooks/useBriefingForm";

interface BriefingStepProps {
  form: UseFormReturn<BriefingFormData>;
  onComplete: (data: BriefingFormData) => void;
  onCancel: () => void;
}

export const BriefingStep = ({ form, onComplete, onCancel }: BriefingStepProps) => {
  const hasCases = form.watch("has_cases");
  const hasMaterials = form.watch("has_materials");
  
  // Hook com lógica de sugestões (separado do UI)
  const { suggestedObjective, suggestedMessage } = useBriefingForm();
  
  // Pre-preencher campos na primeira renderização
  useEffect(() => {
    if (suggestedObjective && !form.getValues("objective")) {
      form.setValue("objective", suggestedObjective);
    }
    if (suggestedMessage && !form.getValues("main_message")) {
      form.setValue("main_message", suggestedMessage);
    }
  }, [suggestedObjective, suggestedMessage]);

  const handleSubmit = (data: BriefingFormData) => {
    onComplete(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Objetivo da Campanha
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>
                      Qual o objetivo específico desta campanha?
                    </FormLabel>
                    {suggestedObjective && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          // Regenerar sugestão
                          form.setValue("objective", "");
                          window.location.reload(); // Força novo fetch de sugestão
                        }}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Sugestão IA - Gerar outra
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Posicionar minha empresa como autoridade em [nicho], educando o público sobre..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    💡 Sugestão baseada no seu perfil. Pode editar livremente!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="main_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem Principal (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Transformação digital não é só tecnologia, é estratégia"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Qual a principal mensagem que quer comunicar?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Materiais Disponíveis
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="has_cases"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tem cases ou depoimentos?</FormLabel>
                    <FormDescription>
                      Casos de sucesso tornam a campanha mais persuasiva
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {hasCases && (
              <FormField
                control={form.control}
                name="cases_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descreva 1-2 casos principais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Cliente X economizou R$ 120k em 2024 com nossa consultoria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="has_materials"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tem fotos/vídeos próprios?</FormLabel>
                    <FormDescription>
                      Materiais próprios tornam a campanha mais autêntica
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {hasMaterials && (
              <FormField
                control={form.control}
                name="materials_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Que tipo de material você tem?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Fotos do consultório, vídeos de atendimentos"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-8 border-t mt-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Continuar →
          </Button>
        </div>
      </form>
    </Form>
  );
};

