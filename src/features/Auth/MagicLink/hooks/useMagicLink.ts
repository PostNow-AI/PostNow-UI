import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { magicLinkService } from "../services";
import type { MagicLinkStatus } from "../types";

export function useMagicLink() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<MagicLinkStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const hasAttempted = useRef(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token || hasAttempted.current) return;
    hasAttempted.current = true;

    const validate = async () => {
      setStatus("validating");

      try {
        // authRequest in service already handles setTokens + dispatchAuthStateChange
        await magicLinkService.validate({ token });

        // Remove token from URL (security: prevent token leakage in browser history)
        const cleanParams = new URLSearchParams(searchParams);
        cleanParams.delete("token");
        setSearchParams(cleanParams, { replace: true });

        setStatus("authenticated");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao validar token";

        if (message.toLowerCase().includes("expirado") && !message.toLowerCase().includes("inválido")) {
          setStatus("expired");
        } else if (message.toLowerCase().includes("inválido")) {
          setStatus("invalid");
        } else {
          setStatus("error");
        }
        setError(message);
      }
    };

    validate();
  }, [token, searchParams, setSearchParams]);

  return { status, error, hasToken: !!token };
}
