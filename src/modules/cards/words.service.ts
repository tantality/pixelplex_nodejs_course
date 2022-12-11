import { FindOptionsWhere } from 'typeorm';
import { CreateWordsData, UpdateWordsData, WordToCreate } from './types';
import { prepareWordsToCreate } from './utils';
import { WordDTO } from './word.dto';
import { Word } from './word.entity';
import { WordsRepository } from './words.repository';

export class WordsService {
  static findAllByCondition = async (whereCondition: FindOptionsWhere<Word>): Promise<Word[] | null> => {
    const words = await WordsRepository.findAllByCondition(whereCondition);
    return words;
  };

  static create = async (wordsData: CreateWordsData): Promise<WordDTO[]> => {
    const preparedWords: WordToCreate[] = prepareWordsToCreate(wordsData);
    const createdWords = await WordsRepository.create(preparedWords);
    const createdWordsDTOs = createdWords.map((word) => new WordDTO(word));

    return createdWordsDTOs;
  };

  static updateLanguageId = async (cardId: number, oldLanguageId: number, newLanguageId: number): Promise<WordDTO[]> => {
    const updatedWords = await WordsRepository.updateLanguageId(cardId, oldLanguageId, newLanguageId);
    return updatedWords.map((word) => new WordDTO(word));
  };

  static update = async (cardLanguageId: number, wordsData: UpdateWordsData): Promise<WordDTO[]> => {
    let updatedWords = null;
    let updatedWordsDTOs = null;

    if (!wordsData.values) {
      updatedWords = (await WordsService.findAllByCondition({
        cardId: wordsData.cardId,
        languageId: cardLanguageId,
      })) as Word[];
    }

    if (!updatedWords) {
      const preparedWords: WordToCreate[] = prepareWordsToCreate(wordsData as CreateWordsData);
      updatedWords = await WordsRepository.update(cardLanguageId, preparedWords);
    }

    updatedWordsDTOs = updatedWords.map((word) => new WordDTO(word));

    return updatedWordsDTOs;
  };
}
