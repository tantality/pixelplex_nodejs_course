import { IWord } from './word.interface';

let wordCounter = 1;

export class Word implements IWord {
  id: number;

  constructor(
    public readonly languageId: number,
    public readonly cardId: number,
    public readonly value: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.id = wordCounter;
    wordCounter += 1;
  }
}
