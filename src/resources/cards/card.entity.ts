let cardCounter = 1;

export class Card {
  id: number;

  constructor(
    public readonly userId: number,
    public readonly nativeLanguageId: number,
    public readonly foreignLanguageId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.id = cardCounter;
    cardCounter += 1;
  }
}
