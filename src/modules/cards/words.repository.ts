import { DeepPartial, FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../data-source';
import { WordToCreate } from './types';
import { Word } from './word.entity';

export class WordsRepository {
  static findAllByCondition = async (whereCondition: FindOptionsWhere<Word>): Promise<Word[] | null> => {
    const words = await Word.find({
      where: whereCondition,
    });

    return words;
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
