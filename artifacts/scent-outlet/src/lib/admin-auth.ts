import { setAuthTokenGetter } from '@workspace/api-client-react';

const TOKEN_KEY = 'pb_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Attaches Authorization: Bearer <token> to every API request when an admin
// token is stored. Public endpoints simply ignore the header.
export function registerAdminAuth(): void {
  setAuthTokenGetter(() => getAdminToken());
}
