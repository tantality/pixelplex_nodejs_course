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
export type UpdateWordsData = Partial<Omit<CreateWordsData, 'cardId'>> & Pick<CreateWordsData, 'cardId'>;
export type FindAnswersQueryResult = { answers: string[] | null };
export type WordValueWithCardLanguages = { value: string; card: { nativeLanguageId: number; foreignLanguageId: number } };
