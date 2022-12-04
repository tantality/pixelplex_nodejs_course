import { ParamSchema } from 'express-validator';
import { validateStringLength } from '../validations';

export const DEFAULT_STRING_LENGTH: ParamSchema = validateStringLength();
