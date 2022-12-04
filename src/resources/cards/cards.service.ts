/* eslint-disable require-await */
import { logRequest } from '../../utils';
import { CardDTO } from './card.dto';
import { CARD_DTO } from './cards.constants';
import { GetCardsRequest, GetCardsCommon, CreateCardRequest, UpdateCardRequest, DeleteCardRequest } from './types';

export class CardsService {
  static findAll = async (req: GetCardsRequest): Promise<GetCardsCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      cards: [CARD_DTO],
    };
  };

  static create = async (req: CreateCardRequest): Promise<CardDTO> => {
    logRequest(req);
    return CARD_DTO;
  };

  static update = async (req: UpdateCardRequest): Promise<CardDTO | null> => {
    logRequest(req);
    return CARD_DTO;
  };

  static delete = async (req: DeleteCardRequest): Promise<number | null> => {
    logRequest(req);
    return 1;
  };
}
