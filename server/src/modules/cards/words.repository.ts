import { DeepPartial, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import AppDataSource from '../../data-source';
import { FindAnswersQueryResult, WordToCreate } from './types';
import { Word } from './word.entity';

export class WordsRepository {
  static findAllByCondition = async (whereCondition: FindOptionsWhere<Word>): Promise<Word[] | null> => {
    const words = await Word.find({
      where: whereCondition,
    });

    return words;
  };

  static findOneWithJoinedCard = async (id: number): Promise<Word | null> => {
    const word = await Word.createQueryBuilder('word').leftJoinAndSelect('word.card', 'card').where('word.id = :id', { id }).getOne();
    return word;
  };

  static findRandomOne = async (
    userId: number,
    cardNativeLanguageId: number,
    cardForeignLanguageId: number,
    wordLanguageId: number,
  ): Promise<Word | null> => {
    const word = await Word.createQueryBuilder('word')
      .leftJoinAndSelect('word.card', 'card')
      .where('card.userId=:userId', { userId })
      .andWhere('card.nativeLanguageId=:nativeLanguageId', { cardNativeLanguageId })
      .andWhere('card.foreignLanguageId=:foreignLanguageId', { cardForeignLanguageId })
      .andWhere('word.languageId=:languageId', { wordLanguageId })
      .orderBy('RANDOM()')
      .getOne();

    return word;
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
