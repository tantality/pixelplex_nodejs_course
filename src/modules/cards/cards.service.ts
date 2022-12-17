import { FindOptionsWhere } from 'typeorm';
import {
  BadRequestError,
  CARD_NOT_FOUND_MESSAGE,
  LANGUAGE_NOT_FOUND_MESSAGE,
  NATIVE_AND_FOREIGN_LANGUAGE_ARE_EQUAL_MESSAGE,
  NotFoundError,
  NO_NATIVE_LANGUAGE_SET_FOR_THE_USER_MESSAGE,
} from '../../errors';
import { LanguagesService } from '../languages/languages.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { CardsRepository } from './cards.repository';
import { GetCardsCommon, CreateCardBody, UpdateCardBody, GetCardsQuery } from './types';
import { WordsService } from './words.service';

export class CardsService {
  static findAndCountAll = async (userId: number, query: GetCardsQuery): Promise<GetCardsCommon> => {
    const cardsAndTheirNumber = await CardsRepository.findAndCountAll(userId, query);

    return cardsAndTheirNumber;
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Card>): Promise<Card | null> => {
    const card = await CardsRepository.findOneByCondition(whereCondition);
    return card;
  };

  static findOneWithLanguage = async (languageId: number): Promise<Card | null> => {
    const card = await CardsRepository.findOneWithLanguage(languageId);
    return card;
  };

  static create = async (userId: number, { nativeWords, foreignLanguageId, foreignWords }: CreateCardBody): Promise<CardDTO> => {
    const { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;
    const foreignLanguage = await LanguagesService.findOneByCondition({ id: foreignLanguageId });
    if (!foreignLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    if (!nativeLanguageId) {
      throw new NotFoundError(NO_NATIVE_LANGUAGE_SET_FOR_THE_USER_MESSAGE);
    }

    if (foreignLanguageId === nativeLanguageId) {
      throw new BadRequestError(NATIVE_AND_FOREIGN_LANGUAGE_ARE_EQUAL_MESSAGE);
    }

    const createdCard = await CardsRepository.create(userId, nativeLanguageId, foreignLanguageId);
    const createdNativeWordsDTO = await WordsService.create({
      cardId: createdCard.id,
      languageId: nativeLanguageId,
      values: nativeWords,
    });
    const createdForeignWordsDTO = await WordsService.create({
      cardId: createdCard.id,
      languageId: foreignLanguageId,
      values: foreignWords,
    });

    return new CardDTO(createdCard, createdNativeWordsDTO, createdForeignWordsDTO);
  };

  static update = async (
    userId: number,
    cardId: number,
    { nativeWords, foreignLanguageId, foreignWords }: UpdateCardBody,
  ): Promise<CardDTO> => {
    const updatableCard = await CardsService.findOneByCondition({ userId, id: cardId });
    if (!updatableCard) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    let foreignLanguage = null;
    if (foreignLanguageId) {
      foreignLanguage = await LanguagesService.findOneByCondition({ id: foreignLanguageId });
      if (!foreignLanguage) {
        throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
      }
    }

    const { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;
    if (!nativeLanguageId) {
      throw new NotFoundError(NO_NATIVE_LANGUAGE_SET_FOR_THE_USER_MESSAGE);
    }

    if (foreignLanguageId === nativeLanguageId) {
      throw new BadRequestError(NATIVE_AND_FOREIGN_LANGUAGE_ARE_EQUAL_MESSAGE);
    }

    let wordsWithUpdatedLanguageIdDTOs = null;
    if (foreignLanguageId && !foreignWords) {
      wordsWithUpdatedLanguageIdDTOs = await WordsService.updateLanguageId(cardId, updatableCard.foreignLanguageId, foreignLanguageId);
    }

    const updatedNativeWordsDTOs = await WordsService.update(updatableCard.nativeLanguageId, {
      cardId: updatableCard.id,
      languageId: updatableCard.nativeLanguageId,
      values: nativeWords,
    });

    let updatedForeignWordsDTOs = wordsWithUpdatedLanguageIdDTOs;
    if (!updatedForeignWordsDTOs) {
      updatedForeignWordsDTOs = await WordsService.update(updatableCard.foreignLanguageId, {
        cardId: updatableCard.id,
        languageId: foreignLanguageId ? foreignLanguageId : updatableCard.foreignLanguageId,
        values: foreignWords,
      });
    }

    const updatedCard = await CardsRepository.update(userId, cardId, foreignLanguageId);

    return new CardDTO(updatedCard, updatedNativeWordsDTOs, updatedForeignWordsDTOs);
  };

  static delete = async (userId: number, cardId: number): Promise<number> => {
    const deletableCard = await CardsService.findOneByCondition({ userId, id: cardId });
    if (!deletableCard) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    await CardsRepository.delete(cardId);

    return cardId;
  };
}
