import { CreateWordsData, WordToCreate } from '../types';

export const prepareWordsToCreate = ({ cardId, languageId, values }: CreateWordsData): WordToCreate[] => {
  const preparedWords: WordToCreate[] = values.map((value) => {
    return { cardId, languageId, value } as WordToCreate;
  });

  return preparedWords;
};
