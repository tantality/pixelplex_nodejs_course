import { ParamSchema, Schema } from 'express-validator';
import { SORT_BY } from '../../constants/common.constants';
import {
  checkStringIn,
  validateAndSanitizeString,
  validateArray,
  validateBaseQuery,
  validateId,
  validateIdInBody,
  validateStringLength,
} from '../../validations';
import { TASK_STATUS, TASK_TYPE } from './tasks.constants';

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

  static getTasksSchema: Schema = {
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
        options: SORT_BY.DATE,
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, [SORT_BY.DATE]),
      },
    },
  };

  static getStatisticsSchema: Schema = {
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

  static createTaskSchema: Schema = {
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

  static addAnswerToTaskSchema: Schema = {
    taskId: {
      in: ['params'],
      ...validateId,
    },
    answer: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...validateStringLength,
    },
  };
}