import { IWord } from './types';
import { Word } from './word.entity';

export class WordDTO implements Pick<IWord, 'id' | 'value'> {
  public readonly id: number;
  public readonly value: string;
  constructor(word: Word) {
    this.id = word.id;
    this.value = word.value;
  }
}
