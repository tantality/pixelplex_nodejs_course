import { IWord } from './types';

type PartialWord = Pick<IWord, 'id' | 'value'>;

export class WordDTO implements PartialWord {
  public readonly id: number;
  public readonly value: string;
  constructor(word: IWord | PartialWord) {
    this.id = word.id;
    this.value = word.value;
  }
}
