import { Schema } from 'express-validator';
import { SORT_DIRECTION } from '../constants';
import { checkStringIn, validateAndSanitizeString, validateStringLength } from '.';

export const validateBaseQuery: Schema = {
  search: {
    in: ['query'],
    optional: true,
    ...validateAndSanitizeString,
    ...validateStringLength,
  },
  offset: {
    in: ['query'],
    trim: true,
    isInt: {
      errorMessage: 'Value must be a number greater than 0',
      options: {
        min: 1,
      },
      bail: true,
    },
    toInt: true,
  },
  limit: {
    in: ['query'],
    default: {
      options: 20,
    },
    trim: true,
    isInt: {
      errorMessage: 'Value must be a number in the range from 1 to 100',
      options: {
        min: 1,
        max: 100,
      },
      bail: true,
    },
    toInt: true,
  },
  sortDirection: {
    in: ['query'],
    default: {
      options: SORT_DIRECTION.ASC,
    },
    trim: true,
    toLowerCase: true,
    custom: {
      options: (value: string) => checkStringIn(value, Object.values(SORT_DIRECTION)),
    },
  },
};
