import { api } from "@/lib/api";
import { authRequest } from "@/lib/auth-helpers";
import type {
  MagicLinkValidateRequest,
  MagicLinkValidateResponse,
} from "../types";

export const magicLinkService = {
  validate: (data: MagicLinkValidateRequest) =>
    authRequest(
      () =>
        api.post<MagicLinkValidateResponse>(
          "/api/v1/auth/magic-link/validate/",
          data
        ),
      "Token inválido ou expirado"
    ),
};
