import { ParamSchema } from 'express-validator';

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
    errorMessage: 'Value must be a number greater than 0',
    options: {
      min: 1,
    },
    bail: true,
  },
};
