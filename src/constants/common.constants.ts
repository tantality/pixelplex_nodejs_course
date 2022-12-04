import { ParamSchema } from 'express-validator';
import { validateStringLength } from '../validations';

export enum SORT_BY {
  WORD = 'word',
  DATE = 'date',
  NAME = 'name',
}

export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export const DEFAULT_STRING_LENGTH: ParamSchema = validateStringLength();
