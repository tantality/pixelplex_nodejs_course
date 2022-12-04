import { ParamSchema, Schema } from 'express-validator';
import { SORT_BY } from '../../constants';
import {
  checkStringIn,
  validateAndSanitizeString,
  validateBaseQuery,
  validateId,
  validateStringLength,
} from '../../validations';

export class LanguagesValidation {
  private static codeLength: ParamSchema = validateStringLength(2, 4);
  private static nameLength: ParamSchema = validateStringLength(2, 50);

  static getLanguages: Schema = {
    ...validateBaseQuery,
    sortBy: {
      in: ['query'],
      default: {
        options: SORT_BY.DATE,
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, [SORT_BY.DATE, SORT_BY.NAME]),
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
