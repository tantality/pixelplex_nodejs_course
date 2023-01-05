// eslint-disable-next-line import/default
import jwt from 'jsonwebtoken';

export interface IToken {
  id: number;
  userId: number;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshTokenWithUserId = Pick<IToken, 'userId' | 'refreshToken'>;

export type JWTPayload = { userId: number; role: string };
export type VerifiedJWTPayload = jwt.JwtPayload & JWTPayload;
