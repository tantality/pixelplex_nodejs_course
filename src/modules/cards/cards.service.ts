/* eslint-disable require-await */
import { logRequest } from '../../utils';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { GetCardsRequest, GetCardsCommon, CreateCardRequest, UpdateCardRequest, DeleteCardRequest } from './types';
import { WordDTO } from './word.dto';
import { Word } from './word.entity';

const nativeWordDTO = new WordDTO({ id: 1, value: 'ef' });
const foreignWordDTO = new WordDTO(new Word(2, 1, 'hello', new Date(), new Date()));
const card = new Card(1, 1, 2, new Date(), new Date());
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
