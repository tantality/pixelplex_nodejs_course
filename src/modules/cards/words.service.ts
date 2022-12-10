import { CreateWordsData, WordToCreate } from './types';
import { prepareWordsToCreate } from './utils';
import { WordDTO } from './word.dto';
import { WordsRepository } from './words.repository';

export class WordsService {
  static create = async (wordsData: CreateWordsData): Promise<WordDTO[]> => {
    const preparedWords: WordToCreate[] = prepareWordsToCreate(wordsData);
    const createdWords = await WordsRepository.create(preparedWords);
    const createdWordsDTOs = createdWords.map((word) => new WordDTO(word));

    return createdWordsDTOs;
  };
}
