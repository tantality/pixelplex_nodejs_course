import { FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../data-source';
import { CardDTO } from './card.dto';
import { Card } from './card.entity';
import { CardToTransform, CARD_SORT_BY, GetCardsCommon, GetCardsQuery } from './types';

export class CardsRepository {
  private static getCardsAndTheirCount = (queryResult: [{ cards: CardToTransform[]; count: string }]): GetCardsCommon => {
    if (!queryResult.length) {
      return { count: 0, cards: [] };
    }

    const [{ cards, count }] = queryResult;

    const preparedCards = CardsRepository.transformCards(cards);

    return { count: Number(count), cards: preparedCards };
  };

  private static transformCards = (cards: CardToTransform[]): CardDTO[] => {
    const transformedCards: CardDTO[] = cards.map((card: CardToTransform) => {
      const { id, nativeLanguageId, foreignLanguageId, nativeWordIds, nativeWordValues, foreignWordIds, foreignWordValues, createdAt } =
        card;

      const nativeWords = CardsRepository.getWords(nativeWordIds, nativeWordValues);
      const foreignWords = CardsRepository.getWords(foreignWordIds, foreignWordValues);

      return {
        id,
        nativeLanguageId,
        foreignLanguageId,
        nativeWords,
        foreignWords,
        createdAt,
      } as CardDTO;
    });

    return transformedCards;
  };

  private static getWords = (wordIds: number[], wordValues: string[]): { id: number; value: string }[] => {
    return wordIds.map((id, ind) => ({ id, value: wordValues[ind] }));
  };

  private static getQueryStringForWords = (
    userId: number,
    nameOfLanguageId: 'foreignLanguageId' | 'nativeLanguageId',
  ): string => {
    return `
    (
      SELECT "w"."id" AS "id", "w"."value" AS "value", "w"."cardId" AS "cardId"
      FROM "cards" AS "c" LEFT JOIN "words" AS "w"
            ON "c"."id"="w"."cardId"
      WHERE "c"."userId"=${userId} AND "c"."${nameOfLanguageId}" = "w"."languageId"
      GROUP BY  "w"."cardId", "w"."id"
    )`;
  };

  private static groupWordsQueryString = (wordsQueryString: string, orderByWordQueryString: string): string => {
    return `
    (
      SELECT ARRAY_AGG("w"."id" ${orderByWordQueryString}) AS "ids", ARRAY_AGG("w"."value" ${orderByWordQueryString}) AS "values", "w"."cardId" AS "cardId"
      FROM ${wordsQueryString} AS "w"
      GROUP BY "w"."cardId"
    )`;
  };

  static findAndCountAll = async (
    userId: number,
    { search, sortBy, sortDirection, limit, offset, languageId }: GetCardsQuery,
  ): Promise<GetCardsCommon> => {
    let languageIdCondition = '';
    if (typeof languageId === 'number') {
      languageIdCondition = `AND ("c"."nativeLanguageId"=${languageId} OR "c"."foreignLanguageId"=${languageId})`;
    }

    const orderByDateQueryString = sortBy === CARD_SORT_BY.DATE ? `ORDER BY "c"."createdAt" ${sortDirection}` : '';
    const orderByWordQueryString = sortBy === CARD_SORT_BY.WORD ? `ORDER BY "w"."value" ${sortDirection} ` : '';

    let searchInArrayQueryString = '';
    if (search) {
      searchInArrayQueryString = `
        HAVING 
          ARRAY_TO_STRING("nativeWords"."values", ',') LIKE '%${search}%' 
          OR ARRAY_TO_STRING("foreignWords"."values", ',') LIKE '%${search}%'
      `;
    }

    const nativeWordsQueryString = CardsRepository.getQueryStringForWords(userId, 'nativeLanguageId');
    const groupedNativeWordsQueryString = CardsRepository.groupWordsQueryString(nativeWordsQueryString, orderByWordQueryString);
    const foreignWordsQueryString = CardsRepository.getQueryStringForWords(userId, 'foreignLanguageId');
    const groupedForeignWordsQueryString = CardsRepository.groupWordsQueryString(foreignWordsQueryString, orderByWordQueryString);

    const cardsQueryString = `
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
        ${groupedNativeWordsQueryString} AS "nativeWords",
        ${groupedForeignWordsQueryString}  AS "foreignWords",
        "cards" AS "c" LEFT JOIN "words" AS "w" ON "c"."id"= "w"."cardId"
      WHERE
        "c"."userId"=${userId}
        AND "c"."nativeLanguageId" ="w"."languageId"
        AND "c"."id"="nativeWords"."cardId"
        AND "c"."id"="foreignWords"."cardId"
        ${languageIdCondition}
      GROUP BY
        "c"."id","c"."nativeLanguageId","c"."foreignLanguageId",
        "c"."createdAt","nativeWords"."cardId","foreignWords"."cardId","nativeWords"."values", "foreignWords"."values", "nativeWords"."ids","foreignWords"."ids"
        ${searchInArrayQueryString} 
        ${orderByDateQueryString}
      LIMIT ${limit} OFFSET ${offset}
    )`;

    const cardsAndTheirNumberQueryResult: [{ cards: CardToTransform[]; count: string }] = await AppDataSource.query(`
      SELECT
        ARRAY_AGG(JSON_BUILD_OBJECT('id',"cards"."id", 'nativeLanguageId', "cards"."nativeLanguageId", 'foreignLanguageId', "cards"."foreignLanguageId",
        'nativeWordIds', "cards"."nativeWordIds", 'nativeWordValues', "cards"."nativeWordValues", 'foreignWordIds', "cards"."foreignWordIds",
        'foreignWordValues', "cards"."foreignWordValues", 'createdAt', "cards"."createdAt")) AS "cards",
        "cards"."count" AS "count"
      FROM ${cardsQueryString} AS "cards"
      GROUP BY "cards"."count"
    `);

    const { count, cards } = CardsRepository.getCardsAndTheirCount(cardsAndTheirNumberQueryResult);

    return { count, cards };
  };

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

  static delete = async (id: number): Promise<void> => {
    await Card.delete({ id });
  };
}
