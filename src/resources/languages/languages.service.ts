import { FindOptionsWhere } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../errors';
import { UsersService } from '../users/users.service';
import { GetLanguagesCommon, UpdateLanguageBody, CreateLanguageBody, GetLanguagesQuery } from './types';
import { LanguageDTO } from './language.dto';
import { LanguagesRepository } from './languages.repository';
import { Language } from './language.entity';
import { getOrderOptions, getWhereOptions } from './utils';

export class LanguagesService {
  static findAndCountAll = async ({ search, sortBy, sortDirection, limit, offset }: GetLanguagesQuery): Promise<GetLanguagesCommon> => {
    const languagesAndCount = await LanguagesRepository.findAndCountAll(
      offset,
      limit,
      getWhereOptions(search),
      getOrderOptions(sortBy, sortDirection),
    );
    return languagesAndCount;
  };

  static findOneByCondition = async (where: FindOptionsWhere<Language>): Promise<Language | null> => {
    const language = await LanguagesRepository.findOneByCondition(where);
    return language;
  };

  static create = async (body: CreateLanguageBody): Promise<LanguageDTO> => {
    const languageWithCurrentCode = await LanguagesService.findOneByCondition({ code: body.code });
    if (languageWithCurrentCode) {
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
    const languageWithCurrentCode = code && (await LanguagesService.findOneByCondition({ code: body.code }));
    if (languageWithCurrentCode) {
      throw new BadRequestError('The language with the specified code already exists.');
    }

    const updatedLanguage = await LanguagesRepository.update(updatableLanguage, languageId, body);
    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: number): Promise<number> => {
    const deletableLanguage = await LanguagesService.findOneByCondition({ id: languageId });
    if (!deletableLanguage) {
      throw new NotFoundError('Language not found.');
    }

    const languageIsUsedInUsers = await UsersService.findOneByCondition({ nativeLanguageId: languageId });
    if (languageIsUsedInUsers) {
      throw new BadRequestError('The language cannot be deleted because it is set as the user\'s native language.');
    }

    await LanguagesRepository.delete(languageId);
    return languageId;
  };
}
