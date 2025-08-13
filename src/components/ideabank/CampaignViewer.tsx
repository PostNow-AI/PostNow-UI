import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Edit,
  Eye,
  Hash,
  Lightbulb,
  Play,
  Save,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";

interface CampaignVariation {
  headline: string;
  copy: string;
  cta: string;
  hashtags: string[];
  visual_description: string;
  color_composition: string;
}

interface CampaignData {
  plataforma: string;
  tipo_conteudo: string;
  titulo_principal: string;
  variacao_a: CampaignVariation;
  variacao_b: CampaignVariation;
  variacao_c: CampaignVariation;
  estrategia_implementacao: string;
  metricas_sucesso: string[];
  proximos_passos: string[];
}

interface CampaignViewerProps {
  campaign: CampaignData;
  onSave?: (campaign: CampaignData) => void;
  onEdit?: (campaign: CampaignData) => void;
  onDelete?: (campaign: CampaignData) => void;
  isEditing?: boolean;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "youtube":
      return <Video className="h-5 w-5 text-red-600" />;
    case "instagram":
      return <Target className="h-5 w-5 text-pink-600" />;
    case "tiktok":
      return <Play className="h-5 w-5 text-black" />;
    case "linkedin":
      return <Users className="h-5 w-5 text-blue-600" />;
    default:
      return <Target className="h-5 w-5" />;
  }
};

const getPlatformLabel = (platform: string) => {
  const labels: Record<string, string> = {
    youtube: "YouTube",
    instagram: "Instagram",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
  };
  return labels[platform.toLowerCase()] || platform;
};

const getContentTypeLabel = (contentType: string) => {
  const labels: Record<string, string> = {
    video: "Vídeo",
    post: "Post",
    story: "Story",
    reel: "Reel",
    carousel: "Carrossel",
    live: "Live",
  };
  return labels[contentType.toLowerCase()] || contentType;
};

export const CampaignViewer = ({
  campaign,
  onSave,
  onEdit,
  onDelete,
  isEditing = false,
}: CampaignViewerProps) => {
  const [editingCampaign, setEditingCampaign] =
    useState<CampaignData>(campaign);
  const [editingVariation, setEditingVariation] = useState<string>("a");
  const [showVariationEditor, setShowVariationEditor] = useState(false);
  const [editorHeight, setEditorHeight] = useState(300);

  const handleSave = () => {
    if (onSave) {
      onSave(editingCampaign);
    }
  };

  const handleVariationChange = (
    variationKey: string,
    field: keyof CampaignVariation,
    value: any
  ) => {
    setEditingCampaign((prev) => ({
      ...prev,
      [`variacao_${variationKey}`]: {
        ...(prev[
          `variacao_${variationKey}` as keyof CampaignData
        ] as CampaignVariation),
        [field]: value,
      },
    }));
  };

  const handleCopyAllVariations = () => {
    const baseVariation = editingCampaign.variacao_a;
    setEditingCampaign((prev) => ({
      ...prev,
      variacao_b: { ...baseVariation },
      variacao_c: { ...baseVariation },
    }));
  };

  const variations = [
    { key: "a", label: "Variação A", data: editingCampaign.variacao_a },
    { key: "b", label: "Variação B", data: editingCampaign.variacao_b },
    { key: "c", label: "Variação C", data: editingCampaign.variacao_c },
  ];

  if (isEditing) {
    return (
      <div className="space-y-6">
        {/* Header da Campanha */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              {getPlatformIcon(editingCampaign.plataforma)}
              <div className="flex-1">
                <CardTitle className="text-2xl text-primary">
                  {editingCampaign.titulo_principal}
                </CardTitle>
                <CardDescription className="text-lg">
                  Campanha para {getPlatformLabel(editingCampaign.plataforma)} -{" "}
                  {getContentTypeLabel(editingCampaign.tipo_conteudo)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {getPlatformLabel(editingCampaign.plataforma)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {getContentTypeLabel(editingCampaign.tipo_conteudo)}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Controles de Edição */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Controles de Edição
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleCopyAllVariations} variant="outline">
                Copiar Variação A para B e C
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Campanha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Variações A/B/C */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {variations.map(({ key, label, data }) => (
            <Card
              key={key}
              className="border-2 hover:border-primary/30 transition-colors"
            >
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    {key.toUpperCase()}
                  </Badge>
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Headline */}
                <div>
                  <label className="font-semibold text-sm text-muted-foreground mb-1 block">
                    Headline
                  </label>
                  <Textarea
                    value={data.headline}
                    onChange={(e) =>
                      handleVariationChange(key, "headline", e.target.value)
                    }
                    placeholder="Digite o headline..."
                    className="min-h-[60px]"
                  />
                </div>

                {/* Copy */}
                <div>
                  <label className="font-semibold text-sm text-muted-foreground mb-1 block">
                    Copy
                  </label>
                  <Textarea
                    value={data.copy}
                    onChange={(e) =>
                      handleVariationChange(key, "copy", e.target.value)
                    }
                    placeholder="Digite o copy..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* CTA */}
                <div>
                  <label className="font-semibold text-sm text-muted-foreground mb-1 block">
                    Call-to-Action
                  </label>
                  <Textarea
                    value={data.cta}
                    onChange={(e) =>
                      handleVariationChange(key, "cta", e.target.value)
                    }
                    placeholder="Digite o CTA..."
                    className="min-h-[60px]"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="font-semibold text-sm text-muted-foreground mb-2 block flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Hashtags
                  </label>
                  <Textarea
                    value={data.hashtags.join(", ")}
                    onChange={(e) =>
                      handleVariationChange(
                        key,
                        "hashtags",
                        e.target.value.split(", ").filter((tag) => tag.trim())
                      )
                    }
                    placeholder="Digite as hashtags separadas por vírgula..."
                    className="min-h-[60px]"
                  />
                </div>

                {/* Descrição Visual */}
                <div>
                  <label className="font-semibold text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Descrição Visual
                  </label>
                  <Textarea
                    value={data.visual_description}
                    onChange={(e) =>
                      handleVariationChange(
                        key,
                        "visual_description",
                        e.target.value
                      )
                    }
                    placeholder="Digite a descrição visual..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Composição de Cores */}
                <div>
                  <label className="font-semibold text-sm text-muted-foreground mb-1 block">
                    Composição de Cores
                  </label>
                  <Textarea
                    value={data.color_composition}
                    onChange={(e) =>
                      handleVariationChange(
                        key,
                        "color_composition",
                        e.target.value
                      )
                    }
                    placeholder="Digite a composição de cores..."
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estratégia e Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estratégia de Implementação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Estratégia de Implementação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editingCampaign.estrategia_implementacao}
                onChange={(e) =>
                  setEditingCampaign((prev) => ({
                    ...prev,
                    estrategia_implementacao: e.target.value,
                  }))
                }
                placeholder="Digite a estratégia..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Métricas de Sucesso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Métricas de Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editingCampaign.metricas_sucesso.join("\n")}
                onChange={(e) =>
                  setEditingCampaign((prev) => ({
                    ...prev,
                    metricas_sucesso: e.target.value
                      .split("\n")
                      .filter((item) => item.trim()),
                  }))
                }
                placeholder="Digite as métricas, uma por linha..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Próximos Passos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editingCampaign.proximos_passos.join("\n")}
              onChange={(e) =>
                setEditingCampaign((prev) => ({
                  ...prev,
                  proximos_passos: e.target.value
                    .split("\n")
                    .filter((item) => item.trim()),
                }))
              }
              placeholder="Digite os próximos passos, um por linha..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Modo de visualização
  return (
    <div className="space-y-6">
      {/* Header da Campanha */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            {getPlatformIcon(campaign.plataforma)}
            <div className="flex-1">
              <CardTitle className="text-2xl text-primary">
                {campaign.titulo_principal}
              </CardTitle>
              <CardDescription className="text-lg">
                Campanha para {getPlatformLabel(campaign.plataforma)} -{" "}
                {getContentTypeLabel(campaign.tipo_conteudo)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {getPlatformLabel(campaign.plataforma)}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {getContentTypeLabel(campaign.tipo_conteudo)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controles de Ação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Ações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {onEdit && (
              <Button onClick={() => onEdit(campaign)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Campanha
              </Button>
            )}
            {onDelete && (
              <Button onClick={() => onDelete(campaign)} variant="destructive">
                Excluir Campanha
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Variações A/B/C */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {variations.map(({ key, label, data }) => (
          <Card
            key={key}
            className="border-2 hover:border-primary/30 transition-colors"
          >
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="default" className="text-xs">
                  {key.toUpperCase()}
                </Badge>
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Headline */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Headline
                </h4>
                <p className="text-sm font-medium leading-relaxed">
                  {data.headline}
                </p>
              </div>

              {/* Copy */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Copy
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {data.copy}
                </p>
              </div>

              {/* CTA */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Call-to-Action
                </h4>
                <p className="text-sm font-medium text-primary">{data.cta}</p>
              </div>

              {/* Hashtags */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Hashtags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {data.hashtags.map((hashtag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Descrição Visual */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Descrição Visual
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {data.visual_description}
                </p>
              </div>

              {/* Composição de Cores */}
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Composição de Cores
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {data.color_composition}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estratégia e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estratégia de Implementação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Estratégia de Implementação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {campaign.estrategia_implementacao}
            </p>
          </CardContent>
        </Card>

        {/* Métricas de Sucesso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Métricas de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {campaign.metricas_sucesso.map((metrica, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {metrica}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {campaign.proximos_passos.map((passo, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {index + 1}
                </Badge>
                <span className="leading-relaxed text-muted-foreground">
                  {passo}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
