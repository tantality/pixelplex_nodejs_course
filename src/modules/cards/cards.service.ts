/* eslint-disable require-await */
import { logRequest } from '../../utils';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { GetCardsRequest, GetCardsCommon, CreateCardRequest, UpdateCardRequest, DeleteCardRequest } from './types';
import { WordDTO } from './word.dto';

const nativeWordDTO = new WordDTO({ id: 1, value: 'ef' });
const foreignWordDTO = new WordDTO({ id: 1, value: 'ef' });
const card = new Card();
card.foreignLanguageId = 14;
card.nativeLanguageId = 16;
card.userId = 47;
card.createdAt = new Date();
card.updatedAt = new Date();
const cardDTO = new CardDTO(card, [nativeWordDTO], [foreignWordDTO]);

export class CardsService {
  static findAll = async (req: GetCardsRequest): Promise<GetCardsCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      cards: [cardDTO],
    };
  };

  static create = async (req: CreateCardRequest): Promise<CardDTO> => {
    logRequest(req);
    return cardDTO;
  };

  static update = async (req: UpdateCardRequest): Promise<CardDTO | null> => {
    logRequest(req);
    return cardDTO;
  };

  static delete = async (req: DeleteCardRequest): Promise<number | null> => {
    logRequest(req);
    return 1;
  };
}
