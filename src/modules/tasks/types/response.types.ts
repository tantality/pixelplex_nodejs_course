import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { CreateTaskCommon, GetStatisticsCommon } from './common.types';

export type GetTasksResponse = Response<{ count: number; tasks: TaskDTO[] }>;
export type GetStatisticsResponse = Response<{ statistics: GetStatisticsCommon }>;
export type CreateTaskResponse = Response<CreateTaskCommon>;
export type AddAnswerToTaskResponse = Response<TaskDTO>;
