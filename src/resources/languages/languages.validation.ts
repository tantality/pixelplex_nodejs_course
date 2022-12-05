import { ParamSchema, Schema } from 'express-validator';
import { checkStringIn, validateAndSanitizeString, validateBaseQuery, validateId, validateStringLength } from '../../validations';
import { MIN_CODE_LENGTH, MAX_CODE_LENGTH, MIN_NAME_LENGTH, MAX_NAME_LENGTH } from './languages.constants';
import { LANGUAGE_SORT_BY } from './types';

export class LanguagesValidation {
  private static codeLength: ParamSchema = validateStringLength(MIN_CODE_LENGTH, MAX_CODE_LENGTH);
  private static nameLength: ParamSchema = validateStringLength(MIN_NAME_LENGTH, MAX_NAME_LENGTH);

  static getLanguages: Schema = {
    ...validateBaseQuery,
    sortBy: {
      in: ['query'],
      default: {
        options: LANGUAGE_SORT_BY.DATE,
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, Object.values(LANGUAGE_SORT_BY)),
      },
    },
  };

  static getOneLanguage: Schema = {
    languageId: {
      in: ['params'],
      ...validateId,
    },
  };

  static createLanguage: Schema = {
    code: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...LanguagesValidation.codeLength,
    },
    name: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...LanguagesValidation.nameLength,
    },
  };

  static updateLanguage: Schema = {
    languageId: {
      in: ['params'],
      ...validateId,
    },
    code: {
      in: ['body'],
      optional: true,
      ...validateAndSanitizeString,
      ...LanguagesValidation.codeLength,
    },
    name: {
      in: ['body'],
      optional: true,
      ...validateAndSanitizeString,
      ...LanguagesValidation.nameLength,
    },
  };

  static deleteLanguage: Schema = {
    languageId: {
      in: ['params'],
      ...validateId,
    },
  };
}
