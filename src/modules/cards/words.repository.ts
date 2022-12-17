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

  static findCardIdsByConditionQueryBuilder = (
    userId: number,
    nativeLanguageId: number,
    foreignLanguageId: number,
    value: string,
  ): SelectQueryBuilder<Word> => {
    return Word.createQueryBuilder('word')
      .select('word.cardId')
      .leftJoin('word.card', 'card')
      .where(`card.userId = ${userId}`)
      .andWhere(`card.nativeLanguageId = ${nativeLanguageId}`)
      .andWhere(`card.foreignLanguageId = ${foreignLanguageId}`)
      .andWhere(`word.value = '${value}'`);
  };

  static findCorrectAnswersToTask = async (
    cardIdsQueryBuilder: SelectQueryBuilder<Word>,
    languageId: number,
  ): Promise<FindAnswersQueryResult> => {
    const answers = await Word.createQueryBuilder('word')
      .select('array_agg(DISTINCT "word"."value") as "answers"')
      .where(`word.cardId IN ( ${cardIdsQueryBuilder.getQuery()} )`)
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

    const updatedWords = await WordsRepository.create(words);

    return updatedWords;
  };

  static deleteByCondition = async (whereCondition: FindOptionsWhere<Word>): Promise<void> => {
    await Word.delete(whereCondition);
  };
}
