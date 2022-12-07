/* eslint-disable import/no-named-as-default-member */
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_LIFETIME_IN_MS, REFRESH_TOKEN_LIFETIME_IN_MS } from './auth.constants';
import { AuthDTO } from './auth.dto';

export class TokenService {
  static generateTokens = (payload: { userId: number; role: string }): Omit<AuthDTO, 'id'> => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: ACCESS_TOKEN_LIFETIME_IN_MS });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_TOKEN_LIFETIME_IN_MS });
    return { accessToken, refreshToken };
  };
}
