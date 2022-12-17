import { FindOptionsWhere, ILike } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../errors';
import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
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
    const languageToUpdate = await LanguagesService.findOneByCondition({ id: languageId });
    if (!languageToUpdate) {
      throw new NotFoundError('Language not found.');
    }

    const { code } = body;
    const language = code && (await LanguagesService.findOneByCondition({ code }));
    if (language) {
      throw new BadRequestError('The language with the specified code already exists.');
    }

    const updatedLanguage = await LanguagesRepository.update(languageToUpdate, languageId, body);

    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: number): Promise<void> => {
    const languageToDelete = await LanguagesService.findOneByCondition({ id: languageId });
    if (!languageToDelete) {
      throw new NotFoundError('Language not found.');
    }

    const userLanguage = await UsersService.findOneByCondition({ nativeLanguageId: languageId });
    const cardLanguage = await CardsService.findOneWithLanguage(languageId);
    if (userLanguage || cardLanguage ) {
      throw new BadRequestError('The language cannot be deleted because it is used in the card(s) or / and is set as the user\'s native language.');
    }

    await LanguagesRepository.delete(languageId);
  };
}
