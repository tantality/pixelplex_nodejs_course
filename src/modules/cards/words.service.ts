import { FindOptionsWhere } from 'typeorm';
import { CreateWordsData, UpdateWordsData, WordToCreate } from './types';
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

  private static getWordDTOs = (words: Word[]): WordDTO[] => {
    return words.map((word) => new WordDTO(word));
  };

  static findAllByCondition = async (whereCondition: FindOptionsWhere<Word>): Promise<Word[] | null> => {
    const words = await WordsRepository.findAllByCondition(whereCondition);
    return words;
  };

  static create = async (wordsData: CreateWordsData): Promise<WordDTO[]> => {
    const preparedWords: WordToCreate[] = WordsService.prepareWordsToCreate(wordsData);
    const createdWords = await WordsRepository.create(preparedWords);
    const createdWordsDTOs = WordsService.getWordDTOs(createdWords);

    return createdWordsDTOs;
  };

  static updateLanguageId = async (cardId: number, oldLanguageId: number, newLanguageId: number): Promise<WordDTO[]> => {
    const updatedWords = await WordsRepository.updateLanguageId(cardId, oldLanguageId, newLanguageId);
    return WordsService.getWordDTOs(updatedWords);
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
      const preparedWords: WordToCreate[] = WordsService.prepareWordsToCreate(wordsData as CreateWordsData);
      updatedWords = await WordsRepository.update(cardLanguageId, preparedWords);
    }

    updatedWordsDTOs = WordsService.getWordDTOs(updatedWords);

    return updatedWordsDTOs;
  };
}