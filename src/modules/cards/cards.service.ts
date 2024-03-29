import { FindOptionsWhere } from 'typeorm';
import { CARD_NOT_FOUND_MESSAGE, NotFoundError } from '../../errors';
import { checkLanguagesValidity } from '../../utils';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { CardsRepository } from './cards.repository';
import { CreateCardBody, UpdateCardBody, GetCardsQuery } from './types';
import { WordsService } from './words.service';

export class CardsService {
  static findAndCountAll = async (userId: number, query: GetCardsQuery): Promise<{ count: number; cards: CardDTO[] }> => {
    const cardsAndTheirNumber = await CardsRepository.findAndCountAll(userId, query);
    return cardsAndTheirNumber;
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Card> | FindOptionsWhere<Card>[]): Promise<Card | null> => {
    const card = await CardsRepository.findOneByCondition(whereCondition);
    return card;
  };

  static create = async (userId: number, { nativeWords, foreignLanguageId, foreignWords }: CreateCardBody): Promise<CardDTO> => {
    let { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;

    await checkLanguagesValidity(nativeLanguageId, foreignLanguageId);

    nativeLanguageId = nativeLanguageId as number;

    const createdCard = await CardsRepository.create(userId, nativeLanguageId, foreignLanguageId);
    const createdNativeWords = WordsService.create({
      cardId: createdCard.id,
      languageId: nativeLanguageId,
      values: nativeWords,
    });
    const createdForeignWords = WordsService.create({
      cardId: createdCard.id,
      languageId: foreignLanguageId,
      values: foreignWords,
    });

    const createdWords = await Promise.all([createdNativeWords, createdForeignWords]);

    return new CardDTO(createdCard, ...createdWords);
  };

  static update = async (
    userId: number,
    cardId: number,
    { nativeWords, foreignLanguageId, foreignWords }: UpdateCardBody,
  ): Promise<CardDTO> => {
    const cardToUpdate = await CardsService.findOneByCondition({ userId, id: cardId });
    if (!cardToUpdate) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    const { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;

    await checkLanguagesValidity(nativeLanguageId, foreignLanguageId);

    let updatedForeignWords = null;
    if (foreignLanguageId && !foreignWords) {
      updatedForeignWords = WordsService.updateLanguageId(cardId, cardToUpdate.foreignLanguageId, foreignLanguageId);
    }

    const updatedNativeWords = WordsService.update(cardToUpdate.nativeLanguageId, {
      cardId: cardToUpdate.id,
      languageId: cardToUpdate.nativeLanguageId,
      values: nativeWords,
    });

    if (!updatedForeignWords) {
      updatedForeignWords = WordsService.update(cardToUpdate.foreignLanguageId, {
        cardId: cardToUpdate.id,
        languageId: foreignLanguageId ? foreignLanguageId : cardToUpdate.foreignLanguageId,
        values: foreignWords,
      });
    }

    const updatedCard = CardsRepository.update(userId, cardId, foreignLanguageId);

    const updatedCardWithWords = await Promise.all([updatedCard, updatedNativeWords, updatedForeignWords]);

    return new CardDTO(...updatedCardWithWords);
  };

  static delete = async (userId: number, cardId: number): Promise<void> => {
    const cardToDelete = await CardsService.findOneByCondition({ userId, id: cardId });
    if (!cardToDelete) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    await CardsRepository.delete(cardId);
  };
}
