import { ParamSchema, Schema } from 'express-validator';
import { validateAndSanitizeString, validateId, validateBaseQuery } from '../../validations';

interface IMeaning {
  id: number | string;
  value: string;
}

export class CardsValidation {
  private static checkArrayForDuplicates = <T>(arr: Array<T>): Array<T> => {
    const set = new Set<T>(arr);
    const isArrayContainDuplicates = set.size !== arr.length;
    if (isArrayContainDuplicates) {
      throw new Error('Array must contain unique elements');
    }
    return arr;
  };

  private static isArrayOfStrings = (arr: Array<any>): boolean => arr.every((elem: any) => typeof elem === 'string');
  private static isArrayOfNumbers = (arr: Array<any>): boolean => arr.every((elem: any) => typeof elem === 'number');

  private static getIdsFromArrayOfMeanings = (arr: Array<IMeaning>): Array<number | null> => {
    return arr.map((elem: IMeaning) => {
      const id = elem.id;
      const numericId = Number(id);
      if (typeof id === 'string' && numericId) {
        return numericId;
      }
      if (typeof id === 'number') {
        return id;
      }

      return null;
    });
  };

  private static getValuesFromArrayOfMeanings = (arr: Array<IMeaning>): Array<string | null> => {
    return arr.map((elem: IMeaning) => {
      const value = elem.value;
      if (typeof value === 'string') {
        return value;
      } else {
        return null;
      }
    });
  };

  private static validateMeanings = (arr: Array<IMeaning>): Array<IMeaning> => {
    const ids = CardsValidation.getIdsFromArrayOfMeanings(arr);
    const values = CardsValidation.getValuesFromArrayOfMeanings(arr);

    if (CardsValidation.isArrayOfNumbers(ids)) {
      CardsValidation.checkArrayForDuplicates(ids);
    }

    if (CardsValidation.isArrayOfStrings(values)) {
      CardsValidation.checkArrayForDuplicates(values);
    }

    return arr;
  };

  private static validateArrayParamSchema: ParamSchema = {
    in: ['body'],
    isArray: {
      errorMessage: 'Array must contain the number of elements in the range from 1 to 3',
      options: {
        min: 1,
        max: 3,
      },
    },
    toArray: true,
  };

  static getCardsSchema: Schema = {
    ...validateBaseQuery,
    languageId: {
      in: ['query'],
      optional: true,
      ...validateId,
    },
  };

  static createCardSchema: Schema = {
    'nativeMeanings.*': {
      in: ['body'],
      ...validateAndSanitizeString,
    },
    'foreignMeanings.*': {
      in: ['body'],
      ...validateAndSanitizeString,
    },
    nativeMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: (arr: Array<IMeaning>) => {
          if (CardsValidation.isArrayOfStrings(arr)) {
            CardsValidation.checkArrayForDuplicates(arr);
          }
          return arr;
        },
      },
    },
    foreignMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: (arr: Array<IMeaning>) => {
          if (CardsValidation.isArrayOfStrings(arr)) {
            return CardsValidation.checkArrayForDuplicates(arr);
          }
          return arr;
        },
      },
    },
    foreignLanguageId: {
      in: ['body'],
      ...validateId,
    },
  };

  static updateCardSchema: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
    foreignLanguageId: {
      in: ['body'],
      ...validateId,
    },
    'nativeMeanings.*.id': {
      in: ['body'],
      ...validateId,
    },
    'nativeMeanings.*.value': {
      in: ['body'],
      ...validateAndSanitizeString,
    },
    nativeMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: CardsValidation.validateMeanings,
      },
    },
    'foreignMeanings.*.id': {
      in: ['body'],
      ...validateId,
    },
    'foreignMeanings.*.value': {
      in: ['body'],
      ...validateAndSanitizeString,
    },
    foreignMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: CardsValidation.validateMeanings,
      },
    },
  };

  static deleteCardSchema: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
  };
}