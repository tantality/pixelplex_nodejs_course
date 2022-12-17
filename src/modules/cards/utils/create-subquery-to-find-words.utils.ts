export const createSubqueryToFindWords = (userId: number, languageIdType: 'foreignLanguageId' | 'nativeLanguageId'): string => {
  return `
    (
      SELECT "w"."id" AS "id", "w"."value" AS "value", "w"."cardId" AS "cardId"
      FROM "cards" AS "c" LEFT JOIN "words" AS "w"
            ON "c"."id"="w"."cardId"
      WHERE "c"."userId"=${userId} AND "c"."${languageIdType}" = "w"."languageId"
      GROUP BY  "w"."cardId", "w"."id"
    )`;
};
