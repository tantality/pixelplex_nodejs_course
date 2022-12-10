export interface IWord {
  id: number;
  languageId: number;
  cardId: number;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WordToCreate = Pick<IWord, 'cardId' | 'languageId' | 'value'>;
export type CreateWordsData = { cardId: number; languageId: number; values: string[] };
