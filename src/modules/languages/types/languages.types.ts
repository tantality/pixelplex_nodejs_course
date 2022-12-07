export interface ILanguage {
  id: number;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum LANGUAGE_SORT_BY {
  NAME = 'name',
  DATE = 'date',
}
