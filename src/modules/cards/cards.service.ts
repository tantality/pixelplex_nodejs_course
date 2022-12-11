/* eslint-disable require-await */
import { FindOptionsWhere } from 'typeorm';
import { BadRequestError, NotFoundError } from '../../errors';
import { logRequest } from '../../utils';
import { LanguagesService } from '../languages/languages.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { CardsRepository } from './cards.repository';
import { GetCardsRequest, GetCardsCommon, DeleteCardRequest, CreateCardBody, UpdateCardBody } from './types';
import { WordDTO } from './word.dto';
import { Word } from './word.entity';
import { WordsService } from './words.service';

const word = new Word();
word.id = 1;
word.value = 'wd';
word.languageId = 2;
word.cardId = 2;
word.createdAt = new Date();
word.updatedAt = new Date();

const nativeWordDTO = new WordDTO(word);
const foreignWordDTO = new WordDTO(word);

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

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Card>): Promise<Card | null> => {
    const card = await CardsRepository.findOneByCondition(whereCondition);
    return card;
  };

  static create = async (userId: number, { nativeWords, foreignLanguageId, foreignWords }: CreateCardBody): Promise<CardDTO> => {
    const { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;
    const foreignLanguage = await LanguagesService.findOneByCondition({ id: foreignLanguageId });
    if (!foreignLanguage) {
      throw new NotFoundError('Language not found');
    }

    if (!nativeLanguageId) {
      throw new NotFoundError('The user\'s native language is not set.');
    }

    if (foreignLanguageId === nativeLanguageId) {
      throw new BadRequestError('ForeignLanguageId must be different from the user\'s nativeLanguageId.');
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
      throw new NotFoundError('Card not found');
    }

    let foreignLanguage = null;
    if (foreignLanguageId) {
      foreignLanguage = await LanguagesService.findOneByCondition({ id: foreignLanguageId });
      if (!foreignLanguage) {
        throw new NotFoundError('Language not found');
      }
    }

    const { nativeLanguageId } = (await UsersService.findOneByCondition({ id: userId })) as User;
    if (!nativeLanguageId) {
      throw new NotFoundError('The user\'s native language is not set.');
    }

    if (foreignLanguageId === nativeLanguageId) {
      throw new BadRequestError('ForeignLanguageId must be different from the user\'s nativeLanguageId.');
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

  static delete = async (req: DeleteCardRequest): Promise<number | null> => {
    logRequest(req);
    return 1;
  };
}
