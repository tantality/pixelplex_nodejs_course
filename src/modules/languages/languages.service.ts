import { FindOptionsWhere, ILike } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../errors';
import { UsersService } from '../users/users.service';
import { UpdateLanguageBody, CreateLanguageBody, GetLanguagesQuery } from './types';
import { LanguageDTO } from './language.dto';
import { LanguagesRepository } from './languages.repository';
import { Language } from './language.entity';
import { getSortingCondition } from './utils';

export class LanguagesService {
  static findAndCountAll = async ({
    search,
    sortBy,
    sortDirection,
    limit,
    offset,
  }: GetLanguagesQuery): Promise<{ count: number; languages: Language[] }> => {
    let whereCondition: FindOptionsWhere<Language> = {};
    if (search) {
      whereCondition = {
        name: ILike(`%${search}%`),
      };
    }

    const languagesAndTheirNumber = await LanguagesRepository.findAndCountAll(
      offset,
      limit,
      whereCondition,
      getSortingCondition(sortBy, sortDirection),
    );

    return languagesAndTheirNumber;
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Language>): Promise<Language | null> => {
    const language = await LanguagesRepository.findOneByCondition(whereCondition);
    return language;
  };

  static create = async (body: CreateLanguageBody): Promise<LanguageDTO> => {
    const language = await LanguagesService.findOneByCondition({ code: body.code });
    if (language) {
      throw new BadRequestError('The language with the specified code already exists.');
    }

    const createdLanguage = await LanguagesRepository.create(body);

    return new LanguageDTO(createdLanguage);
  };

  static update = async (languageId: number, body: UpdateLanguageBody): Promise<LanguageDTO> => {
    const updatableLanguage = await LanguagesService.findOneByCondition({ id: languageId });
    if (!updatableLanguage) {
      throw new NotFoundError('Language not found.');
    }

    const { code } = body;
    const languageWithCurrentCode = code && (await LanguagesService.findOneByCondition({ code }));
    if (languageWithCurrentCode) {
      throw new BadRequestError('The language with the specified code already exists.');
    }

    const updatedLanguage = await LanguagesRepository.update(updatableLanguage, languageId, body);

    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: number): Promise<void> => {
    const deletableLanguage = await LanguagesService.findOneByCondition({ id: languageId });
    if (!deletableLanguage) {
      throw new NotFoundError('Language not found.');
    }

    const languageIsUsedInUsers = await UsersService.findOneByCondition({ nativeLanguageId: languageId });
    if (languageIsUsedInUsers) {
      throw new BadRequestError('The language cannot be deleted because it is set as the user\'s native language.');
    }

    await LanguagesRepository.delete(languageId);
  };
}
