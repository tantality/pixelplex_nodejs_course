import { ParamSchema } from 'express-validator';
import { MIN_ID } from './validations.constants';

const isValueInt = (value: any): boolean => {
  if (!Number.isInteger(value)) {
    throw new Error();
  }
  return true;
};

export const validateIdInBody: ParamSchema = {
  custom: {
    options: (value: any) => isValueInt(value),
    bail: true,
  },
  isInt: {
    errorMessage: `Value must be a number greater than or equal ${MIN_ID}`,
    options: {
      min: MIN_ID,
    },
    bail: true,
  },
};
