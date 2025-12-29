/**
 * Step de configuração de duração da campanha.
 * Component < 100 linhas (só UI), seguindo React Rules.
 */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
  Badge,
} from "@/components/ui";
import { Calendar, TrendingUp } from "lucide-react";
import type { CampaignStructure } from "../../types";

interface DurationStepProps {
  structure: CampaignStructure;
  onConfirm: (days: number, posts: number) => void;
  onBack: () => void;
}

// Sugestões por estrutura (do constants.py backend)
const DURATION_SUGGESTIONS: Record<CampaignStructure, { days: number; posts: number }> = {
  aida: { days: 12, posts: 8 },
  pas: { days: 8, posts: 6 },
  funil: { days: 18, posts: 12 },
  bab: { days: 10, posts: 8 },
  storytelling: { days: 16, posts: 12 },
  simple: { days: 14, posts: 6 },
};

export const DurationStep = ({ structure, onConfirm, onBack }: DurationStepProps) => {
  const suggestion = DURATION_SUGGESTIONS[structure] || { days: 14, posts: 8 };
  
  const [days, setDays] = useState(suggestion.days);
  const [posts, setPosts] = useState(suggestion.posts);

  // Atualizar sugestão quando estrutura muda
  useEffect(() => {
    setDays(suggestion.days);
    setPosts(suggestion.posts);
  }, [structure]);

  // Calcular posts baseado em dias e frequência
  const postsPerWeek = Math.round((posts / days) * 7);

  const handleDaysChange = (value: number) => {
    setDays(value);
    // Recalcular posts mantendo frequência
    const newPosts = Math.round((value / 7) * postsPerWeek);
    setPosts(Math.max(4, Math.min(20, newPosts))); // Entre 4 e 20
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Duração da Campanha
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="duration">Duração (dias)</Label>
              <Badge variant="outline">{days} dias</Badge>
            </div>
            
            <Input
              id="duration"
              type="range"
              min="7"
              max="30"
              value={days}
              onChange={(e) => handleDaysChange(parseInt(e.target.value))}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>7 dias</span>
              <span>30 dias</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Quantidade de Posts</Label>
              <Badge>{posts} posts</Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>~{postsPerWeek} posts por semana</span>
            </div>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm">
                💡 Para <strong>{structure.toUpperCase()}</strong>, sugerimos{" "}
                <strong>{suggestion.days} dias</strong> com{" "}
                <strong>{suggestion.posts} posts</strong>.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Você pode ajustar conforme sua necessidade.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          ← Voltar
        </Button>
        <Button onClick={() => onConfirm(days, posts)}>
          Continuar →
        </Button>
      </div>
    </div>
  );
};

