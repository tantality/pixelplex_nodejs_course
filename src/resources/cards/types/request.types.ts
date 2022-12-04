import { Request } from 'express';
import { CreateCardBody, UpdateCardBody } from './body.types';
import { UpdateCardParams, DeleteCardParams } from './params.types';
import { GetCardsQuery } from './query.types';

export type GetCardsRequest = Request<unknown, unknown, unknown, GetCardsQuery>;
export type CreateCardRequest = Request<unknown, unknown, CreateCardBody, unknown>;
export type UpdateCardRequest = Request<UpdateCardParams, unknown, UpdateCardBody, unknown>;
export type DeleteCardRequest = Request<DeleteCardParams, unknown, unknown, unknown>;
