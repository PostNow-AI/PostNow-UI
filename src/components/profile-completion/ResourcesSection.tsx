import { Button, Checkbox, Input, Label } from "@/components/ui";
import { type ProfileCompletionData } from "@/types/profile-completion";
import { type UseFormReturn } from "react-hook-form";

interface ResourcesSectionProps {
  form: UseFormReturn<ProfileCompletionData>;
  suggestions?: {
    tools: string[];
    preferred_hours: string[];
  };
  toolsInput: string;
  setToolsInput: (value: string) => void;
  onAddTool: () => void;
  onRemoveTool: (tool: string) => void;
  onToggleHour: (hour: string) => void;
}

export const ResourcesSection = ({
  form,
  suggestions,
  toolsInput,
  setToolsInput,
  onAddTool,
  onRemoveTool,
  onToggleHour,
}: ResourcesSectionProps) => {
  const { register, setValue, watch } = form;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="has_designer"
          checked={watch("has_designer")}
          onCheckedChange={(checked: boolean) =>
            setValue("has_designer", !!checked)
          }
        />
        <Label htmlFor="has_designer">Tenho um designer</Label>
      </div>

      <div className="space-y-2">
        <Label>Ferramentas Atuais</Label>
        <div className="flex gap-2">
          <Input
            value={toolsInput}
            onChange={(e) => setToolsInput(e.target.value)}
            placeholder="Adicionar ferramenta"
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), onAddTool())
            }
          />
          <Button type="button" onClick={onAddTool}>
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {watch("current_tools")?.map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
            >
              {tool}
              <button
                type="button"
                onClick={() => onRemoveTool(tool)}
                className="text-primary hover:text-primary/70"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {suggestions?.tools.slice(0, 8).map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => {
                const current = watch("current_tools") || [];
                if (!current.includes(tool)) {
                  setValue("current_tools", [...current, tool]);
                }
              }}
              className="px-2 py-1 text-xs rounded border border-border hover:border-primary transition-colors"
            >
              + {tool}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tools_budget">Orçamento para Ferramentas</Label>
        <Input {...register("tools_budget")} placeholder="Ex: R$ 200-500/mês" />
      </div>

      <div className="space-y-2">
        <Label>Horários Preferenciais</Label>
        <div className="grid grid-cols-2 gap-2">
          {suggestions?.preferred_hours.map((hour) => (
            <button
              key={hour}
              type="button"
              onClick={() => onToggleHour(hour)}
              className={`p-3 rounded-lg border text-sm transition-all ${
                watch("preferred_hours")?.includes(hour)
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {hour}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
