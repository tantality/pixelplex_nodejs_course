import { FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../data-source';
import { Card } from './card.entity';

export class CardsRepository {
  static findOneByCondition = async (whereCondition: FindOptionsWhere<Card>): Promise<Card | null> => {
    const card = await Card.findOneBy(whereCondition);
    return card;
  };

  static create = async (userId: number, nativeLanguageId: number, foreignLanguageId: number): Promise<Card> => {
    const createdCard = Card.create({ userId, nativeLanguageId, foreignLanguageId });
    const savedCard = await Card.save(createdCard);

    return savedCard;
  };

  static update = async (userId: number, id: number, foreignLanguageId?: number): Promise<Card> => {
    const updateResult = await AppDataSource.createQueryBuilder()
      .update(Card)
      .set({ foreignLanguageId })
      .where('id=:id', { id })
      .andWhere('userId=:userId', { userId })
      .returning('*')
      .execute();
    const updatedCard = updateResult.raw[0];

    return updatedCard;
  };
}
