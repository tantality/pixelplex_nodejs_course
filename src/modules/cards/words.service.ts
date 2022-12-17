import { FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { CreateWordsData, FindAnswersQueryResult, UpdateWordsData, WordToCreate } from './types';
import { WordDTO } from './word.dto';
import { Word } from './word.entity';
import { WordsRepository } from './words.repository';

export class WordsService {
  private static prepareWordsToCreate = ({ cardId, languageId, values }: CreateWordsData): WordToCreate[] => {
    const preparedWords: WordToCreate[] = values.map((value) => {
      return { cardId, languageId, value } as WordToCreate;
    });

    return preparedWords;
  };

  private static getWordDTO = (words: Word[]): WordDTO[] => {
    return words.map((word) => new WordDTO(word));
  };

  static findAllByCondition = async (whereCondition: FindOptionsWhere<Word>): Promise<Word[] | null> => {
    const words = await WordsRepository.findAllByCondition(whereCondition);
    return words;
  };

  static findOneWithJoinedCard = async (id: number): Promise<Word | null> => {
    const word = await WordsRepository.findOneWithJoinedCard(id);
    return word;
  };

  static findCardIdsByConditionQueryBuilder = (
    userId: number,
    nativeLanguageId: number,
    foreignLanguageId: number,
    value: string,
  ): SelectQueryBuilder<Word> => {
    const queryBuilder = WordsRepository.findCardIdsByConditionQueryBuilder(userId, nativeLanguageId, foreignLanguageId, value);
    return queryBuilder;
  };

  static findCorrectAnswersToTask = async (cardIdsQueryBuilder: SelectQueryBuilder<Word>, languageId: number): Promise<string[]> => {
    const { answers }: FindAnswersQueryResult = await WordsRepository.findCorrectAnswersToTask(cardIdsQueryBuilder, languageId);
    if (!answers) {
      return [];
    }
    return answers;
  };

  static create = async (wordsData: CreateWordsData): Promise<WordDTO[]> => {
    const preparedWords: WordToCreate[] = WordsService.prepareWordsToCreate(wordsData);
    const createdWords = await WordsRepository.create(preparedWords);
    const createdWordsDTO = WordsService.getWordDTO(createdWords);

    return createdWordsDTO;
  };

  static updateLanguageId = async (cardId: number, oldLanguageId: number, newLanguageId: number): Promise<WordDTO[]> => {
    const updatedWords = await WordsRepository.updateLanguageId(cardId, oldLanguageId, newLanguageId);
    return WordsService.getWordDTO(updatedWords);
  };

  static update = async (cardLanguageId: number, wordsData: UpdateWordsData): Promise<WordDTO[]> => {
    let updatedWords = null;
    let updatedWordsDTO = null;

    if (!wordsData.values) {
      updatedWords = (await WordsService.findAllByCondition({
        cardId: wordsData.cardId,
        languageId: cardLanguageId,
      })) as Word[];
    }

    if (!updatedWords) {
      const preparedWords: WordToCreate[] = WordsService.prepareWordsToCreate(wordsData as CreateWordsData);
      updatedWords = await WordsRepository.update(cardLanguageId, preparedWords);
    }

    updatedWordsDTO = WordsService.getWordDTO(updatedWords);

    return updatedWordsDTO;
  };
}
