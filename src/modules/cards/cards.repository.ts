import { Card } from './card.entity';

export class CardsRepository {
  static create = async (userId: number, nativeLanguageId: number, foreignLanguageId: number): Promise<Card> => {
    const createdCard = Card.create({ userId, nativeLanguageId, foreignLanguageId });
    const savedCard = await Card.save(createdCard);

    return savedCard;
  };
}
