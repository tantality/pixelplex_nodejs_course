import { ParamSchema } from 'express-validator';

const replaceExtraSpaces = (value: string): string => value.replace(/\s+/g, ' ');
export const validateAndSanitizeString: ParamSchema = {
  isString: {
    bail: true,
  },
  trim: true,
  toLowerCase: true,
  customSanitizer: {
    options: replaceExtraSpaces,
  },
};
