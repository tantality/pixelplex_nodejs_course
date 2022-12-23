import jwt from 'jsonwebtoken';

export interface IToken {
  userId: number;
  refreshToken: string;
}

export type JWTPayload = { userId: number; role: string };
export type VerifiedJWTPayload = jwt.JwtPayload & JWTPayload;
