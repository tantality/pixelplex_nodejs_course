import { FindOptionsWhere, ILike } from 'typeorm';
import { BadRequestError, LANGUAGE_ALREADY_EXISTS_MESSAGE, LANGUAGE_CANNOT_BE_DELETED_MESSAGE, LANGUAGE_NOT_FOUND_MESSAGE, NotFoundError } from '../../errors';
import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
import { languageEventEmitter } from '../../real-time/languages/language.handler';
import { LANGUAGE_EVENTS } from '../../real-time/languages/language.types';
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
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const createdLanguage = await LanguagesRepository.create(body);

    languageEventEmitter.emit(LANGUAGE_EVENTS.CREATE, createdLanguage);

    return new LanguageDTO(createdLanguage);
  };

  static update = async (languageId: number, body: UpdateLanguageBody): Promise<LanguageDTO> => {
    const languageToUpdate = await LanguagesService.findOneByCondition({ id: languageId });
    if (!languageToUpdate) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const { code } = body;
    const language = code && (await LanguagesService.findOneByCondition({ code }));
    if (language) {
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const updatedLanguage = await LanguagesRepository.update(languageToUpdate, languageId, body);

    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: number): Promise<void> => {
    const languageToDelete = await LanguagesService.findOneByCondition({ id: languageId });
    if (!languageToDelete) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const languageIsUsedInUsersPromise = UsersService.findOneByCondition({ nativeLanguageId: languageId });
    const languageIsUsedInCardsPromise = CardsService.findOneByCondition([
      { nativeLanguageId: languageId },
      { foreignLanguageId: languageId },
    ]);

    const [languageIsUsedInUsers, languageIsUsedInCards] = await Promise.all([languageIsUsedInUsersPromise, languageIsUsedInCardsPromise]);

    if (languageIsUsedInUsers || languageIsUsedInCards) {
      throw new BadRequestError(LANGUAGE_CANNOT_BE_DELETED_MESSAGE);
    }

    await LanguagesRepository.delete(languageId);
  };
}
