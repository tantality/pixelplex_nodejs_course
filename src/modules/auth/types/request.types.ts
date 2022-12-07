import { Request } from 'express';
import { LogInBody, SignUpBody } from './body.types';

export type SignUpRequest = Request<unknown, unknown, SignUpBody, unknown>;
export type LogInRequest = Request<unknown, unknown, LogInBody, unknown>;
