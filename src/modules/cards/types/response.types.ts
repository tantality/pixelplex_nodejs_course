import { Response } from 'express';
import { CardDTO } from '../card.dto';

export type GetCardsResponse = Response<{ count: number; cards: CardDTO[] }>;
export type CreateCardResponse = Response<CardDTO>;
export type UpdateCardResponse = Response<CardDTO>;
