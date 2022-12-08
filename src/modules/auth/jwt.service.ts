/* eslint-disable import/no-named-as-default-member */
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_LIFETIME_IN_MS, REFRESH_TOKEN_LIFETIME_IN_MS } from './auth.constants';
import { AuthDTO } from './auth.dto';
import { JWTPayload, VerifiedJWTPayload } from './types';

export class JWTService {
  static generateTokens = (payload: JWTPayload): Omit<AuthDTO, 'id'> => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: `${ACCESS_TOKEN_LIFETIME_IN_MS}ms` });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: `${REFRESH_TOKEN_LIFETIME_IN_MS}ms` });
    return { accessToken, refreshToken };
  };

  static validateAccessToken = (accessToken: string): VerifiedJWTPayload => {
    return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as VerifiedJWTPayload;
  };

  static validateRefreshToken = (accessToken: string): VerifiedJWTPayload => {
    return jwt.verify(accessToken, process.env.JWT_REFRESH_SECRET as string) as VerifiedJWTPayload;
  };
}
