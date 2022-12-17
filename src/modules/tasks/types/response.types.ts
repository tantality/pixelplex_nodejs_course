import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { CreateTaskCommon } from './common.types';
import { Statistics } from './tasks.types';

export type GetTasksResponse = Response<{ count: number; tasks: TaskDTO[] }>;
export type GetStatisticsResponse = Response<{ statistics: Statistics[] }>;
export type CreateTaskResponse = Response<CreateTaskCommon>;
export type AddAnswerToTaskResponse = Response<TaskDTO>;
