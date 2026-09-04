export type UserRole = 'ADMIN' | 'MERCHANT' | 'CUSTOMER';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  merchantId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
  tokenType: 'Bearer';
}

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  merchantId?: string;
  name?: string;
}
