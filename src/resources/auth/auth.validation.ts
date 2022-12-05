import { Schema } from 'express-validator';
import { validateIdInBody, validateStringLength } from '../../validations';
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH } from './auth.constants';

export class AuthValidation {
  private static checkStrongPasswordRegExp = new RegExp(
    '(?=.*[0-9])(?=.*[!@#$%^&*()_+=])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()_+=]{' + MIN_PASSWORD_LENGTH + ',}',
    'g',
  );

  static logIn: Schema = {
    email: {
      in: ['body'],
      isString: {
        bail: true,
      },
      trim: true,
      isEmail: true,
    },
    password: {
      in: ['body'],
      isString: {
        bail: true,
      },
      trim: true,
      matches: {
        errorMessage: `Value must consist of at least ${MIN_PASSWORD_LENGTH} lowercase and uppercase Latin characters, at least one digit and at least one special character (!@#$%^&*()_+=)`,
        options: AuthValidation.checkStrongPasswordRegExp,
      },
    },
  };

  static signUp: Schema = {
    name: {
      in: ['body'],
      isString: {
        bail: true,
      },
      trim: true,
      ...validateStringLength(MIN_NAME_LENGTH, MAX_NAME_LENGTH),
    },
    ...AuthValidation.logIn,
    nativeLanguageId: {
      in: ['body'],
      ...validateIdInBody,
    },
  };
}
