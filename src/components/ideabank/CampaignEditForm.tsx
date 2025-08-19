import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCampaignEditForm } from "@/hooks/useCampaignEditForm";
import type { Campaign } from "@/lib/services/ideaBankService";
import { X } from "lucide-react";

interface CampaignEditFormProps {
  campaign: Campaign;
  onSave: (updatedCampaign: Partial<Campaign>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CampaignEditForm = ({
  campaign,
  onSave,
  onCancel,
  isLoading = false,
}: CampaignEditFormProps) => {
  const {
    formData,
    newObjective,
    newPlatform,
    voiceToneOptions,
    objectiveOptions,
    platformOptions,
    handleInputChange,
    addObjective,
    removeObjective,
    addPlatform,
    removePlatform,
    setNewObjective,
    setNewPlatform,
  } = useCampaignEditForm(campaign);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Helper function to get display names
  const getObjectiveDisplayName = (value: string) => {
    const displayNames: Record<string, string> = {
      sales: "Vendas",
      branding: "Branding",
      engagement: "Engajamento",
      awareness: "Awareness",
      conversion: "Conversão",
      leads: "Leads",
      retention: "Fidelização",
      education: "Educação",
      support: "Suporte",
      community: "Comunidade",
    };
    return displayNames[value] || value;
  };

  const getPlatformDisplayName = (value: string) => {
    const displayNames: Record<string, string> = {
      instagram: "Instagram",
      tiktok: "TikTok",
      youtube: "YouTube",
      linkedin: "LinkedIn",
      facebook: "Facebook",
      twitter: "Twitter",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    };
    return displayNames[value] || value;
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações Básicas</h3>

          <div className="space-y-2">
            <Label htmlFor="title">Título da Campanha *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ex: Campanha de Marketing Digital, Lançamento de Produto, Black Friday"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ex: Campanha focada em aumentar o engajamento nas redes sociais, com foco em conteúdo educativo..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice_tone">Tom de Voz</Label>
            <Select
              value={formData.voice_tone}
              onValueChange={(value) => handleInputChange("voice_tone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voiceToneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Objetivos e Plataformas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Objetivos e Plataformas</h3>

          <div className="space-y-2">
            <Label>Objetivos</Label>
            <Select
              value={newObjective}
              onValueChange={(value) => {
                setNewObjective(value);
                addObjective(value);
                setNewObjective("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar objetivo" />
              </SelectTrigger>
              <SelectContent>
                {objectiveOptions
                  .filter((obj) => !formData.objectives.includes(obj))
                  .map((objective) => (
                    <SelectItem key={objective} value={objective}>
                      {getObjectiveDisplayName(objective)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.objectives.map((objective, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {getObjectiveDisplayName(objective)}
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Plataformas</Label>
            <Select
              value={newPlatform}
              onValueChange={(value) => {
                setNewPlatform(value);
                addPlatform(value);
                setNewPlatform("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar plataforma" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions
                  .filter((platform) => !formData.platforms.includes(platform))
                  .map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {getPlatformDisplayName(platform)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.platforms.map((platform, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {getPlatformDisplayName(platform)}
                  <button
                    type="button"
                    onClick={() => removePlatform(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Produto e Proposta de Valor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Produto e Proposta de Valor</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product_description">
              Descrição do Produto/Serviço
            </Label>
            <Textarea
              id="product_description"
              value={formData.product_description}
              onChange={(e) =>
                handleInputChange("product_description", e.target.value)
              }
              placeholder="Ex: Software de gestão empresarial que automatiza processos, reduz custos e aumenta a produtividade da equipe..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value_proposition">Proposta de Valor</Label>
            <Textarea
              id="value_proposition"
              value={formData.value_proposition}
              onChange={(e) =>
                handleInputChange("value_proposition", e.target.value)
              }
              placeholder="Ex: Economia de 10 horas semanais em tarefas administrativas, ROI de 300% em 6 meses, suporte 24/7 incluído..."
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign_urgency">Urgência da Campanha</Label>
          <Textarea
            id="campaign_urgency"
            value={formData.campaign_urgency}
            onChange={(e) =>
              handleInputChange("campaign_urgency", e.target.value)
            }
            placeholder="Ex: Campanha sazonal para o Natal, lançamento urgente devido à concorrência, promoção por tempo limitado..."
            rows={2}
          />
        </div>
      </div>

      {/* Persona */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Persona do Público-Alvo</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="persona_age">Faixa Etária</Label>
            <Input
              id="persona_age"
              value={formData.persona_age}
              onChange={(e) => handleInputChange("persona_age", e.target.value)}
              placeholder="Ex: 25-35 anos, 18-24 anos, 40+ anos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona_location">Localização</Label>
            <Input
              id="persona_location"
              value={formData.persona_location}
              onChange={(e) =>
                handleInputChange("persona_location", e.target.value)
              }
              placeholder="Ex: São Paulo, SP, Brasil, América Latina"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona_income">Faixa de Renda</Label>
            <Input
              id="persona_income"
              value={formData.persona_income}
              onChange={(e) =>
                handleInputChange("persona_income", e.target.value)
              }
              placeholder="Ex: Classe A-B, R$ 5.000-10.000, Renda média"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="persona_interests">Interesses</Label>
          <Textarea
            id="persona_interests"
            value={formData.persona_interests}
            onChange={(e) =>
              handleInputChange("persona_interests", e.target.value)
            }
            placeholder="Ex: Tecnologia, fitness, viagens, gastronomia, sustentabilidade, empreendedorismo, educação online..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="persona_behavior">Comportamento</Label>
          <Textarea
            id="persona_behavior"
            value={formData.persona_behavior}
            onChange={(e) =>
              handleInputChange("persona_behavior", e.target.value)
            }
            placeholder="Ex: Ativos nas redes sociais, consomem conteúdo educativo, preferem vídeos curtos, gostam de interagir com marcas..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="persona_pain_points">Pontos de Dor</Label>
          <Textarea
            id="persona_pain_points"
            value={formData.persona_pain_points}
            onChange={(e) =>
              handleInputChange("persona_pain_points", e.target.value)
            }
            placeholder="Ex: Falta de tempo, dificuldade em organizar, busca por soluções rápidas, necessidade de aprendizado contínuo..."
            rows={2}
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Campanha"}
        </Button>
      </div>
    </form>
  );
};
