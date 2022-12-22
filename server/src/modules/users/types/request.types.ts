import { Request } from 'express';
import { UpdateUserBody } from './body.types';

export type UpdateUserRequest = Request<unknown, unknown, UpdateUserBody, unknown>;
