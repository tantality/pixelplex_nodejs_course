import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { CreatedTaskDTO, Statistics } from './tasks.types';

export type GetTasksResponse = Response<{ count: number; tasks: TaskDTO[] }>;
export type GetStatisticsResponse = Response<{ statistics: Statistics[] }>;
export type CreateTaskResponse = Response<CreatedTaskDTO>;
export type UpdateTaskResponse = Response<TaskDTO>;
