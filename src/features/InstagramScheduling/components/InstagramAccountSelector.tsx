/**
 * Instagram Account Selector Component
 *
 * Dropdown to select Instagram account for scheduling.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Instagram } from "lucide-react";
import type { InstagramAccountListItem } from "../types";

interface InstagramAccountSelectorProps {
  accounts: InstagramAccountListItem[];
  value: number | undefined;
  onChange: (accountId: number) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function InstagramAccountSelector({
  accounts,
  value,
  onChange,
  disabled,
  hasError,
}: InstagramAccountSelectorProps) {
  const selectedAccount = accounts.find((acc) => acc.id === value);

  const getStatusColor = (status: string, isValid: boolean) => {
    if (!isValid) return "destructive";
    if (status === "connected") return "default";
    return "secondary";
  };

  if (accounts.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Nenhuma conta Instagram conectada.
          <a href="/settings/instagram" className="ml-1 text-primary underline">
            Conectar agora
          </a>
        </span>
      </div>
    );
  }

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onChange(parseInt(val))}
      disabled={disabled}
    >
      <SelectTrigger
        className={hasError ? "border-destructive" : ""}
      >
        <SelectValue placeholder="Selecione uma conta">
          {selectedAccount && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedAccount.profile_picture_url ?? ""} />
                <AvatarFallback>
                  <Instagram className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>@{selectedAccount.instagram_username}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem
            key={account.id}
            value={account.id.toString()}
            disabled={!account.is_token_valid}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={account.profile_picture_url ?? ""} />
                <AvatarFallback>
                  <Instagram className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>@{account.instagram_username}</span>
                {account.instagram_name && (
                  <span className="text-xs text-muted-foreground">
                    {account.instagram_name}
                  </span>
                )}
              </div>
              {!account.is_token_valid && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  Token expirado
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
