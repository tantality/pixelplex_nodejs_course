import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { CreateWordsData, FindAnswersQueryResult, UpdateWordsData, WordToCreate } from './types';
import { getWordsDTO, prepareWordsToCreate } from './utils';
import { WordDTO } from './word.dto';
import { Word } from './word.entity';
import { WordsRepository } from './words.repository';

export class WordsService {
  static findAllByCondition = async (condition: FindManyOptions<Word>): Promise<Word[] | null> => {
    const words = await WordsRepository.findAllByCondition(condition);
    return words;
  };

  static findOneWithJoinedCard = async (id: number): Promise<Word | null> => {
    const word = await WordsRepository.findOneWithJoinedCard(id);
    return word;
  };

  static findRandomOne = async (
    userId: number,
    cardNativeLanguageId: number,
    cardForeignLanguageId: number,
    wordLanguageId: number,
  ): Promise<Word | null> => {
    const word = await WordsRepository.findRandomOne(userId, cardNativeLanguageId, cardForeignLanguageId, wordLanguageId);
    return word;
  };

  static findCorrectAnswersToTask = async (
    userId: number,
    cardNativeLanguageId: number,
    cardForeignLanguageId: number,
    wordValue: string,
    wordLanguageId: number,
  ): Promise<string[]> => {
    const findCardIdsQueryBuilder = WordsRepository.createQueryBuilderToFindCardIds(userId, cardNativeLanguageId, cardForeignLanguageId, wordValue);
    const { answers }: FindAnswersQueryResult = await WordsRepository.findCorrectAnswersToTask(findCardIdsQueryBuilder, wordLanguageId);
    if (!answers) {
      return [];
    }

    return answers;
  };

  static create = async (wordsData: CreateWordsData): Promise<WordDTO[]> => {
    const preparedWords: WordToCreate[] = prepareWordsToCreate(wordsData);
    const createdWords = await WordsRepository.create(preparedWords);

    return getWordsDTO(createdWords);
  };

  static updateLanguageId = async (cardId: number, oldLanguageId: number, newLanguageId: number): Promise<WordDTO[]> => {
    const updatedWords = await WordsRepository.updateLanguageId(cardId, oldLanguageId, newLanguageId);
    return getWordsDTO(updatedWords);
  };

  static update = async (cardLanguageId: number, wordsData: UpdateWordsData): Promise<WordDTO[]> => {
    let updatedWords: Word[] | null = null;

    const whereCondition: FindOptionsWhere<Word> = {
      cardId: wordsData.cardId,
      languageId: cardLanguageId,
    };

    if (!wordsData.values) {
      updatedWords = (await WordsService.findAllByCondition({
        where: whereCondition,
      })) as Word[];
    }

    if (!updatedWords) {
      const preparedWords: WordToCreate[] = prepareWordsToCreate(wordsData as CreateWordsData);
      updatedWords = await WordsRepository.update(cardLanguageId, preparedWords);
    }

    return getWordsDTO(updatedWords);
  };
}
