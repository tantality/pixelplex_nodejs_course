import { ParamSchema } from 'express-validator';
import { MIN_ID } from './validations.constants';

export const validateId: ParamSchema = {
  trim: true,
  isInt: {
    errorMessage: `Value must be a number greater than or equal ${MIN_ID}`,
    options: {
      min: MIN_ID,
    },
    bail: true,
  },
  toInt: true,
};
