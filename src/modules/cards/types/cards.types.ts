export interface ICard {
  id: number;
  userId: number;
  nativeLanguageId: number;
  foreignLanguageId: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum CARD_SORT_BY {
  WORD = 'word',
  DATE = 'date',
}
