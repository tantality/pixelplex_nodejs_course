import { ParamSchema, Schema } from 'express-validator';
import { DEFAULT_STRING_LENGTH } from '../../constants';
import {
  checkStringIn,
  validateAndSanitizeString,
  validateArray,
  validateBaseQuery,
  validateId,
  validateIdInBody,
} from '../../validations';
import { TASK_SORT_BY, TASK_STATUS, TASK_TYPE } from './types';

export class TasksValidation {
  private static isInvalidDate = (date: Date): boolean => date.getTime() >= new Date().getTime();
  private static isArrayOfNumbers = (arr: Array<any>): boolean => arr.every((elem: any) => typeof elem === 'number');
  private static basicDateValidation: ParamSchema = {
    in: ['query'],
    optional: {
      options: {
        checkFalsy: true,
      },
    },
    ...validateAndSanitizeString,
    isISO8601: {
      bail: true,
    },
    toDate: true,
  };

  static getTasks: Schema = {
    ...validateBaseQuery,
    languageId: {
      in: ['query'],
      optional: {
        options: {
          checkFalsy: true,
        },
      },
      ...validateId,
    },
    taskStatus: {
      in: ['query'],
      optional: {
        options: {
          checkFalsy: true,
        },
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, Object.values(TASK_STATUS)),
      },
    },
    sortBy: {
      in: ['query'],
      default: {
        options: TASK_SORT_BY.DATE,
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, [TASK_SORT_BY.DATE]),
      },
    },
  };

  static getStatistics: Schema = {
    fromDate: {
      ...TasksValidation.basicDateValidation,
      custom: {
        options: (fromDate: Date) => {
          if (TasksValidation.isInvalidDate(fromDate)) {
            throw new Error();
          }
          return fromDate;
        },
      },
    },
    toDate: {
      ...TasksValidation.basicDateValidation,
      custom: {
        options: (toDate: Date, { req }) => {
          const fromDate = req.query?.fromDate;
          const tryParseFromDate = Date.parse(fromDate);
          if (
            (tryParseFromDate && fromDate >= toDate && !TasksValidation.isInvalidDate(fromDate)) ||
            TasksValidation.isInvalidDate(toDate)
          ) {
            throw new Error();
          }
          return toDate;
        },
      },
    },
    'languageIds.*': {
      in: ['query'],
      ...validateId,
    },
    languageIds: {
      in: ['query'],
      optional: true,
      isArray: {
        bail: true,
      },
      custom: {
        options: (value: Array<any>) => validateArray(value, TasksValidation.isArrayOfNumbers),
      },
    },
  };

  static createTask: Schema = {
    foreignLanguageId: {
      in: ['body'],
      ...validateIdInBody,
    },
    type: {
      in: ['body'],
      ...validateAndSanitizeString,
      custom: {
        options: (value: string) => checkStringIn(value, Object.values(TASK_TYPE)),
      },
    },
  };

  static addAnswerToTask: Schema = {
    taskId: {
      in: ['params'],
      ...validateId,
    },
    answer: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...DEFAULT_STRING_LENGTH,
    },
  };
}
