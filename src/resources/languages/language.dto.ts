import { Language } from './language.entity';
import { ILanguage } from './language.interface';

export class LanguageDTO implements Omit<ILanguage, 'updatedAt'> {
  public readonly id: number;
  public readonly name: string;
  public readonly code: string;
  public readonly createdAt: Date;
  constructor(language: Language) {
    this.id = language.id;
    this.name = language.name;
    this.code = language.code;
    this.createdAt = language.createdAt;
  }
}
