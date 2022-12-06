import { ILanguage } from './types';

export class LanguageDTO implements Omit<ILanguage, 'updatedAt'> {
  public readonly id: number;
  public readonly name: string;
  public readonly code: string;
  public readonly createdAt: Date;
  constructor(language: ILanguage) {
    this.id = language.id;
    this.name = language.name;
    this.code = language.code;
    this.createdAt = language.createdAt;
  }
}
