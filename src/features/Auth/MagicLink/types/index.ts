export interface MagicLinkValidateRequest {
  token: string;
}

export interface MagicLinkValidateResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export type MagicLinkStatus =
  | "idle"
  | "validating"
  | "authenticated"
  | "invalid"
  | "expired"
  | "error";
