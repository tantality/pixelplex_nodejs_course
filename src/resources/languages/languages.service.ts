/* eslint-disable require-await */
import { logRequest } from '../../utils';
import { BadRequestError, NotFoundError } from '../../errors';
import { GetLanguagesRequest, GetLanguagesCommon, UpdateLanguageBody, CreateLanguageBody } from './types';
import { LanguageDTO } from './language.dto';
import { LANGUAGE_DTO } from './languages.constants';
import { LanguagesRepository } from './languages.repository';
import { Language } from './language.entity';

export class LanguagesService {
  static findAll = async (req: GetLanguagesRequest): Promise<GetLanguagesCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      languages: [LANGUAGE_DTO],
    };
  };

  static findById = async (languageId: number): Promise<Language | null> => {
    const language = await LanguagesRepository.findById(languageId);
    return language;
  };

  static findByCode = async (code: string): Promise<Language | null> => {
    const language = await LanguagesRepository.findByCode(code);
    return language;
  };

  static create = async (body: CreateLanguageBody): Promise<LanguageDTO> => {
    const languageWithCurrentCode = await LanguagesService.findByCode(body.code);
    if (languageWithCurrentCode) {
      throw new BadRequestError('The language with the specified code already exists.');
    }

    const createdLanguage = await LanguagesRepository.create(body);
    return new LanguageDTO(createdLanguage);
  };

  static update = async (languageId: number, body: UpdateLanguageBody): Promise<LanguageDTO> => {
    const updatableLanguage = await LanguagesService.findById(languageId);
    if (!updatableLanguage) {
      throw new NotFoundError('Language not found.');
    }

    const { code } = body;
    const languageWithCurrentCode = code && (await LanguagesService.findByCode(code));
    if (languageWithCurrentCode) {
      throw new BadRequestError('The language with the specified code already exists.');
    }

    const updatedLanguage = await LanguagesRepository.update(updatableLanguage, languageId, body);
    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: number): Promise<number> => {
    const deletableLanguage = await LanguagesService.findById(languageId);
    if (!deletableLanguage) {
      throw new NotFoundError('Language not found.');
    }

    await LanguagesRepository.delete(languageId);
    return languageId;
  };
}
