export interface User {
  id: string;
  email?: string;
  created_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

export interface AuthError {
  message: string;
  status?: number;
}
