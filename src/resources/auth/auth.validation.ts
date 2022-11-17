import { CustomValidator, Schema } from 'express-validator';

export class AuthValidation {
  private static findRussianLetters: CustomValidator = function (value: string): string {
    const matches: string[] | null = value.match(/[А-Яа-яЁё]/gi);
    if (matches && matches.length) {
      throw new Error();
    }
    return value;
  };

  private static findSpecialCharactersRegExp = new RegExp('[!@#$%^&*()_+=]', 'g');

  static logIn: Schema = {
    email: {
      in: ['body'],
      isString: {
        bail: true,
      },
      trim: true,
      isLength: {
        errorMessage: 'Value can consist of a maximum of 254 characters',
        options: {
          max: 254,
        },
        bail: true,
      },
      isEmail: true,
    },
    password: {
      in: ['body'],
      isString: {
        bail: true,
      },
      trim: true,
      custom: {
        errorMessage: 'Value must not contain letters of the Russian alphabet',
        options: AuthValidation.findRussianLetters,
        bail: true,
      },
      isStrongPassword: {
        errorMessage:
          'Value must consist of at least 8 lowercase and uppercase Latin characters, at least one digit and at least one special character (!@#$%^&*()_+=)',
        options: {
          minLength: 10,
        },
        bail: true,
      },
      isLength: {
        errorMessage: 'Value can consist of a maximum of 50 characters',
        options: {
          max: 50,
        },
        bail: true,
      },
      matches: {
        errorMessage: 'Value must contain at least one special character (!@#$%^&*()_+=)',
        options: AuthValidation.findSpecialCharactersRegExp,
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
      isLength: {
        errorMessage: 'The number of characters of the value must be in the range from 5 to 256',
        options: {
          min: 5,
          max: 256,
        },
      },
    },
    ...AuthValidation.logIn,
  };
}