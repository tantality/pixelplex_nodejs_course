import jwt from 'jsonwebtoken';

export type JWTPayload = { userId: number; role: string };
export type VerifiedJWTPayload = jwt.JwtPayload & JWTPayload;
