/* eslint-disable import/no-named-as-default-member */
import jwt from 'jsonwebtoken';
import { FindOptionsWhere } from 'typeorm';
import { ACCESS_TOKEN_LIFETIME_IN_MS, REFRESH_TOKEN_LIFETIME_IN_MS } from './auth.constants';
import { Token } from './token.entity';
import { TokensRepository } from './tokens.repository';
import { IAuth, JWTPayload, RefreshTokenWithUserId, VerifiedJWTPayload } from './types';

export class TokensService {
  static generateTokens = (payload: JWTPayload): Omit<IAuth, 'id'> => {
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

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Token>): Promise<Token | null> => {
    const token = await TokensRepository.findOneByCondition(whereCondition);
    return token;
  };

  static save = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    await TokensRepository.save(tokenData);
  };

  static update = async (tokenId: number, tokenData: RefreshTokenWithUserId): Promise<void> => {
    await TokensRepository.update(tokenId, tokenData);
  };

  static delete = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    await TokensRepository.delete(tokenData);
  };
}
