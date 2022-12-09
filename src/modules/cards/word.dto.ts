import { IWord } from './types';
import { Word } from './word.entity';

type PartialWord = Pick<IWord, 'id' | 'value'>;

export class WordDTO implements PartialWord {
  public readonly id: number;
  public readonly value: string;
  constructor(word: Word | PartialWord) {
    this.id = word.id;
    this.value = word.value;
  }
}
