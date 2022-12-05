import { Schema } from 'express-validator';
import { SORT_DIRECTION } from '../types';
import { DEFAULT_STRING_LENGTH } from '../constants';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, MAX_LIMIT, MIN_INT, MIN_LIMIT } from './validations.constants';
import { checkStringIn, validateAndSanitizeString } from '.';

export const validateBaseQuery: Schema = {
  search: {
    in: ['query'],
    optional: true,
    ...validateAndSanitizeString,
    ...DEFAULT_STRING_LENGTH,
  },
  offset: {
    in: ['query'],
    default: {
      options: DEFAULT_OFFSET,
    },
    trim: true,
    isInt: {
      errorMessage: `Value must be a number greater than or equal to ${MIN_INT}`,
      options: {
        min: MIN_INT,
      },
      bail: true,
    },
    toInt: true,
  },
  limit: {
    in: ['query'],
    default: {
      options: DEFAULT_LIMIT,
    },
    trim: true,
    isInt: {
      errorMessage: `Value must be a number in the range from ${MIN_LIMIT} to ${MAX_LIMIT}`,
      options: {
        min: MIN_LIMIT,
        max: MAX_LIMIT,
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
