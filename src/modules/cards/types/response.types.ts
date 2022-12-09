import { Response } from 'express';
import { CardDTO } from '../card.dto';
import { GetCardsCommon } from './common.types';

export type GetCardsResponse = Response<GetCardsCommon>;
export type CreateCardResponse = Response<CardDTO>;
export type UpdateCardResponse = Response<CardDTO>;
export type DeleteCardResponse = Response<{ id: number }>;
