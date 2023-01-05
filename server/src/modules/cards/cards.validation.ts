import { ParamSchema, Schema } from 'express-validator';
import { DEFAULT_STRING_LENGTH_VALIDATION } from '../../constants';
import {
  validateAndSanitizeString,
  validateId,
  validateBaseQuery,
  checkStringIn,
  validateIdInBody,
  validateArray,
} from '../../validations';
import { MIN_ARRAY_LENGTH, MAX_ARRAY_LENGTH } from './cards.constants';
import { CARD_SORT_BY } from './types';

export class CardsValidation {
  private static isArrayOfStrings = (arr: Array<any>): boolean => arr.every((elem) => typeof elem === 'string');

  private static validateArray: ParamSchema = {
    in: ['body'],
    isArray: {
      errorMessage: `Value must be an array with the number of elements from ${MIN_ARRAY_LENGTH} to ${MAX_ARRAY_LENGTH}`,
      options: {
        min: MIN_ARRAY_LENGTH,
        max: MAX_ARRAY_LENGTH,
      },
      bail: true,
    },
    custom: {
      options: (value: Array<any>) => validateArray(value, CardsValidation.isArrayOfStrings),
    },
  };

  static getCards: Schema = {
    ...validateBaseQuery,
    languageId: {
      in: ['query'],
      optional: true,
      ...validateId,
    },
    sortBy: {
      in: ['query'],
      default: {
        options: CARD_SORT_BY.DATE,
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, Object.values(CARD_SORT_BY)),
      },
    },
  };

  static createCard: Schema = {
    'nativeWords.*': {
      in: ['body'],
      ...validateAndSanitizeString,
      ...DEFAULT_STRING_LENGTH_VALIDATION,
      toLowerCase: true,
    },
    'foreignWords.*': {
      in: ['body'],
      ...validateAndSanitizeString,
      ...DEFAULT_STRING_LENGTH_VALIDATION,
      toLowerCase: true,
    },
    nativeWords: {
      ...CardsValidation.validateArray,
    },
    foreignWords: {
      ...CardsValidation.validateArray,
    },
    foreignLanguageId: {
      in: ['body'],
      ...validateIdInBody,
    },
  };

  static updateCard: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
    foreignLanguageId: {
      in: ['body'],
      optional: true,
      ...validateIdInBody,
    },
    'nativeWords.*': {
      in: ['body'],
      optional: true,
      ...validateAndSanitizeString,
      ...DEFAULT_STRING_LENGTH_VALIDATION,
      toLowerCase: true,
    },
    'foreignWords.*': {
      in: ['body'],
      optional: true,
      ...validateAndSanitizeString,
      ...DEFAULT_STRING_LENGTH_VALIDATION,
      toLowerCase: true,
    },
    nativeWords: {
      optional: true,
      ...CardsValidation.validateArray,
    },
    foreignWords: {
      optional: true,
      ...CardsValidation.validateArray,
    },
  };

  static deleteCard: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
  };
}
