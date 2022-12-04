import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { CreateTaskCommon, GetStatisticsCommon, GetTasksCommon } from './common.types';

export type GetTasksResponse = Response<GetTasksCommon>;
export type GetStatisticsResponse = Response<{ statistics: GetStatisticsCommon }>;
export type CreateTaskResponse = Response<CreateTaskCommon>;
export type AddAnswerToTaskResponse = Response<TaskDTO>;
