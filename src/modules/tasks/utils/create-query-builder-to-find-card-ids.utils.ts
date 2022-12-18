import { SelectQueryBuilder } from 'typeorm';
import { Word } from '../../cards/word.entity';

export const createQueryBuilderToFindCardIds = (
  userId: number,
  nativeLanguageId: number,
  foreignLanguageId: number,
  wordValue: string,
): SelectQueryBuilder<Word> => {
  return Word.createQueryBuilder('word')
    .select('word.cardId')
    .leftJoin('word.card', 'card')
    .where(`card.userId = ${userId}`)
    .andWhere(`card.nativeLanguageId = ${nativeLanguageId}`)
    .andWhere(`card.foreignLanguageId = ${foreignLanguageId}`)
    .andWhere(`word.value = '${wordValue}'`);
};
