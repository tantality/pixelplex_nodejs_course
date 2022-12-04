/* eslint-disable require-await */
import { logRequest } from '../../utils';
import { LANGUAGE_DTO } from '../languages/languages.constants';
import { TaskDTO } from './task.dto';
import { TASK_DTO } from './tasks.constants';
import {
  GetTasksRequest,
  GetTasksCommon,
  GetStatisticsCommon,
  GetStatisticsRequest,
  CreateTaskCommon,
  AddAnswerToTaskRequest,
  CreateTaskRequest,
} from './types';

export class TasksService {
  static findAll = async (req: GetTasksRequest): Promise<GetTasksCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      tasks: [TASK_DTO],
    };
  };

  static calculateStatistics = async (req: GetStatisticsRequest): Promise<GetStatisticsCommon | null> => {
    logRequest(req);
    const statistics = [
      {
        language: LANGUAGE_DTO,
        answers: {
          correct: 10,
          incorrect: 1,
        },
      },
    ];

    return statistics;
  };

  static create = async (req: CreateTaskRequest): Promise<CreateTaskCommon> => {
    logRequest(req);
    return {
      id: 1,
      nativeLanguageId: 1,
      foreignLanguageId: 2,
      word: 'hello',
      type: 'to_native',
    };
  };

  static addAnswer = async (req: AddAnswerToTaskRequest): Promise<TaskDTO> => {
    logRequest(req);
    return TASK_DTO;
  };
}
