import { FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../data-source';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { CardToTransform, CARD_SORT_BY, GetCardsQuery } from './types';
import { getCardsAndTheirNumber } from './utils';

export class CardsRepository {
  private static createSubqueryToFindWords = (userId: number, languageIdType: 'foreignLanguageId' | 'nativeLanguageId'): string => {
    return `
      (
        SELECT "w"."id" AS "id", "w"."value" AS "value", "w"."cardId" AS "cardId"
        FROM "cards" AS "c" LEFT JOIN "words" AS "w"
              ON "c"."id"="w"."cardId"
        WHERE "c"."userId"=${userId} AND "c"."${languageIdType}" = "w"."languageId"
        GROUP BY  "w"."cardId", "w"."id"
      )`;
  };

  private static createSubqueryToGroupWords = (findWordsSubquery: string, orderByWordCondition: string): string => {
    return `
      (
        SELECT ARRAY_AGG("w"."id" ${orderByWordCondition}) AS "ids", ARRAY_AGG("w"."value" ${orderByWordCondition}) AS "values", "w"."cardId" AS "cardId"
        FROM ${findWordsSubquery} AS "w"
        GROUP BY "w"."cardId"
      )`;
  };

  private static getSortingCondition = (sortBy: string, sortDirection: string, currentProperty: CARD_SORT_BY): string => {
    let sortingCondition = '';

    if (sortBy === currentProperty) {
      switch (sortBy) {
      case CARD_SORT_BY.WORD: {
        sortingCondition = `ORDER BY "w"."value" ${sortDirection} `;
        break;
      }
      case CARD_SORT_BY.DATE: {
        sortingCondition = `ORDER BY "c"."createdAt" ${sortDirection}`;
        break;
      }
      }
    }

    return sortingCondition;
  };

  static findAndCountAll = async (
    userId: number,
    { search, sortBy, sortDirection, limit, offset, languageId }: GetCardsQuery,
  ): Promise<{ count: number; cards: CardDTO[] }> => {
    let additionalLanguageIdCondition = '';
    if (typeof languageId === 'number') {
      additionalLanguageIdCondition = `AND ("c"."nativeLanguageId"=${languageId} OR "c"."foreignLanguageId"=${languageId})`;
    }

    const orderByDateCondition = CardsRepository.getSortingCondition(sortBy, sortDirection, CARD_SORT_BY.DATE);
    const orderByWordCondition = CardsRepository.getSortingCondition(sortBy, sortDirection, CARD_SORT_BY.WORD);

    let searchByWordCondition = '';
    if (search) {
      searchByWordCondition = `
        HAVING 
          ARRAY_TO_STRING("nativeWords"."values", ',') LIKE '%${search}%' 
          OR ARRAY_TO_STRING("foreignWords"."values", ',') LIKE '%${search}%'
      `;
    }

    const findNativeWordsSubquery = CardsRepository.createSubqueryToFindWords(userId, 'nativeLanguageId');
    const groupNativeWordsSubquery = CardsRepository.createSubqueryToGroupWords(findNativeWordsSubquery, orderByWordCondition);
    const findForeignWordsSubquery = CardsRepository.createSubqueryToFindWords(userId, 'foreignLanguageId');
    const groupForeignWordsSubquery = CardsRepository.createSubqueryToGroupWords(findForeignWordsSubquery, orderByWordCondition);

    const findAndCountCardsSubquery = `
    (
      SELECT
        "c"."id" AS "id", "c"."nativeLanguageId","c"."foreignLanguageId",
        "nativeWords"."ids" AS "nativeWordIds",
        "nativeWords"."values" AS "nativeWordValues",
        "foreignWords"."ids" AS "foreignWordIds",
        "foreignWords"."values" AS "foreignWordValues",
        "c"."createdAt" AS "createdAt",
        COUNT(*) OVER() AS "count"
      FROM
        ${groupNativeWordsSubquery} AS "nativeWords",
        ${groupForeignWordsSubquery}  AS "foreignWords",
        "cards" AS "c" LEFT JOIN "words" AS "w" ON "c"."id"= "w"."cardId"
      WHERE
        "c"."userId"=${userId}
        AND "c"."nativeLanguageId" ="w"."languageId"
        AND "c"."id"="nativeWords"."cardId"
        AND "c"."id"="foreignWords"."cardId"
        ${additionalLanguageIdCondition}
      GROUP BY
        "c"."id","c"."nativeLanguageId","c"."foreignLanguageId",
        "c"."createdAt","nativeWords"."cardId","foreignWords"."cardId","nativeWords"."values", "foreignWords"."values", "nativeWords"."ids","foreignWords"."ids"
      ${searchByWordCondition} 
      ${orderByDateCondition}
      LIMIT ${limit} OFFSET ${offset}
    )`;

    const cardsAndTheirNumberQueryResult: [{ cards: CardToTransform[]; count: string }] = await AppDataSource.query(`
      SELECT
        ARRAY_AGG(JSON_BUILD_OBJECT('id',"cards"."id", 'nativeLanguageId', "cards"."nativeLanguageId", 'foreignLanguageId', "cards"."foreignLanguageId",
        'nativeWordIds', "cards"."nativeWordIds", 'nativeWordValues', "cards"."nativeWordValues", 'foreignWordIds', "cards"."foreignWordIds",
        'foreignWordValues', "cards"."foreignWordValues", 'createdAt', "cards"."createdAt")) AS "cards",
        "cards"."count" AS "count"
      FROM ${findAndCountCardsSubquery} AS "cards"
      GROUP BY "cards"."count"
    `);

    return getCardsAndTheirNumber(cardsAndTheirNumberQueryResult);
  };

  static findOneByCondition = async (whereCondition: FindOptionsWhere<Card> | FindOptionsWhere<Card>[]): Promise<Card | null> => {
    const card = await Card.findOne({ where: whereCondition });
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

  static delete = async (id: number): Promise<void> => {
    await Card.delete({ id });
  };
}
