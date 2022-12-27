import { DeepPartial, FindManyOptions, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import AppDataSource from '../../data-source';
import { FindAnswersQueryResult, WordToCreate } from './types';
import { getRandomInt } from './utils';
import { Word } from './word.entity';

export class WordsRepository {
  static findAllByCondition = async (condition: FindManyOptions<Word>): Promise<Word[] | null> => {
    const words = await Word.find(condition);

    return words;
  };

  static findOneWithJoinedCard = async (id: number): Promise<Word | null> => {
    const word = await Word.createQueryBuilder('word').leftJoinAndSelect('word.card', 'card').where('word.id = :id', { id }).getOne();
    return word;
  };

  static countAll = async (whereCondition: FindOptionsWhere<Word>): Promise<number> => {
    const count = await Word.countBy(whereCondition);
    return count;
  };

  static findRandomOne = async (
    userId: number,
    cardNativeLanguageId: number,
    cardForeignLanguageId: number,
    wordLanguageId: number,
  ): Promise<Word | null> => {
    const whereCondition: FindOptionsWhere<Word> = {
      languageId: wordLanguageId,
      card: { userId, nativeLanguageId: cardNativeLanguageId, foreignLanguageId: cardForeignLanguageId },
    };

    const wordCount = await WordsRepository.countAll(whereCondition);
    const randomWordIndex = getRandomInt(wordCount);

    const word = await WordsRepository.findAllByCondition({
      where: whereCondition,
      skip: randomWordIndex,
      take: 1,
    });

    return word ? word[0] : null;
  };

  static findCorrectAnswersToTask = async (
    findCardIdsQueryBuilder: SelectQueryBuilder<Word>,
    languageId: number,
  ): Promise<FindAnswersQueryResult> => {
    const answers = await Word.createQueryBuilder('word')
      .select('ARRAY_AGG(DISTINCT "word"."value") AS "answers"')
      .where(`word.cardId IN ( ${findCardIdsQueryBuilder.getQuery()} )`)
      .andWhere('word.languageId = :languageId', { languageId })
      .getRawOne();

    return answers;
  };

  static createQueryBuilderToFindCardIds = (
    userId: number,
    nativeLanguageId: number,
    foreignLanguageId: number,
    wordValue: string,
  ): SelectQueryBuilder<Word> => {
    return Word.createQueryBuilder('word')
      .select('word.cardId')
      .leftJoin('word.card', 'card')
      .where(`card.userId = ${userId}`)
      .andWhere(`card.nativeLanguageId = ${nativeLanguageId}`)
      .andWhere(`card.foreignLanguageId = ${foreignLanguageId}`)
      .andWhere(`word.value = '${wordValue}'`);
  };

  static create = async (words: WordToCreate[]): Promise<Word[]> => {
    const createdWords = Word.create(words as DeepPartial<Word[]>);
    const savedWords = await Word.save(createdWords);

    return savedWords;
  };

  static updateLanguageId = async (cardId: number, oldLanguageId: number, newLanguageId: number): Promise<Word[]> => {
    const updateResult = await AppDataSource.createQueryBuilder()
      .update(Word)
      .set({ languageId: newLanguageId })
      .where('cardId=:cardId', { cardId })
      .andWhere('languageId=:languageId', { languageId: oldLanguageId })
      .returning('*')
      .execute();
    const updatedWords = updateResult.raw;

    return updatedWords;
  };

  static update = async (cardLanguageId: number, words: WordToCreate[]): Promise<Word[]> => {
    const cardId = words[0].cardId;

    await WordsRepository.deleteByCondition({ cardId, languageId: cardLanguageId });

    const createdWords = await WordsRepository.create(words);

    return createdWords;
  };

  static deleteByCondition = async (whereCondition: FindOptionsWhere<Word>): Promise<void> => {
    await Word.delete(whereCondition);
  };
}
