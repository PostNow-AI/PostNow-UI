import { Button, Checkbox, Input, Label } from "@/components/ui";
import type { ProfileCompletionData } from "@/types/profile-completion";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface Step4ResourcesProps {
  register: UseFormRegister<ProfileCompletionData>;
  setValue: UseFormSetValue<ProfileCompletionData>;
  watch: UseFormWatch<ProfileCompletionData>;
  suggestions: any;
  toolsInput: string;
  setToolsInput: (value: string) => void;
  handleAddTool: () => void;
  handleRemoveTool: (tool: string) => void;
  handleToggleHour: (hour: string) => void;
}

export const Step4Resources = ({
  register,
  setValue,
  watch,
  suggestions,
  toolsInput,
  setToolsInput,
  handleAddTool,
  handleRemoveTool,
  handleToggleHour,
}: Step4ResourcesProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">🛠️ Recursos Disponíveis</h3>
        <p className="text-sm text-muted-foreground">
          Defina suas ferramentas e disponibilidade para um conteúdo mais
          realista
        </p>
        {suggestions?.preferred_hours?.length && (
          <div className="text-xs bg-green-100 text-green-800 p-2 rounded mt-2">
            ✨ Sugestões baseadas no seu perfil:{" "}
            {suggestions?.preferred_hours?.length || 0} horários recomendados
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has_designer"
            checked={watch("has_designer")}
            onCheckedChange={(checked: boolean) => {
              setValue("has_designer", !!checked);
            }}
          />
          <Label htmlFor="has_designer">
            Tenho acesso a designer ou ferramentas de design
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Ferramentas Atuais</Label>
          <div className="flex gap-2">
            <Input
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="Digite uma ferramenta"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTool();
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                handleAddTool();
              }}
            >
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
                  onClick={() => handleRemoveTool(tool)}
                  className="text-primary hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {suggestions?.tools && (
            <div className="flex flex-wrap gap-1">
              {suggestions.tools.slice(0, 8).map((tool: string) => (
                <button
                  key={tool}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tools_budget">
            Orçamento para Ferramentas (Opcional)
          </Label>
          <Input
            {...register("tools_budget")}
            placeholder="Ex: R$ 200-500/mês"
          />
        </div>

        <div className="space-y-2">
          <Label>Horários Preferenciais</Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              suggestions?.preferred_hours || [
                "06:00-08:00",
                "08:00-10:00",
                "10:00-12:00",
                "12:00-14:00",
                "14:00-16:00",
                "16:00-18:00",
                "18:00-20:00",
                "20:00-22:00",
              ]
            ).map((hour: string) => (
              <button
                key={hour}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleHour(hour);
                }}
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
          {!suggestions?.preferred_hours?.length && (
            <p className="text-xs text-muted-foreground">
              Horários padrão disponíveis (personalize conforme sua rotina)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
