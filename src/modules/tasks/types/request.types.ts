import { Request } from 'express';
import { CreateTaskBody, AddAnswerToTaskBody } from './body.types';
import { AddAnswerToTaskParams } from './params.types';
import { GetTasksQuery, GetStatisticsQuery } from './query.types';

export type GetTasksRequest = Request<unknown, unknown, unknown, GetTasksQuery>;
export type GetStatisticsRequest = Request<unknown, unknown, unknown, GetStatisticsQuery>;
export type CreateTaskRequest = Request<unknown, unknown, CreateTaskBody, unknown>;
export type AddAnswerToTaskRequest = Request<AddAnswerToTaskParams, unknown, AddAnswerToTaskBody, unknown>;
