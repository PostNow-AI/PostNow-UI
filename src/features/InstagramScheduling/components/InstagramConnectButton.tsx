/**
 * Instagram Connect Button Component
 *
 * Styled button with Instagram gradient to initiate OAuth connection.
 */

import { Button } from "@/components/ui/button";
import { Instagram, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstagramConnectButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function InstagramConnectButton({
  onClick,
  isLoading = false,
  disabled = false,
  className,
  size = "default",
}: InstagramConnectButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size={size}
      className={cn(
        "relative overflow-hidden font-semibold text-white",
        "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
        "hover:from-[#7232a1] hover:via-[#e41b1b] hover:to-[#de6b32]",
        "transition-all duration-300",
        "shadow-lg hover:shadow-xl",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Instagram className="h-5 w-5 mr-2" />
          Conectar Conta Instagram
        </>
      )}
    </Button>
  );
}
