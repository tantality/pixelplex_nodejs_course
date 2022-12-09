import { Schema } from 'express-validator';
import { validateIdInBody } from '../../validations';

export class UsersValidation {
  static updateUser: Schema = {
    nativeLanguageId: {
      in: ['body'],
      ...validateIdInBody,
    },
  };
}
