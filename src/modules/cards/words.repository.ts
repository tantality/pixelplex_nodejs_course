import { DeepPartial } from 'typeorm';
import { WordToCreate } from './types';
import { Word } from './word.entity';

export class WordsRepository {
  static create = async (words: WordToCreate[]): Promise<Word[]> => {
    const createdWords = Word.create(words as DeepPartial<Word[]>);
    const savedWords = await Word.save(createdWords);

    return savedWords;
  };
}
