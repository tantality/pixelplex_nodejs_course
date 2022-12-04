import { Schema } from 'express-validator';
import { validateIdInBody, validateStringLength } from '../../validations';

export class AuthValidation {
  private static checkStrongPasswordRegExp =
    /(?=.*[0-9])(?=.*[!@#$%^&*()_+=])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()_+=]{8,}/g;

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
        errorMessage:
          'Value must consist of at least 8 lowercase and uppercase Latin characters, at least one digit and at least one special character (!@#$%^&*()_+=)',
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
      ...validateStringLength(5, 256),
    },
    ...AuthValidation.logIn,
    nativeLanguageId: {
      in: ['body'],
      ...validateIdInBody,
    },
  };
}
