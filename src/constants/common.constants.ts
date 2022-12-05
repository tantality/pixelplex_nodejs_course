import { ParamSchema } from 'express-validator';
import { validateStringLength } from '../validations/validate-string-length.param-schema';

const MIN_STRING_LENGTH = 1;
const MAX_STRING_LENGTH = 255;

export const DEFAULT_STRING_LENGTH: ParamSchema = validateStringLength(MIN_STRING_LENGTH, MAX_STRING_LENGTH);
