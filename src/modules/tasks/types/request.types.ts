import { Request } from 'express';
import { CreateTaskBody, UpdateTaskBody } from './body.types';
import { UpdateTaskParams } from './params.types';
import { GetTasksQuery, GetStatisticsQuery } from './query.types';

export type GetTasksRequest = Request<unknown, unknown, unknown, GetTasksQuery>;
export type GetStatisticsRequest = Request<unknown, unknown, unknown, GetStatisticsQuery>;
export type CreateTaskRequest = Request<unknown, unknown, CreateTaskBody, unknown>;
export type UpdateTaskRequest = Request<UpdateTaskParams, unknown, UpdateTaskBody, unknown>;
