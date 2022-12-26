import {
  BadRequestError,
  NO_NATIVE_LANGUAGE_SET_FOR_THE_USER_MESSAGE,
  NotFoundError,
  LANGUAGE_NOT_FOUND_MESSAGE,
  NATIVE_AND_FOREIGN_LANGUAGE_ARE_EQUAL_MESSAGE,
} from '../errors';
import { LanguagesService } from '../modules/languages/languages.service';

export const checkLanguagesValidity = async (nativeLanguageId: number | null, foreignLanguageId?: number): Promise<void> => {
  if (!nativeLanguageId) {
    throw new BadRequestError(NO_NATIVE_LANGUAGE_SET_FOR_THE_USER_MESSAGE);
  }

  if (foreignLanguageId === nativeLanguageId) {
    throw new BadRequestError(NATIVE_AND_FOREIGN_LANGUAGE_ARE_EQUAL_MESSAGE);
  }

  if (foreignLanguageId) {
    const foreignLanguage = await LanguagesService.findOneByCondition({ id: foreignLanguageId });
    if (!foreignLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }
  }
};
