import { Card } from './card.entity';
import { ICard } from './types';
import { WordDTO } from './word.dto';

export class CardDTO implements Omit<ICard, 'userId' | 'updatedAt'> {
  public readonly id: number;
  public readonly nativeLanguageId: number;
  public readonly nativeWords: WordDTO[];
  public readonly foreignLanguageId: number;
  public readonly foreignWords: WordDTO[];
  public readonly createdAt: Date;
  constructor(card: Card, nativeWords: WordDTO[], foreignWords: WordDTO[]) {
    this.id = card.id;
    this.nativeLanguageId = card.nativeLanguageId;
    this.nativeWords = nativeWords;
    this.foreignLanguageId = card.foreignLanguageId;
    this.foreignWords = foreignWords;
    this.createdAt = card.createdAt;
  }
}
