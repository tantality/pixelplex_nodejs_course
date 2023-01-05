import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { Token } from './token.entity';
import { RefreshTokenWithUserId } from './types';

export class TokensRepository {
  static findOneByCondition = async (whereCondition: FindOptionsWhere<Token>): Promise<Token | null> => {
    const token = await Token.findOneBy(whereCondition);
    return token;
  };

  static save = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    const createdToken = Token.create(tokenData as DeepPartial<Token>);
    await Token.save(createdToken);
  };

  static update = async (id: number, tokenData: RefreshTokenWithUserId): Promise<void> => {
    await Token.update({ id }, tokenData);
  };

  static delete = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    await Token.delete(tokenData);
  };
}
