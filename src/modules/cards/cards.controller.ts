import { NextFunction } from 'express';
import { CardDTO } from './card.dto';
import { CardsService } from './cards.service';
import {
  GetCardsRequest,
  GetCardsResponse,
  CreateCardRequest,
  CreateCardResponse,
  UpdateCardRequest,
  UpdateCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  GetCardsCommon,
} from './types';

export class CardsController {
  static getCards = async (req: GetCardsRequest, res: GetCardsResponse, next: NextFunction): Promise<void> => {
    try {
      const cards = await CardsService.findAll(req);
      res.status(200).json(cards as GetCardsCommon);
    } catch (err) {
      next(err);
    }
  };

  static createCard = async (req: CreateCardRequest, res: CreateCardResponse, next: NextFunction): Promise<void> => {
    try {
      const createdCard = await CardsService.create(req);
      res.status(201).json(createdCard);
    } catch (err) {
      next(err);
    }
  };

  static updateCard = async (req: UpdateCardRequest, res: UpdateCardResponse, next: NextFunction): Promise<void> => {
    try {
      const updatedCard = await CardsService.update(req);
      res.status(200).json(updatedCard as CardDTO);
    } catch (err) {
      next(err);
    }
  };

  static deleteCard = async (req: DeleteCardRequest, res: DeleteCardResponse, next: NextFunction): Promise<void> => {
    try {
      const cardId = await CardsService.delete(req);
      res.status(200).json({ id: cardId as number });
    } catch (err) {
      next(err);
    }
  };
}
