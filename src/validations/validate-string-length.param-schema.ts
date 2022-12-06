import { ParamSchema } from 'express-validator';
import { MAX_STRING_LENGTH, MIN_STRING_LENGTH } from './validations.constants';

export const validateStringLength = (min: number = MIN_STRING_LENGTH, max: number = MAX_STRING_LENGTH): ParamSchema => {
  const length: ParamSchema = {
    isLength: {
      errorMessage: `Value must be in the range from ${min} to ${max} characters`,
      options: {
        min,
        max,
      },
      bail: true,
    },
  };

  return length;
};
