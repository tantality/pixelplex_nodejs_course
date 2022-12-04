import { ParamSchema } from 'express-validator';

export const validateId: ParamSchema = {
  trim: true,
  isInt: {
    errorMessage: 'Value must be a number greater than 0',
    options: {
      min: 1,
    },
    bail: true,
  },
  toInt: true,
};
