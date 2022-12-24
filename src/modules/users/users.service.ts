import { FindOptionsWhere } from 'typeorm';
import { BadRequestError, LANGUAGE_NOT_FOUND_MESSAGE, NotFoundError, USER_ALREADY_EXISTS_MESSAGE } from '../../errors';
import { LanguagesService } from '../languages/languages.service';
import { CreateUserData, UpdateUserBody } from './types';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

export class UsersService {
  static findOneByCondition = async (whereCondition: FindOptionsWhere<User>): Promise<User | null> => {
    const user = await UsersRepository.findOneByCondition(whereCondition);
    return user;
  };

  static create = async (userData: CreateUserData): Promise<User> => {
    const nativeLanguage = await LanguagesService.findOneByCondition({ id: userData.nativeLanguageId });
    if (!nativeLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const user = await UsersService.findOneByCondition({ normalizedEmail: userData.normalizedEmail });
    if (user) {
      throw new BadRequestError(USER_ALREADY_EXISTS_MESSAGE);
    }

    const createdUser = await UsersRepository.create(userData);

    return createdUser;
  };

  static update = async (userId: number, body: UpdateUserBody): Promise<User> => {
    const userToUpdate = await UsersService.findOneByCondition({ id: userId });

    const nativeLanguage = await LanguagesService.findOneByCondition({ id: body.nativeLanguageId });
    if (!nativeLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const updatedUser = await UsersRepository.update(userToUpdate as User, userId, body);

    return updatedUser;
  };
}
