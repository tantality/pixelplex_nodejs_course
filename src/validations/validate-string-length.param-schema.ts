import { ParamSchema } from 'express-validator';

export const validateStringLength = (min: number = 1, max: number = 255): ParamSchema => {
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
