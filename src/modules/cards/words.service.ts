import { FindOptionsWhere } from 'typeorm';
import { CreateWordsData, UpdateWordsData, WordToCreate } from './types';
import { getWordsDTO, prepareWordsToCreate } from './utils';
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

    return getWordsDTO(createdWords);
  };

  static updateLanguageId = async (cardId: number, oldLanguageId: number, newLanguageId: number): Promise<WordDTO[]> => {
    const updatedWords = await WordsRepository.updateLanguageId(cardId, oldLanguageId, newLanguageId);
    return getWordsDTO(updatedWords);
  };

  static update = async (cardLanguageId: number, wordsData: UpdateWordsData): Promise<WordDTO[]> => {
    let updatedWords: Word[] | null = null;

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

    return getWordsDTO(updatedWords);
  };
}
