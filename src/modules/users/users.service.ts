import { FindOptionsWhere } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../errors';
import { LanguagesService } from '../languages/languages.service';
import { CreateUserData, UpdateUserBody, UpdateUserData } from './types';
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
      throw new NotFoundError('Language not found.');
    }

    const user = await UsersService.findOneByCondition({ normalizedEmail: userData.normalizedEmail });
    if (user) {
      throw new BadRequestError('The user with the specified email already exists.');
    }

    const createdUser = await UsersRepository.create(userData);

    return createdUser;
  };

  static update = async (userId: number, userData: UpdateUserData): Promise<User> => {
    const updatableUser = await UsersService.findOneByCondition({ id: userId });
    if (!updatableUser) {
      throw new NotFoundError('User not found.');
    }

    let nativeLanguage = null;
    if (userData as UpdateUserBody) {
      nativeLanguage = await LanguagesService.findOneByCondition({ id: (userData as UpdateUserBody).nativeLanguageId });
    }
    if (!nativeLanguage) {
      throw new NotFoundError('Language not found.');
    }

    const updatedUser = await UsersRepository.update(updatableUser, userId, userData);

    return updatedUser;
  };
}
