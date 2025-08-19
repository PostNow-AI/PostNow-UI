import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JsonFieldRendererProps {
  path: string[];
  key: string;
  value: unknown;
  depth: number;
  readOnly: boolean;
  translateKey: (key: string) => string;
  translateValue: (key: string, value: unknown) => unknown;
  handleStringFieldChange: (path: string[], key: string, value: string) => void;
  handleArrayFieldChange: (path: string[], value: string) => void;
  handleFieldChange: (path: string[], value: string | string[]) => void;
}

export const JsonFieldRenderer = ({
  path,
  key,
  value,
  depth,
  readOnly,
  translateKey,
  translateValue,
  handleFieldChange,
  handleStringFieldChange,
  handleArrayFieldChange,
}: JsonFieldRendererProps) => {
  const indent = depth * 20;
  const translatedKey = translateKey(key);
  const isEmpty =
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (typeof value === "string") {
    const displayValue = translateValue(key, value) as string;
    const isLong = displayValue.length > 100;

    if (isLong) {
      return (
        <div key={path.join(".")} style={{ marginLeft: indent }}>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            {translatedKey}
            {isEmpty && (
              <Badge variant="outline" className="ml-2 text-xs">
                Vazio
              </Badge>
            )}
          </Label>
          <Textarea
            value={displayValue}
            onChange={(e) => handleStringFieldChange(path, key, e.target.value)}
            readOnly={readOnly}
            className="min-h-[100px]"
            placeholder={`Digite o valor para ${translatedKey}...`}
          />
        </div>
      );
    } else {
      return (
        <div key={path.join(".")} style={{ marginLeft: indent }}>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            {translatedKey}
            {isEmpty && (
              <Badge variant="outline" className="ml-2 text-xs">
                Vazio
              </Badge>
            )}
          </Label>
          <Input
            value={displayValue}
            onChange={(e) => handleStringFieldChange(path, key, e.target.value)}
            readOnly={readOnly}
            placeholder={`Digite o valor para ${translatedKey}...`}
          />
        </div>
      );
    }
  } else if (Array.isArray(value)) {
    return (
      <div key={path.join(".")} style={{ marginLeft: indent }}>
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
          {translatedKey}{" "}
          <Badge variant="secondary" className="ml-2">
            Lista
          </Badge>
          {isEmpty && (
            <Badge variant="outline" className="ml-2 text-xs">
              Vazio
            </Badge>
          )}
        </Label>
        <Textarea
          value={value.join("\n")}
          onChange={(e) => handleArrayFieldChange(path, e.target.value)}
          readOnly={readOnly}
          className="min-h-[80px]"
          placeholder={`Digite os valores para ${translatedKey}, um por linha...`}
        />
      </div>
    );
  } else if (typeof value === "object" && value !== null) {
    return (
      <div key={path.join(".")} style={{ marginLeft: indent }}>
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
          {translatedKey}{" "}
          <Badge variant="outline" className="ml-2">
            Ideia
          </Badge>
          {isEmpty && (
            <Badge variant="outline" className="ml-2 text-xs">
              Vazio
            </Badge>
          )}
        </Label>
        <div className="border-l-2 border-muted pl-4 space-y-4">
          {Object.entries(value as Record<string, unknown>).map(
            ([subKey, subValue]) => (
              <JsonFieldRenderer
                key={[...path, subKey].join(".")}
                path={[...path, subKey]}
                value={subValue}
                depth={depth + 1}
                readOnly={readOnly}
                translateKey={translateKey}
                translateValue={translateValue}
                handleFieldChange={handleFieldChange}
                handleStringFieldChange={handleStringFieldChange}
                handleArrayFieldChange={handleArrayFieldChange}
              />
            )
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div key={path.join(".")} style={{ marginLeft: indent }}>
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
          {translatedKey}
          {isEmpty && (
            <Badge variant="outline" className="ml-2 text-xs">
              Vazio
            </Badge>
          )}
        </Label>
        <Input
          value={String(value)}
          onChange={(e) => handleFieldChange(path, e.target.value)}
          readOnly={readOnly}
          placeholder={`Digite o valor para ${translatedKey}...`}
        />
      </div>
    );
  }
};
